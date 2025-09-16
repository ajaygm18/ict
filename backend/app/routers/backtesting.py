"""
Backtesting API Router
Handles backtesting functionality
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, date
import pandas as pd
import numpy as np
from ..core.ict_agent import ICTTradingAgent

router = APIRouter()

class BacktestRequest(BaseModel):
    symbol: str
    strategy: str
    start_date: str
    end_date: str
    initial_capital: float = 10000.0
    risk_per_trade: float = 1.0  # percentage
    timeframe: str = "1h"

class BacktestResult(BaseModel):
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    total_return: float
    max_drawdown: float
    sharpe_ratio: float
    profit_factor: float
    final_capital: float

def get_ict_agent():
    """Dependency to get ICT agent instance"""
    return ICTTradingAgent()

class BacktestEngine:
    """Backtesting engine for ICT strategies"""
    
    def __init__(self, initial_capital: float = 10000.0, risk_per_trade: float = 1.0):
        self.initial_capital = initial_capital
        self.current_capital = initial_capital
        self.risk_per_trade = risk_per_trade
        self.trades = []
        self.equity_curve = []
        
    def run_backtest(self, agent: ICTTradingAgent, symbol: str, strategy: str, 
                    start_date: str, end_date: str, timeframe: str = "1h") -> Dict:
        """Run backtest for a strategy"""
        
        # Get historical data
        try:
            data = agent.get_market_data(symbol, period="2y", interval=timeframe)
            
            # Filter data by date range
            data = data.loc[start_date:end_date]
            
            if data.empty:
                raise ValueError("No data available for the specified date range")
            
            # Generate signals for the entire period
            signals = agent.generate_signals(symbol, strategy)
            
            # Execute trades based on signals
            self._execute_trades(data, signals)
            
            # Calculate performance metrics
            results = self._calculate_metrics()
            
            return results
            
        except Exception as e:
            raise Exception(f"Backtest failed: {str(e)}")
    
    def _execute_trades(self, data: pd.DataFrame, signals: list):
        """Execute trades based on signals"""
        
        for signal in signals:
            try:
                # Check if signal timestamp exists in data
                if signal.timestamp not in data.index:
                    continue
                
                # Calculate position size based on risk
                risk_amount = self.current_capital * (self.risk_per_trade / 100)
                stop_distance = abs(signal.entry_price - signal.stop_loss)
                
                if stop_distance == 0:
                    continue
                
                position_size = risk_amount / stop_distance
                
                # Simulate trade execution
                entry_price = signal.entry_price
                
                # Find exit point (simplified - use next available data point)
                signal_idx = data.index.get_loc(signal.timestamp)
                
                if signal_idx < len(data) - 1:
                    # Check for stop loss or take profit hit
                    future_data = data.iloc[signal_idx + 1:]
                    
                    exit_price = None
                    exit_reason = "time_exit"
                    
                    for idx, row in future_data.iterrows():
                        if signal.signal_type == "BUY":
                            if row['Low'] <= signal.stop_loss:
                                exit_price = signal.stop_loss
                                exit_reason = "stop_loss"
                                break
                            elif row['High'] >= signal.take_profit:
                                exit_price = signal.take_profit
                                exit_reason = "take_profit"
                                break
                        elif signal.signal_type == "SELL":
                            if row['High'] >= signal.stop_loss:
                                exit_price = signal.stop_loss
                                exit_reason = "stop_loss"
                                break
                            elif row['Low'] <= signal.take_profit:
                                exit_price = signal.take_profit
                                exit_reason = "take_profit"
                                break
                    
                    # If no exit condition met, use close price of last available data
                    if exit_price is None:
                        exit_price = future_data['Close'].iloc[-1]
                        exit_reason = "time_exit"
                    
                    # Calculate trade result
                    if signal.signal_type == "BUY":
                        pnl = (exit_price - entry_price) * position_size
                    else:
                        pnl = (entry_price - exit_price) * position_size
                    
                    # Update capital
                    self.current_capital += pnl
                    
                    # Record trade
                    trade = {
                        "entry_time": signal.timestamp,
                        "exit_time": future_data.index[0] if len(future_data) > 0 else signal.timestamp,
                        "symbol": signal.symbol,
                        "signal_type": signal.signal_type,
                        "entry_price": entry_price,
                        "exit_price": exit_price,
                        "position_size": position_size,
                        "pnl": pnl,
                        "exit_reason": exit_reason,
                        "strategy": signal.strategy
                    }
                    
                    self.trades.append(trade)
                    
                    # Record equity point
                    self.equity_curve.append({
                        "timestamp": trade["exit_time"],
                        "equity": self.current_capital
                    })
                    
            except Exception as e:
                continue  # Skip problematic trades
    
    def _calculate_metrics(self) -> Dict:
        """Calculate backtest performance metrics"""
        if not self.trades:
            return {
                "total_trades": 0,
                "winning_trades": 0,
                "losing_trades": 0,
                "win_rate": 0.0,
                "total_return": 0.0,
                "max_drawdown": 0.0,
                "sharpe_ratio": 0.0,
                "profit_factor": 0.0,
                "final_capital": self.current_capital,
                "trades": [],
                "equity_curve": self.equity_curve
            }
        
        # Basic metrics
        total_trades = len(self.trades)
        winning_trades = len([t for t in self.trades if t['pnl'] > 0])
        losing_trades = len([t for t in self.trades if t['pnl'] < 0])
        win_rate = (winning_trades / total_trades) * 100 if total_trades > 0 else 0
        
        # Return calculation
        total_return = ((self.current_capital - self.initial_capital) / self.initial_capital) * 100
        
        # Max drawdown calculation
        peak = self.initial_capital
        max_drawdown = 0.0
        
        for equity_point in self.equity_curve:
            if equity_point['equity'] > peak:
                peak = equity_point['equity']
            
            drawdown = ((peak - equity_point['equity']) / peak) * 100
            if drawdown > max_drawdown:
                max_drawdown = drawdown
        
        # Profit factor
        gross_profit = sum([t['pnl'] for t in self.trades if t['pnl'] > 0])
        gross_loss = abs(sum([t['pnl'] for t in self.trades if t['pnl'] < 0]))
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else 0
        
        # Simplified Sharpe ratio (assuming risk-free rate = 0)
        returns = [t['pnl'] / self.initial_capital for t in self.trades]
        if len(returns) > 1:
            avg_return = np.mean(returns)
            return_std = np.std(returns)
            sharpe_ratio = (avg_return / return_std) * np.sqrt(252) if return_std > 0 else 0
        else:
            sharpe_ratio = 0
        
        return {
            "total_trades": total_trades,
            "winning_trades": winning_trades,
            "losing_trades": losing_trades,
            "win_rate": win_rate,
            "total_return": total_return,
            "max_drawdown": max_drawdown,
            "sharpe_ratio": sharpe_ratio,
            "profit_factor": profit_factor,
            "final_capital": self.current_capital,
            "trades": self.trades[-20:],  # Last 20 trades for display
            "equity_curve": self.equity_curve
        }

@router.post("/run")
async def run_backtest(
    request: BacktestRequest,
    agent: ICTTradingAgent = Depends(get_ict_agent)
):
    """Run a backtest for specified strategy and parameters"""
    try:
        engine = BacktestEngine(request.initial_capital, request.risk_per_trade)
        results = engine.run_backtest(
            agent=agent,
            symbol=request.symbol,
            strategy=request.strategy,
            start_date=request.start_date,
            end_date=request.end_date,
            timeframe=request.timeframe
        )
        
        return {
            "request": request.dict(),
            "results": results,
            "status": "completed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/example")
async def get_example_backtest():
    """Get example backtest results for demonstration"""
    return {
        "symbol": "EURUSD",
        "strategy": "silver_bullet",
        "period": "2023-01-01 to 2023-12-31",
        "results": {
            "total_trades": 156,
            "winning_trades": 94,
            "losing_trades": 62,
            "win_rate": 60.26,
            "total_return": 23.5,
            "max_drawdown": 8.2,
            "sharpe_ratio": 1.42,
            "profit_factor": 1.85,
            "final_capital": 12350.0
        },
        "status": "example"
    }
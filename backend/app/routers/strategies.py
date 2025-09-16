"""
Strategies API Router
Handles all ICT trading strategies endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from ..core.ict_agent import ICTTradingAgent, TradingSignal

router = APIRouter()

class StrategyRequest(BaseModel):
    symbol: str
    strategy: str = "comprehensive"
    timeframe: str = "1h"

class AnalysisRequest(BaseModel):
    symbol: str
    timeframe: str = "1h"

def get_ict_agent():
    """Dependency to get ICT agent instance"""
    return ICTTradingAgent()

@router.get("/")
async def get_all_strategies(agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get all available strategies"""
    return {
        "total_strategies": agent.get_strategy_count(),
        "strategies": list(agent.strategies.keys())
    }

@router.post("/analyze")
async def analyze_symbol(
    request: AnalysisRequest,
    agent: ICTTradingAgent = Depends(get_ict_agent)
):
    """Perform comprehensive ICT analysis on a symbol"""
    try:
        analysis = agent.analyze_symbol(request.symbol, request.timeframe)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signals")
async def generate_signals(
    request: StrategyRequest,
    agent: ICTTradingAgent = Depends(get_ict_agent)
):
    """Generate trading signals for a symbol using specified strategy"""
    try:
        signals = agent.generate_signals(request.symbol, request.strategy)
        
        # Convert signals to dict format for JSON serialization
        signals_dict = []
        for signal in signals:
            signals_dict.append({
                "timestamp": signal.timestamp.isoformat(),
                "symbol": signal.symbol,
                "signal_type": signal.signal_type,
                "entry_price": signal.entry_price,
                "stop_loss": signal.stop_loss,
                "take_profit": signal.take_profit,
                "confidence": signal.confidence,
                "strategy": signal.strategy,
                "concepts_used": signal.concepts_used,
                "risk_reward_ratio": signal.risk_reward_ratio
            })
        
        return {
            "symbol": request.symbol,
            "strategy": request.strategy,
            "timeframe": request.timeframe,
            "signals_count": len(signals_dict),
            "signals": signals_dict
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/strategies/{strategy_name}")
async def get_strategy_details(strategy_name: str, agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get details of a specific strategy"""
    if strategy_name not in agent.strategies:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    strategy_descriptions = {
        "silver_bullet": "15-minute window after NY Open high-probability setup",
        "asian_breakout": "Breakout from Asian session range during London open",
        "ny_reversal": "Reversal patterns during New York session",
        "london_killzone": "High-activity period during London open",
        "fvg_sniper": "Precise entries using Fair Value Gap analysis",
        "order_block": "Support/resistance from institutional order areas",
        "breaker_block": "Failed order blocks turned into opposite bias",
        "rejection_block": "Strong rejection from key levels",
        "smt_divergence": "Smart Money Divergence across correlated pairs",
        "turtle_soup": "Liquidity raid reversal strategy",
        "power_of_3": "Accumulation-Manipulation-Distribution model",
        "daily_bias": "Daily directional bias with liquidity raids",
        "optimal_trade_entry": "OTE zone entries with Fibonacci retracements"
    }
    
    return {
        "name": strategy_name,
        "description": strategy_descriptions.get(strategy_name, "ICT trading strategy"),
        "category": "ICT Strategy"
    }
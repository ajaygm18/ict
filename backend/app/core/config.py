"""
Core configuration for the ICT Trading AI Agent
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ICT Trading AI Agent"
    
    # Database
    DATABASE_URL: str = "sqlite:///./ict_trading.db"
    
    # Trading Configuration
    DEFAULT_TIMEFRAME: str = "1h"
    DEFAULT_RISK_PERCENT: float = 1.0
    MAX_POSITIONS: int = 3
    
    # Backtesting
    BACKTEST_START_DATE: str = "2020-01-01"
    BACKTEST_END_DATE: str = "2024-01-01"
    
    # Data Sources
    DATA_PROVIDER: str = "yfinance"  # yfinance, alpha_vantage, etc.
    
    # ICT Configuration
    KILLZONE_TIMES: dict = {
        "london_open": "08:00",
        "ny_open": "13:30",
        "london_close": "16:00",
        "asia_range": "00:00-06:00"
    }
    
    # Fibonacci Levels
    FIBONACCI_LEVELS: List[float] = [0.236, 0.382, 0.5, 0.618, 0.705, 0.786]
    
    class Config:
        env_file = ".env"


settings = Settings()
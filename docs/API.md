# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required for API access.

## Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "agent_status": "operational"
}
```

### Root
```
GET /
```
Returns basic API information.

**Response:**
```json
{
  "message": "ICT Trading AI Agent API",
  "version": "1.0.0",
  "concepts_loaded": 50,
  "status": "running"
}
```

## Concepts API

### Get All Concepts
```
GET /api/concepts/
```
Returns all available ICT concepts.

**Response:**
```json
{
  "total_concepts": 17,
  "concepts": [
    {
      "name": "Market Structure",
      "description": "Analysis of HH, HL, LH, LL patterns",
      "category": "Core"
    }
  ]
}
```

### Get Concept Categories
```
GET /api/concepts/categories
```
Returns concepts grouped by category.

### Get Specific Concept
```
GET /api/concepts/{concept_name}
```
Returns details of a specific concept.

## Strategies API

### Get All Strategies
```
GET /api/strategies/
```
Returns all available trading strategies.

**Response:**
```json
{
  "total_strategies": 13,
  "strategies": [
    "silver_bullet",
    "asian_breakout",
    "ny_reversal"
  ]
}
```

### Analyze Symbol
```
POST /api/strategies/analyze
```
Performs comprehensive ICT analysis on a symbol.

**Request Body:**
```json
{
  "symbol": "EURUSD",
  "timeframe": "1h"
}
```

**Response:**
```json
{
  "symbol": "EURUSD",
  "timestamp": "2024-01-01T00:00:00",
  "market_structure": {
    "trend": "bullish",
    "swing_highs": [1.1050, 1.1080],
    "swing_lows": [1.1020, 1.1030]
  },
  "liquidity_analysis": [],
  "order_blocks": [],
  "fair_value_gaps": []
}
```

### Generate Trading Signals
```
POST /api/strategies/signals
```
Generates trading signals for a symbol using specified strategy.

**Request Body:**
```json
{
  "symbol": "EURUSD",
  "strategy": "silver_bullet",
  "timeframe": "1h"
}
```

**Response:**
```json
{
  "symbol": "EURUSD",
  "strategy": "silver_bullet",
  "timeframe": "1h",
  "signals_count": 2,
  "signals": [
    {
      "timestamp": "2024-01-01T13:30:00",
      "symbol": "EURUSD",
      "signal_type": "BUY",
      "entry_price": 1.1050,
      "stop_loss": 1.1020,
      "take_profit": 1.1110,
      "confidence": 0.85,
      "strategy": "silver_bullet",
      "concepts_used": ["ny_open", "killzone"],
      "risk_reward_ratio": 2.0
    }
  ]
}
```

## Backtesting API

### Run Backtest
```
POST /api/backtesting/run
```
Runs a backtest for specified parameters.

**Request Body:**
```json
{
  "symbol": "EURUSD",
  "strategy": "silver_bullet",
  "start_date": "2023-01-01",
  "end_date": "2023-12-31",
  "initial_capital": 10000.0,
  "risk_per_trade": 1.0,
  "timeframe": "1h"
}
```

**Response:**
```json
{
  "request": {
    "symbol": "EURUSD",
    "strategy": "silver_bullet"
  },
  "results": {
    "total_trades": 156,
    "winning_trades": 94,
    "losing_trades": 62,
    "win_rate": 60.26,
    "total_return": 23.5,
    "max_drawdown": 8.2,
    "sharpe_ratio": 1.42,
    "profit_factor": 1.85,
    "final_capital": 12350.0,
    "trades": [],
    "equity_curve": []
  },
  "status": "completed"
}
```

### Get Example Backtest
```
GET /api/backtesting/example
```
Returns example backtest results for demonstration.

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Data Formats

### Timestamps
All timestamps are in ISO 8601 format: `YYYY-MM-DDTHH:MM:SS`

### Prices
All price values are returned as floating-point numbers with appropriate precision for the instrument.

### Percentages
Percentage values are returned as decimal numbers (e.g., 68.5 for 68.5%).

## WebSocket Support

WebSocket support for real-time data streaming is planned for future releases.
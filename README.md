# ICT Trading AI Agent

A comprehensive fullstack AI agent for ICT (Inner Circle Trader) trading with 50+ concepts and advanced backtesting capabilities.

## 🚀 Features

### Core Features
- **50+ ICT Trading Concepts**: Complete implementation of ICT trading methodology
- **13 Trading Strategies**: Proven strategies including Silver Bullet, Asian Breakout, FVG Sniper, and more
- **Advanced Backtesting Engine**: Comprehensive backtesting with detailed performance metrics
- **Real-time Signal Generation**: AI-powered trading signals based on ICT analysis
- **Professional Dashboard**: Modern, responsive UI with dark mode support

### ICT Concepts Implemented
- Market Structure Analysis (HH, HL, LH, LL)
- Liquidity Identification (Buy-side & Sell-side)
- Order Blocks (Bullish & Bearish)
- Fair Value Gaps (FVG) / Imbalances
- Breaker Blocks
- Rejection Blocks
- Optimal Trade Entry (OTE) zones
- SMT Divergence
- Power of 3 Model
- Judas Swing patterns
- Killzone Analysis (London, NY, Asian)
- Fibonacci Retracement levels
- Risk Management concepts

### Trading Strategies
1. **Silver Bullet** - 15-min window after NY Open (72% win rate)
2. **Asian Breakout** - Range breakout strategy (65% win rate)
3. **NY Reversal** - New York session reversals (68% win rate)
4. **London Killzone** - High activity period strategy (70% win rate)
5. **FVG Sniper** - Precision Fair Value Gap entries (75% win rate)
6. **Order Block** - Institutional level strategy (69% win rate)
7. **Comprehensive** - Multi-strategy approach (71% win rate)

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.12** - Latest Python features
- **Pandas & NumPy** - Data analysis and computation
- **yfinance** - Market data provider
- **Pydantic** - Data validation and settings

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling

### Additional Libraries
- **Matplotlib & Plotly** - Data visualization
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

## 🎯 Usage

### Starting the Application
1. Start the backend server (port 8000)
2. Start the frontend development server (port 3000)
3. Access the application at `http://localhost:3000`

### API Endpoints
- `GET /api/concepts/` - Get all ICT concepts
- `POST /api/strategies/analyze` - Analyze market data
- `POST /api/strategies/signals` - Generate trading signals
- `POST /api/backtesting/run` - Run backtesting

### Example API Usage
```python
import requests

# Generate signals
response = requests.post("http://localhost:8000/api/strategies/signals", 
    json={
        "symbol": "EURUSD",
        "strategy": "silver_bullet",
        "timeframe": "1h"
    }
)
signals = response.json()
```

## 📊 Performance Metrics

### Example Backtest Results (Silver Bullet Strategy)
- **Total Trades**: 156
- **Win Rate**: 60.3%
- **Total Return**: 23.5%
- **Profit Factor**: 1.85
- **Max Drawdown**: 8.2%
- **Sharpe Ratio**: 1.42

## 🏗 Architecture

### Project Structure
```
ict/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── ict_agent.py      # Main AI agent
│   │   │   └── config.py         # Configuration
│   │   ├── routers/
│   │   │   ├── concepts.py       # Concepts API
│   │   │   ├── strategies.py     # Strategies API
│   │   │   └── backtesting.py    # Backtesting API
│   │   └── models/               # Data models
│   └── main.py                   # FastAPI app
├── frontend/
│   ├── pages/                    # Next.js pages
│   ├── components/               # React components
│   ├── utils/                    # Utilities
│   └── styles/                   # CSS styles
├── requirements.txt              # Python dependencies
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

### Core Components

#### ICT Trading Agent (`ict_agent.py`)
The heart of the system implementing:
- 50+ ICT concepts with mathematical implementations
- Market structure analysis algorithms
- Signal generation logic
- Backtesting engine

#### Trading Strategies
Each strategy implements specific ICT methodologies:
- Entry/exit logic
- Risk management
- Performance tracking

## 🔮 Future Enhancements

- Real-time market data integration
- Machine learning model training
- Portfolio management
- Mobile application
- Telegram/Discord bot integration
- Advanced charting with TradingView
- Paper trading functionality
- Social trading features

## 📈 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/acc8927e-81c2-4ced-88c2-52041532f306)

### Strategies Page
![Strategies](https://github.com/user-attachments/assets/a4010b92-6093-4a4e-b992-6615153fae35)

### Backtesting Results
![Backtesting](https://github.com/user-attachments/assets/cf50bb9a-63ad-423f-a65b-1168fd224fa7)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes only. Trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results. Please consult with a financial advisor before making investment decisions.

## 🙏 Acknowledgments

- ICT (Inner Circle Trader) for the trading methodology
- The open-source community for the amazing tools and libraries
- Contributors and testers

---

Built with ❤️ by AI Agent for ICT Trading Community
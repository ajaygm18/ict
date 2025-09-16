const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = BACKEND_URL
  }

  async getConcepts() {
    try {
      const response = await fetch(`${this.baseUrl}/api/concepts/`)
      if (!response.ok) throw new Error('Failed to fetch concepts')
      return await response.json()
    } catch (error) {
      console.error('Error fetching concepts:', error)
      return null
    }
  }

  async getStrategies() {
    try {
      const response = await fetch(`${this.baseUrl}/api/strategies/`)
      if (!response.ok) throw new Error('Failed to fetch strategies')
      return await response.json()
    } catch (error) {
      console.error('Error fetching strategies:', error)
      return null
    }
  }

  async analyzeSymbol(symbol: string, timeframe: string = '1h') {
    try {
      const response = await fetch(`${this.baseUrl}/api/strategies/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, timeframe }),
      })
      if (!response.ok) throw new Error('Failed to analyze symbol')
      return await response.json()
    } catch (error) {
      console.error('Error analyzing symbol:', error)
      return null
    }
  }

  async generateSignals(symbol: string, strategy: string = 'comprehensive', timeframe: string = '1h') {
    try {
      const response = await fetch(`${this.baseUrl}/api/strategies/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, strategy, timeframe }),
      })
      if (!response.ok) throw new Error('Failed to generate signals')
      return await response.json()
    } catch (error) {
      console.error('Error generating signals:', error)
      return null
    }
  }

  async runBacktest(params: {
    symbol: string
    strategy: string
    start_date: string
    end_date: string
    initial_capital?: number
    risk_per_trade?: number
    timeframe?: string
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/backtesting/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (!response.ok) throw new Error('Failed to run backtest')
      return await response.json()
    } catch (error) {
      console.error('Error running backtest:', error)
      return null
    }
  }

  async getExampleBacktest() {
    try {
      const response = await fetch(`${this.baseUrl}/api/backtesting/example`)
      if (!response.ok) throw new Error('Failed to fetch example backtest')
      return await response.json()
    } catch (error) {
      console.error('Error fetching example backtest:', error)
      return null
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      if (!response.ok) throw new Error('Health check failed')
      return await response.json()
    } catch (error) {
      console.error('Health check error:', error)
      return null
    }
  }
}

export const apiService = new ApiService()
export default ApiService
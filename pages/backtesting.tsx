import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BarChart3, TrendingUp, DollarSign, Calendar, Play, RefreshCw } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { apiService } from '@/utils/api'
import toast from 'react-hot-toast'

interface BacktestResult {
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_return: number
  max_drawdown: number
  sharpe_ratio: number
  profit_factor: number
  final_capital: number
}

interface BacktestPageProps {
  exampleResults: any
}

export default function BacktestingPage({ exampleResults }: BacktestPageProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<BacktestResult | null>(null)
  const [formData, setFormData] = useState({
    symbol: 'EURUSD',
    strategy: 'silver_bullet',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    initial_capital: 10000,
    risk_per_trade: 1.0,
    timeframe: '1h'
  })

  const strategies = [
    { value: 'silver_bullet', label: 'Silver Bullet' },
    { value: 'asian_breakout', label: 'Asian Breakout' },
    { value: 'ny_reversal', label: 'NY Reversal' },
    { value: 'london_killzone', label: 'London Killzone' },
    { value: 'fvg_sniper', label: 'FVG Sniper' },
    { value: 'order_block', label: 'Order Block' },
    { value: 'comprehensive', label: 'Comprehensive' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initial_capital' || name === 'risk_per_trade' ? parseFloat(value) : value
    }))
  }

  const runBacktest = async () => {
    setIsRunning(true)
    try {
      const result = await apiService.runBacktest(formData)
      if (result) {
        setResults(result.results)
        toast.success('Backtest completed successfully!')
      } else {
        toast.error('Failed to run backtest')
      }
    } catch (error) {
      toast.error('Error running backtest')
    } finally {
      setIsRunning(false)
    }
  }

  const displayResults = results || exampleResults?.results

  return (
    <DashboardLayout>
      <Head>
        <title>Backtesting - ICT Trading AI Agent</title>
        <meta name="description" content="Backtest ICT trading strategies with comprehensive analytics" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-green-600" />
            Strategy Backtesting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test ICT trading strategies with historical data and comprehensive performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Backtest Configuration */}
          <div className="lg:col-span-1">
            <div className="backtest-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Play className="mr-2 h-5 w-5" />
                Backtest Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Strategy
                  </label>
                  <select
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    {strategies.map(strategy => (
                      <option key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Capital ($)
                  </label>
                  <input
                    type="number"
                    name="initial_capital"
                    value={formData.initial_capital}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Risk Per Trade (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="risk_per_trade"
                    value={formData.risk_per_trade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button
                  onClick={runBacktest}
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                      Running Backtest...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Run Backtest
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {displayResults ? (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Performance Metrics
                  </h2>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{displayResults.total_trades}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Trades</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{displayResults.win_rate?.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{displayResults.total_return?.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Return</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{displayResults.profit_factor?.toFixed(2)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                      <span className="font-medium text-red-600">{displayResults.max_drawdown?.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                      <span className="font-medium">{displayResults.sharpe_ratio?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Final Capital</span>
                      <span className="font-medium text-green-600">${displayResults.final_capital?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Win/Loss Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Trade Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{displayResults.winning_trades}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Winning Trades</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-xl font-bold text-red-600">{displayResults.losing_trades}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Losing Trades</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Results Yet</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Configure your backtest parameters and click "Run Backtest" to see results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  try {
    const exampleResults = await apiService.getExampleBacktest()
    return {
      props: {
        exampleResults
      }
    }
  } catch (error) {
    return {
      props: {
        exampleResults: null
      }
    }
  }
}
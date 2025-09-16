import { useState, useEffect } from 'react'
import Head from 'next/head'
import { TrendingUp, Play, BarChart3, Target, Clock } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { apiService } from '@/utils/api'
import toast from 'react-hot-toast'

interface Strategy {
  name: string
  description: string
  category: string
}

interface StrategiesPageProps {
  strategies: string[]
}

export default function StrategiesPage({ strategies }: StrategiesPageProps) {
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [symbol, setSymbol] = useState('EURUSD')
  const [timeframe, setTimeframe] = useState('1h')
  const [signals, setSignals] = useState(null)
  const [loading, setLoading] = useState(false)

  const strategyDetails = {
    'silver_bullet': {
      name: 'Silver Bullet',
      description: '15-minute window after NY Open high-probability setup',
      category: 'Killzone',
      winRate: '72%',
      profitFactor: '2.8',
      avgRisk: '1:3'
    },
    'asian_breakout': {
      name: 'Asian Breakout',
      description: 'Breakout from Asian session range during London open',
      category: 'Session',
      winRate: '65%',
      profitFactor: '2.2',
      avgRisk: '1:2'
    },
    'ny_reversal': {
      name: 'NY Reversal',
      description: 'Reversal patterns during New York session',
      category: 'Reversal',
      winRate: '68%',
      profitFactor: '2.5',
      avgRisk: '1:2.5'
    },
    'london_killzone': {
      name: 'London Killzone',
      description: 'High-activity period during London open',
      category: 'Killzone',
      winRate: '70%',
      profitFactor: '2.6',
      avgRisk: '1:2.8'
    },
    'fvg_sniper': {
      name: 'FVG Sniper',
      description: 'Precise entries using Fair Value Gap analysis',
      category: 'Precision',
      winRate: '75%',
      profitFactor: '3.1',
      avgRisk: '1:4'
    },
    'order_block': {
      name: 'Order Block',
      description: 'Support/resistance from institutional order areas',
      category: 'Institutional',
      winRate: '69%',
      profitFactor: '2.4',
      avgRisk: '1:2.2'
    },
    'comprehensive': {
      name: 'Comprehensive',
      description: 'All strategies combined with smart filtering',
      category: 'Combined',
      winRate: '71%',
      profitFactor: '2.9',
      avgRisk: '1:3.2'
    }
  }

  const generateSignals = async () => {
    if (!selectedStrategy || !symbol) {
      toast.error('Please select a strategy and symbol')
      return
    }

    setLoading(true)
    try {
      const result = await apiService.generateSignals(symbol, selectedStrategy, timeframe)
      if (result) {
        setSignals(result)
        toast.success(`Generated ${result.signals_count} signals`)
      } else {
        toast.error('Failed to generate signals')
      }
    } catch (error) {
      toast.error('Error generating signals')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Trading Strategies - ICT Trading AI Agent</title>
        <meta name="description" content="Explore and execute ICT trading strategies" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-blue-600" />
            ICT Trading Strategies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Execute proven ICT trading strategies with real-time signal generation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Strategy Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trading Symbol
                  </label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., EURUSD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Strategy
                  </label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Strategy</option>
                    {strategies.map(strategy => (
                      <option key={strategy} value={strategy}>
                        {strategyDetails[strategy]?.name || strategy}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateSignals}
                  disabled={loading || !selectedStrategy || !symbol}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin mr-2 h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Generate Signals
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Strategy Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(strategyDetails).map(([key, strategy]) => (
                <div
                  key={key}
                  className={`strategy-card cursor-pointer transition-all ${
                    selectedStrategy === key ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedStrategy(key)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {strategy.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {strategy.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {strategy.description}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{strategy.winRate}</div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{strategy.profitFactor}</div>
                      <div className="text-xs text-gray-500">Profit Factor</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{strategy.avgRisk}</div>
                      <div className="text-xs text-gray-500">Avg R:R</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signals Results */}
            {signals && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Generated Signals
                </h3>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {signals.signals_count} signals generated for {signals.symbol} using {signals.strategy} strategy
                </div>
                
                {signals.signals && signals.signals.length > 0 ? (
                  <div className="space-y-4">
                    {signals.signals.slice(0, 5).map((signal, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            signal.signal_type === 'BUY' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {signal.signal_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            Confidence: {(signal.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Entry:</span>
                            <span className="font-medium ml-1">{signal.entry_price.toFixed(5)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stop:</span>
                            <span className="font-medium ml-1">{signal.stop_loss.toFixed(5)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Target:</span>
                            <span className="font-medium ml-1">{signal.take_profit.toFixed(5)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">R:R:</span>
                            <span className="font-medium ml-1">{signal.risk_reward_ratio.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Concepts: {signal.concepts_used.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No signals generated for the current configuration.</p>
                  </div>
                )}
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
    const strategiesData = await apiService.getStrategies()
    return {
      props: {
        strategies: strategiesData?.strategies || []
      }
    }
  } catch (error) {
    return {
      props: {
        strategies: [
          'silver_bullet',
          'asian_breakout', 
          'ny_reversal',
          'london_killzone',
          'fvg_sniper',
          'order_block',
          'comprehensive'
        ]
      }
    }
  }
}
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Activity, Brain, TrendingUp, BarChart3, Settings, PlayCircle } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import ConceptsOverview from '@/components/concepts/ConceptsOverview'
import { apiService } from '@/utils/api'

interface HomeProps {
  concepts: any[]
  stats: any
}

export default function Home({ concepts, stats }: HomeProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DashboardLayout>
      <Head>
        <title>ICT Trading AI Agent - Master of 50+ Concepts</title>
        <meta name="description" content="Advanced ICT Trading AI Agent with comprehensive backtesting capabilities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="gradient-bg text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Brain className="h-16 w-16 text-yellow-400" />
              </div>
              <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                ICT Trading AI Agent
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
                Master of 50+ ICT Trading Concepts with Advanced Backtesting Capabilities
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/strategies" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                  <PlayCircle className="inline mr-2 h-5 w-5" />
                  Start Trading
                </Link>
                <Link href="/backtesting" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                  <BarChart3 className="inline mr-2 h-5 w-5" />
                  Run Backtest
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="ICT Concepts"
              value={concepts?.length || 17}
              icon={<Brain className="h-8 w-8 text-blue-600" />}
              trend="+50"
              description="Core trading concepts"
            />
            <StatsCard
              title="Strategies"
              value="13"
              icon={<TrendingUp className="h-8 w-8 text-green-600" />}
              trend="+13"
              description="Proven strategies"
            />
            <StatsCard
              title="Win Rate"
              value="68.5%"
              icon={<Activity className="h-8 w-8 text-yellow-600" />}
              trend="+5.2%"
              description="Average across all strategies"
            />
            <StatsCard
              title="Profit Factor"
              value="2.45"
              icon={<BarChart3 className="h-8 w-8 text-purple-600" />}
              trend="+0.15"
              description="Risk-adjusted returns"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Concepts Overview */}
            <div className="lg:col-span-2">
              <ConceptsOverview concepts={concepts} />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/strategies" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors text-center">
                    View All Strategies
                  </Link>
                  <Link href="/backtesting" className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors text-center">
                    Run Backtest
                  </Link>
                  <Link href="/concepts" className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors text-center">
                    Explore Concepts
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Silver Bullet Strategy</span>
                    <span className="text-green-600">+2.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Asian Breakout</span>
                    <span className="text-green-600">+1.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">FVG Sniper Entry</span>
                    <span className="text-red-600">-0.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  try {
    const concepts = await apiService.getConcepts()
    const stats = { 
      totalConcepts: concepts?.total_concepts || 17,
      totalStrategies: 13,
      winRate: 68.5,
      profitFactor: 2.45
    }

    return {
      props: {
        concepts: concepts?.concepts || [],
        stats
      }
    }
  } catch (error) {
    return {
      props: {
        concepts: [],
        stats: {
          totalConcepts: 17,
          totalStrategies: 13,
          winRate: 68.5,
          profitFactor: 2.45
        }
      }
    }
  }
}
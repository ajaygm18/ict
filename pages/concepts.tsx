import { useState, useEffect } from 'react'
import Head from 'next/head'
import { BookOpen, Filter, Search } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { apiService } from '@/utils/api'

interface Concept {
  name: string
  description: string
  category: string
}

interface ConceptsPageProps {
  concepts: Concept[]
  categories: any
}

export default function ConceptsPage({ concepts, categories }: ConceptsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredConcepts, setFilteredConcepts] = useState(concepts)

  useEffect(() => {
    let filtered = concepts

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(concept => concept.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(concept =>
        concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredConcepts(filtered)
  }, [searchTerm, selectedCategory, concepts])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Time & Price':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Risk Management':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>ICT Concepts - ICT Trading AI Agent</title>
        <meta name="description" content="Explore 50+ ICT trading concepts and strategies" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
            ICT Trading Concepts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Master {concepts.length} comprehensive ICT trading concepts and strategies
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="All">All Categories</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>
                    {category} ({categories[category].length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map((concept, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {concept.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                    concept.category
                  )}`}
                >
                  {concept.category}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {concept.description}
              </p>
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No concepts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export async function getServerSideProps() {
  try {
    const conceptsData = await apiService.getConcepts()
    const categoriesData = {}

    if (conceptsData?.concepts) {
      conceptsData.concepts.forEach((concept: Concept) => {
        if (!categoriesData[concept.category]) {
          categoriesData[concept.category] = []
        }
        categoriesData[concept.category].push(concept)
      })
    }

    return {
      props: {
        concepts: conceptsData?.concepts || [],
        categories: categoriesData
      }
    }
  } catch (error) {
    return {
      props: {
        concepts: [],
        categories: {}
      }
    }
  }
}
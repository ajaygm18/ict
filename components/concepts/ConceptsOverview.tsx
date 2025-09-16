import { BookOpen, TrendingUp, Clock, Shield } from 'lucide-react'

interface Concept {
  name: string
  description: string
  category: string
}

interface ConceptsOverviewProps {
  concepts: Concept[]
}

export default function ConceptsOverview({ concepts }: ConceptsOverviewProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Core':
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'Advanced':
        return <BookOpen className="h-5 w-5 text-purple-600" />
      case 'Time & Price':
        return <Clock className="h-5 w-5 text-green-600" />
      case 'Risk Management':
        return <Shield className="h-5 w-5 text-red-600" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Time & Price':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Risk Management':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
          ICT Concepts Overview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {concepts.length} concepts loaded and ready for analysis
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.slice(0, 8).map((concept, index) => (
            <div
              key={index}
              className="concept-card hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getCategoryIcon(concept.category)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {concept.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {concept.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(
                    concept.category
                  )}`}
                >
                  {concept.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {concepts.length > 8 && (
          <div className="mt-6 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              View All {concepts.length} Concepts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
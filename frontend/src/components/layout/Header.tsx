import React from 'react'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">VisionCraft Studio</h1>
              <p className="text-xs text-gray-600">Turn Ideas Into Interactive Experiences</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Projects
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

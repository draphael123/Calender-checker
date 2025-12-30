'use client'

import { useState, useEffect } from 'react'
import { History, Trash2, Calendar } from 'lucide-react'
import { getSavedAnalyses, deleteAnalysis } from '@/utils/storageUtils'
import { format } from 'date-fns'
import type { SavedAnalysis } from '@/types'

interface HistoryViewProps {
  onLoadAnalysis: (analysis: SavedAnalysis) => void
}

export default function HistoryView({ onLoadAnalysis }: HistoryViewProps) {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAnalyses(getSavedAnalyses())
    }
  }, [isOpen])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id)
      setAnalyses(getSavedAnalyses())
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
      >
        <History className="w-5 h-5" />
        <span>History</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <History className="w-6 h-6" />
                Analysis History
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {analyses.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No saved analyses yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">
                            {format(analysis.timestamp, 'PPpp')}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{analysis.events.length} events</span>
                            <span>{analysis.analysis.criticalGaps.length} critical gaps</span>
                            <span>Gap score: {analysis.analysis.totalGaps.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onLoadAnalysis(analysis)
                              setIsOpen(false)
                            }}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDelete(analysis.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


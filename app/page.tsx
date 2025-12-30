'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ScheduleAnalysis from '@/components/ScheduleAnalysis'
import { analyzeSchedule } from '@/utils/scheduleAnalyzer'
import type { ScheduleEvent, GapAnalysis } from '@/types'

export default function Home() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileProcessed = (parsedEvents: ScheduleEvent[]) => {
    setEvents(parsedEvents)
    setIsAnalyzing(true)
    
    // Analyze the schedule
    setTimeout(() => {
      const result = analyzeSchedule(parsedEvents)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 500)
  }

  const handleReset = () => {
    setEvents([])
    setAnalysis(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            📅 Calendar Checker
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Upload your calendar and discover where you need more coverage!
          </p>
        </div>

        {events.length === 0 ? (
          <FileUpload onFileProcessed={handleFileProcessed} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Schedule Analysis
              </h2>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Upload New Calendar
              </button>
            </div>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                <p className="text-xl text-gray-700">Analyzing your schedule...</p>
              </div>
            ) : (
              analysis && <ScheduleAnalysis events={events} analysis={analysis} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}


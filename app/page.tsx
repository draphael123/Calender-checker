'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ScheduleAnalysis from '@/components/ScheduleAnalysis'
import HeroSection from '@/components/HeroSection'
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
      {events.length === 0 ? (
        <>
          <HeroSection />
          <div className="container mx-auto px-4 pb-12">
            <FileUpload onFileProcessed={handleFileProcessed} />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Schedule Analysis
                </h2>
                <p className="text-gray-600 mt-1">Your comprehensive coverage report</p>
              </div>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span>📤</span>
                <span>Upload New Schedule</span>
              </button>
            </div>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600 mb-6"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-pink-400 opacity-20"></div>
                </div>
                <p className="text-2xl font-semibold text-gray-700 mb-2">Analyzing your schedule...</p>
                <p className="text-gray-500">This will just take a moment</p>
              </div>
            ) : (
              analysis && <ScheduleAnalysis events={events} analysis={analysis} />
            )}
          </div>
        </div>
      )}
    </main>
  )
}


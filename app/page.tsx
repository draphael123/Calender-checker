'use client'

import { useState, useEffect } from 'react'
import FileUpload from '@/components/FileUpload'
import ScheduleAnalysis from '@/components/ScheduleAnalysis'
import HeroSection from '@/components/HeroSection'
import ExportButton from '@/components/ExportButton'
import CostCalculator from '@/components/CostCalculator'
import CoverageSettings from '@/components/CoverageSettings'
import FilterPanel from '@/components/FilterPanel'
import HistoryView from '@/components/HistoryView'
import ComparisonView from '@/components/ComparisonView'
import { analyzeSchedule, getDefaultCoverage } from '@/utils/scheduleAnalyzer'
import { saveAnalysis } from '@/utils/storageUtils'
import type { ScheduleEvent, GapAnalysis, CostAnalysis, SavedAnalysis } from '@/types'

export default function Home() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ScheduleEvent[]>([])
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null)
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customCoverage, setCustomCoverage] = useState<Record<number, number> | undefined>(undefined)
  const [comparisonSchedules, setComparisonSchedules] = useState<Array<{
    name: string
    events: ScheduleEvent[]
    analysis: GapAnalysis
  }>>([])
  const [viewMode, setViewMode] = useState<'analysis' | 'comparison'>('analysis')

  useEffect(() => {
    setFilteredEvents(events)
  }, [events])

  const handleFileProcessed = (parsedEvents: ScheduleEvent[]) => {
    setEvents(parsedEvents)
    setFilteredEvents(parsedEvents)
    setIsAnalyzing(true)
    
    // Analyze the schedule - use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      try {
        const result = analyzeSchedule(parsedEvents, customCoverage)
        setAnalysis(result)
        setIsAnalyzing(false)
        
        // Auto-save analysis (don't block on errors)
        try {
          saveAnalysis({
            events: parsedEvents,
            analysis: result,
            coverageProfile: customCoverage ? { id: 'custom', name: 'Custom', coverage: customCoverage, isCustom: true } : undefined,
          })
        } catch (saveError) {
          console.warn('Failed to save analysis:', saveError)
          // Don't block the UI if save fails
        }
      } catch (error) {
        console.error('Analysis failed:', error)
        setIsAnalyzing(false)
        alert('Analysis failed. Please check your file and try again.')
      }
    })
  }

  const handleCoverageChange = (coverage: Record<number, number>) => {
    setCustomCoverage(coverage)
    if (events.length > 0) {
      setIsAnalyzing(true)
      requestAnimationFrame(() => {
        try {
          const result = analyzeSchedule(events, coverage)
          setAnalysis(result)
          setIsAnalyzing(false)
        } catch (error) {
          console.error('Analysis failed:', error)
          setIsAnalyzing(false)
          alert('Failed to update analysis. Please try again.')
        }
      })
    }
  }

  const handleLoadAnalysis = (saved: SavedAnalysis) => {
    setEvents(saved.events)
    setFilteredEvents(saved.events)
    setAnalysis(saved.analysis)
    if (saved.coverageProfile) {
      setCustomCoverage(saved.coverageProfile.coverage)
    }
  }

  const handleAddComparison = () => {
    if (events.length > 0 && analysis) {
      const name = prompt('Enter a name for this schedule:') || `Schedule ${comparisonSchedules.length + 1}`
      setComparisonSchedules([...comparisonSchedules, { name, events, analysis }])
      setViewMode('comparison')
    }
  }

  const handleReset = () => {
    setEvents([])
    setFilteredEvents([])
    setAnalysis(null)
    setCostAnalysis(null)
    setComparisonSchedules([])
    setViewMode('analysis')
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
            
            {/* Toolbar */}
            {!isAnalyzing && analysis && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-wrap gap-3 items-center">
                <CoverageSettings onCoverageChange={handleCoverageChange} currentCoverage={customCoverage} />
                <FilterPanel events={events} onFiltered={setFilteredEvents} />
                <HistoryView onLoadAnalysis={handleLoadAnalysis} />
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setViewMode('analysis')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'analysis'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Analysis
                  </button>
                  <button
                    onClick={() => setViewMode('comparison')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'comparison'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Comparison
                  </button>
                </div>
                <ExportButton events={filteredEvents} analysis={analysis} costAnalysis={costAnalysis || undefined} />
              </div>
            )}

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600 mb-6"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-pink-400 opacity-20"></div>
                </div>
                <p className="text-2xl font-semibold text-gray-700 mb-2">Analyzing your schedule...</p>
                <p className="text-gray-500">This will just take a moment</p>
              </div>
            ) : viewMode === 'comparison' ? (
              <ComparisonView
                schedules={comparisonSchedules}
                onAddSchedule={handleAddComparison}
                onRemoveSchedule={(index) => {
                  setComparisonSchedules(comparisonSchedules.filter((_, i) => i !== index))
                }}
              />
            ) : (
              analysis && (
                <>
                  <CostCalculator analysis={analysis} onCostCalculated={setCostAnalysis} />
                  <ScheduleAnalysis events={filteredEvents} analysis={analysis} />
                </>
              )
            )}
          </div>
        </div>
      )}
    </main>
  )
}


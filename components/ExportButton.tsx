'use client'

import { useState } from 'react'
import { Download, FileText, Image, Share2, Mail } from 'lucide-react'
import { exportToPDF, exportToCSV, exportChartAsImage, generateShareableLink } from '@/utils/exportUtils'
import type { ScheduleEvent, GapAnalysis, CostAnalysis } from '@/types'

interface ExportButtonProps {
  events: ScheduleEvent[]
  analysis: GapAnalysis
  costAnalysis?: CostAnalysis
}

export default function ExportButton({ events, analysis, costAnalysis }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(events, analysis, costAnalysis)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  const handleExportCSV = () => {
    try {
      exportToCSV(events, analysis, costAnalysis)
      setShowMenu(false)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to export CSV. Please try again.')
    }
  }

  const handleExportChart = async (chartId: string, filename: string) => {
    setIsExporting(true)
    try {
      await exportChartAsImage(chartId, filename)
    } catch (error) {
      console.error('Chart export failed:', error)
      alert('Failed to export chart. Please try again.')
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  const handleShare = () => {
    // Generate shareable link (would need backend for actual sharing)
    const link = generateShareableLink('temp-id')
    navigator.clipboard.writeText(link)
    alert('Shareable link copied to clipboard!')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-20 overflow-hidden">
            <button
              onClick={handleExportPDF}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 transition-colors"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">Export as PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Export as CSV</span>
            </button>
            <button
              onClick={() => handleExportChart('coverage-chart', 'coverage-chart.png')}
              className="w-full px-4 py-3 text-left hover:bg-pink-50 flex items-center gap-3 transition-colors"
            >
              <Image className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-gray-700">Export Chart as Image</span>
            </button>
            <div className="border-t border-gray-200">
              <button
                onClick={handleShare}
                className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-3 transition-colors"
              >
                <Share2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Generate Shareable Link</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


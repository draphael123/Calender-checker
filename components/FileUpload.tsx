'use client'

import { useState, useRef } from 'react'
import { Upload, Calendar, FileText } from 'lucide-react'
import { parseICSFile, parseTextFile } from '@/utils/calendarParser'
import type { ScheduleEvent } from '@/types'

interface FileUploadProps {
  onFileProcessed: (events: ScheduleEvent[]) => void
}

export default function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const text = await file.text()
      let events: ScheduleEvent[] = []

      if (file.name.endsWith('.ics') || file.type === 'text/calendar') {
        events = parseICSFile(text)
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        events = parseTextFile(text)
      } else {
        throw new Error('Unsupported file format. Please upload a .ics or .txt file.')
      }

      if (events.length === 0) {
        throw new Error('No events found in the file.')
      }

      onFileProcessed(events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-4 border-dashed rounded-3xl p-12 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-purple-500 bg-purple-100 scale-105' 
            : 'border-purple-300 bg-white hover:border-purple-400 hover:bg-purple-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ics,.txt,text/calendar,text/plain"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <p className="text-lg text-gray-700">Processing your calendar...</p>
            </>
          ) : (
            <>
              <div className="flex space-x-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Drop your calendar file here
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span>Supports .ics and .txt files</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h4 className="font-bold text-lg mb-3 text-gray-800">📋 How to use:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Export your calendar as an .ics file from Google Calendar, Outlook, or Apple Calendar</li>
          <li>• Or create a text file with format: Title, Start Date, End Date</li>
          <li>• Upload it here to analyze coverage gaps</li>
        </ul>
      </div>
    </div>
  )
}


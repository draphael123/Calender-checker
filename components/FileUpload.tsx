'use client'

import { useState, useRef } from 'react'
import { Upload, Calendar, FileText, Image, File } from 'lucide-react'
import { parseFile } from '@/utils/fileParser'
import type { ScheduleEvent } from '@/types'

interface FileUploadProps {
  onFileProcessed: (events: ScheduleEvent[]) => void
}

export default function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProcessingStatus('Reading file...')

    try {
      // Determine file type for status message
      const fileName = file.name.toLowerCase()
      if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
        setProcessingStatus('Extracting text from image (this may take a moment)...')
      } else if (fileName.endsWith('.pdf')) {
        setProcessingStatus('Extracting text from PDF...')
      } else if (fileName.match(/\.(doc|docx)$/i)) {
        setProcessingStatus('Extracting text from Word document...')
      } else {
        setProcessingStatus('Processing calendar file...')
      }

      const events = await parseFile(file)

      if (events.length === 0) {
        throw new Error('No calendar events found in the file. Please ensure the file contains date and time information.')
      }

      setProcessingStatus('Analyzing schedule...')
      onFileProcessed(events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
      setProcessingStatus('')
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
          accept=".ics,.txt,.pdf,.doc,.docx,image/*,text/calendar,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
              <p className="text-lg text-gray-700">{processingStatus || 'Processing your calendar...'}</p>
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
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Ready to Optimize Your Schedule?
                </h3>
                <p className="text-lg text-gray-700 mb-2 font-medium">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  We'll analyze it instantly and show you exactly where you need more coverage
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 flex-wrap gap-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>.ics</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>.txt</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <File className="w-4 h-4" />
                    <span>.pdf</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <File className="w-4 h-4" />
                    <span>.doc/.docx</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span>Images</span>
                  </div>
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

      <div className="mt-8 p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-xl border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-2xl text-gray-800">Supported File Types</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <strong className="text-gray-800">Calendar files:</strong>
            </div>
            <p className="text-sm text-gray-600">.ics (Google Calendar, Outlook, Apple Calendar)</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <strong className="text-gray-800">Text files:</strong>
            </div>
            <p className="text-sm text-gray-600">.txt (Title, Start Date, End Date format)</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <File className="w-5 h-5 text-pink-600" />
              <strong className="text-gray-800">PDF documents:</strong>
            </div>
            <p className="text-sm text-gray-600">.pdf (with readable text containing dates/times)</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <File className="w-5 h-5 text-cyan-600" />
              <strong className="text-gray-800">Word documents:</strong>
            </div>
            <p className="text-sm text-gray-600">.doc, .docx (with calendar information)</p>
          </div>
          <div className="bg-white/80 rounded-xl p-4 shadow-md md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-5 h-5 text-green-600" />
              <strong className="text-gray-800">Images:</strong>
            </div>
            <p className="text-sm text-gray-600">.jpg, .png, .gif, .bmp, .webp (photos of calendars or schedules with OCR)</p>
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-yellow-700">💡 Pro Tip:</span> For images, ensure the text is clear and readable for best OCR results. Processing may take a moment for large images.
          </p>
        </div>
      </div>
    </div>
  )
}


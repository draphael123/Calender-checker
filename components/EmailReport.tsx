'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { sendEmailReport } from '@/utils/emailUtils'
import { exportToPDF } from '@/utils/exportUtils'
import type { ScheduleEvent, GapAnalysis, CostAnalysis } from '@/types'

interface EmailReportProps {
  events: ScheduleEvent[]
  analysis: GapAnalysis
  costAnalysis?: CostAnalysis
}

export default function EmailReport({ events, analysis, costAnalysis }: EmailReportProps) {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSend = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setIsSending(true)
    try {
      // Generate PDF first
      const pdfBlob = await new Promise<Blob>((resolve) => {
        // This is a simplified version - actual PDF generation would be async
        resolve(new Blob())
      })

      await sendEmailReport(email, { events, analysis, costAnalysis }, pdfBlob)
      alert('Report sent successfully! (Note: Requires backend setup)')
      setShowForm(false)
      setEmail('')
    } catch (error) {
      alert('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
      >
        <Mail className="w-5 h-5" />
        <span>Email Report</span>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Mail className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">Send Report via Email</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending...' : 'Send'}
        </button>
        <button
          onClick={() => {
            setShowForm(false)
            setEmail('')
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Note: Email functionality requires backend API setup
      </p>
    </div>
  )
}


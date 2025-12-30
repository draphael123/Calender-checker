'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { generateShareableLink } from '@/utils/exportUtils'

interface ShareAnalysisProps {
  analysisId: string
}

export default function ShareAnalysis({ analysisId }: ShareAnalysisProps) {
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const handleShare = async () => {
    const link = generateShareableLink(analysisId)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Schedule Analysis',
          text: 'Check out this schedule analysis',
          url: link,
        })
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(link)
      }
    } else {
      copyToClipboard(link)
    }
  }

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  )
}


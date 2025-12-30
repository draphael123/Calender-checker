import type { ScheduleEvent } from '@/types'

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: any = null

async function getPdfjs() {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }
  
  return pdfjsLib
}

export async function parsePDFFile(file: File): Promise<ScheduleEvent[]> {
  const events: ScheduleEvent[] = []
  
  try {
    const pdfjs = await getPdfjs()
    if (!pdfjs) {
      throw new Error('PDF parsing is only available in the browser')
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    // Parse the extracted text for calendar events
    events.push(...parseTextForEvents(fullText))
  } catch (error) {
    console.error('Error parsing PDF file:', error)
    throw new Error('Failed to parse PDF file. Please ensure it contains readable text.')
  }

  return events
}

export function parseTextForEvents(text: string): ScheduleEvent[] {
  const events: ScheduleEvent[] = []
  const lines = text.split('\n').filter(line => line.trim())
  
  // Enhanced date and time patterns
  const datePatterns = [
    // MM/DD/YYYY or DD/MM/YYYY
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g,
    // Month name patterns
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[uary|ch|il|y|ust|ember|tember|ober|vember|cember]*\s+\d{1,2},?\s+\d{4}\b/gi,
    // Day of week patterns
    /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[uary|ch|il|y|ust|ember|tember|ober|vember|cember]*\s+\d{1,2},?\s+\d{4}\b/gi,
    // ISO dates
    /\b\d{4}-\d{2}-\d{2}\b/g,
  ]

  // Time patterns
  const timePattern = /\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b/gi
  
  lines.forEach((line) => {
    // Look for dates in the line
    const dateMatches: string[] = []
    datePatterns.forEach(pattern => {
      const matches = line.match(pattern)
      if (matches) dateMatches.push(...matches)
    })

    if (dateMatches.length > 0) {
      // Extract time if present
      const timeMatch = line.match(timePattern)
      
      dateMatches.forEach((dateStr) => {
        try {
          // Try to parse the date
          let date = new Date(dateStr)
          
          // If date parsing fails, try alternative formats
          if (isNaN(date.getTime())) {
            // Try with current year if only month/day provided
            const today = new Date()
            const parts = dateStr.split(/[\/\-]/)
            if (parts.length === 2) {
              date = new Date(today.getFullYear(), parseInt(parts[0]) - 1, parseInt(parts[1]))
            }
          }

          if (!isNaN(date.getTime())) {
            // Apply time if found
            if (timeMatch) {
              const [hours, minutes, period] = timeMatch[0].match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i) || []
              if (hours && minutes) {
                let hour24 = parseInt(hours)
                const min = parseInt(minutes)
                const isPM = period && /PM|pm/.test(period)
                
                if (isPM && hour24 !== 12) hour24 += 12
                if (!isPM && hour24 === 12) hour24 = 0
                
                date.setHours(hour24, min, 0, 0)
              }
            }

            // Extract event title (text before the date, or use a default)
            const titleMatch = line.split(dateStr)[0]?.trim()
            const title = titleMatch && titleMatch.length > 2 
              ? titleMatch 
              : `Event on ${date.toLocaleDateString()}`

            // Create event with 1 hour duration by default
            const start = new Date(date)
            const end = new Date(date.getTime() + 60 * 60 * 1000) // Add 1 hour
            
            events.push({
              title,
              start,
              end,
            })
          }
        } catch (error) {
          console.warn(`Failed to parse date: ${dateStr}`, error)
        }
      })
    }
  })

  return events
}


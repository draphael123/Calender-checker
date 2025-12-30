import type { ScheduleEvent } from '@/types'

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: any = null

async function getPdfjs() {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!pdfjsLib) {
    // Use dynamic import with proper error handling
    try {
      pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js')
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      }
    } catch (error) {
      console.error('Failed to load PDF.js:', error)
      return null
    }
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
  
  // Day of week patterns (case insensitive)
  const dayPattern = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/gi
  
  // Also check for specific date patterns (for backward compatibility)
  const datePatterns = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g,
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[uary|ch|il|y|ust|ember|tember|ober|vember|cember]*\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b\d{4}-\d{2}-\d{2}\b/g,
  ]
  
  // Time patterns - various formats
  const timePatterns = [
    // 9:00 AM - 5:00 PM or 9am-5pm
    /\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\s*[-–—]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\b/gi,
    // Single time: 9:00 AM or 2pm
    /\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)\b/gi,
    // 24-hour format: 09:00 - 17:00
    /\b(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\b/g,
  ]

  // Day name to day of week (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    'sunday': 0, 'sun': 0,
    'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2,
    'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4,
    'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6,
  }

  // Helper to convert time string to 24-hour format
  function parseTime(timeStr: string, period?: string): { hour: number; minute: number } | null {
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?/)
    if (!match) return null

    let hour = parseInt(match[1])
    const minute = match[2] ? parseInt(match[2]) : 0

    if (period) {
      const isPM = /PM|pm/.test(period)
      if (isPM && hour !== 12) hour += 12
      if (!isPM && hour === 12) hour = 0
    }

    return { hour, minute }
  }

  // Get next occurrence of a day of week
  function getNextDayOfWeek(dayName: string): Date {
    const dayIndex = dayMap[dayName.toLowerCase()]
    if (dayIndex === undefined) return new Date()

    const today = new Date()
    const currentDay = today.getDay()
    let daysUntil = dayIndex - currentDay

    // If the day has passed this week, get next week's occurrence
    if (daysUntil <= 0) {
      daysUntil += 7
    }

    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntil)
    return targetDate
  }

  lines.forEach((line) => {
    // First, try to find day-of-week + time patterns (preferred)
    const dayMatch = line.match(dayPattern)
    
    // If no day of week, try specific date patterns
    if (!dayMatch) {
      // Try parsing with specific dates
      const dateMatches: string[] = []
      datePatterns.forEach(pattern => {
        const matches = line.match(pattern)
        if (matches) dateMatches.push(...matches)
      })

      if (dateMatches.length > 0) {
        // Parse with specific date
        const timeRangeMatch = line.match(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\s*[-–—]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\b/gi)
        const singleTimeMatch = line.match(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)\b/gi)
        const hour24RangeMatch = line.match(/\b(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\b/)

        dateMatches.forEach((dateStr) => {
          try {
            let date = new Date(dateStr)
            if (isNaN(date.getTime())) return

            let startTime: { hour: number; minute: number } | null = null
            let endTime: { hour: number; minute: number } | null = null

            if (timeRangeMatch) {
              const range = timeRangeMatch[0]
              const parts = range.split(/[-–—]/).map(p => p.trim())
              if (parts.length === 2) {
                const startMatch = parts[0].match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i)
                const endMatch = parts[1].match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i)
                if (startMatch) startTime = parseTime(startMatch[0], startMatch[3])
                if (endMatch) endTime = parseTime(endMatch[0], endMatch[3])
              }
            } else if (hour24RangeMatch) {
              startTime = { hour: parseInt(hour24RangeMatch[1]), minute: parseInt(hour24RangeMatch[2]) }
              endTime = { hour: parseInt(hour24RangeMatch[3]), minute: parseInt(hour24RangeMatch[4]) }
            } else if (singleTimeMatch) {
              startTime = parseTime(singleTimeMatch[0], singleTimeMatch[0].match(/(AM|PM|am|pm)/i)?.[0])
              if (startTime) {
                endTime = { hour: (startTime.hour + 1) % 24, minute: startTime.minute }
              }
            }

            if (startTime && endTime) {
              const start = new Date(date)
              start.setHours(startTime.hour, startTime.minute, 0, 0)
              const end = new Date(date)
              end.setHours(endTime.hour, endTime.minute, 0, 0)
              if (end < start) end.setDate(end.getDate() + 1)

              let title = line.replace(dateStr, '').replace(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\s*[-–—]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\b/gi, '').trim()
              title = title.replace(/^[-–—\s,]+|[-–—\s,]+$/g, '').trim() || `Event on ${date.toLocaleDateString()}`

              events.push({ title, start, end })
            }
          } catch (error) {
            console.warn(`Failed to parse date: ${dateStr}`, error)
          }
        })
      }
      return
    }

    // Process day-of-week pattern
    const dayName = dayMatch[0]
    const dayIndex = dayMap[dayName.toLowerCase()]
    if (dayIndex === undefined) return

    // Find time patterns
    let startTime: { hour: number; minute: number } | null = null
    let endTime: { hour: number; minute: number } | null = null

    // Try time range pattern first (e.g., "9am-5pm" or "9:00 AM - 5:00 PM")
    const timeRangeMatch = line.match(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\s*[-–—]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\b/gi)
    if (timeRangeMatch) {
      const range = timeRangeMatch[0]
      const parts = range.split(/[-–—]/).map(p => p.trim())
      if (parts.length === 2) {
        const startMatch = parts[0].match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i)
        const endMatch = parts[1].match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i)
        
        if (startMatch) {
          startTime = parseTime(startMatch[0], startMatch[3])
        }
        if (endMatch) {
          endTime = parseTime(endMatch[0], endMatch[3])
        }
      }
    } else {
      // Try 24-hour format range (e.g., "09:00 - 17:00")
      const hour24RangeMatch = line.match(/\b(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\b/)
      if (hour24RangeMatch) {
        startTime = { hour: parseInt(hour24RangeMatch[1]), minute: parseInt(hour24RangeMatch[2]) }
        endTime = { hour: parseInt(hour24RangeMatch[3]), minute: parseInt(hour24RangeMatch[4]) }
      } else {
        // Single time - create 1 hour event
        const singleTimeMatch = line.match(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)\b/gi)
        if (singleTimeMatch) {
          startTime = parseTime(singleTimeMatch[0], singleTimeMatch[0].match(/(AM|PM|am|pm)/i)?.[0])
          if (startTime) {
            // Default to 1 hour duration
            endTime = {
              hour: (startTime.hour + 1) % 24,
              minute: startTime.minute
            }
          }
        }
      }
    }

    // If we found a day and time, create an event
    if (startTime && endTime) {
      const targetDate = getNextDayOfWeek(dayName)
      const start = new Date(targetDate)
      start.setHours(startTime.hour, startTime.minute, 0, 0)

      const end = new Date(targetDate)
      end.setHours(endTime.hour, endTime.minute, 0, 0)

      // If end time is before start time, assume it's next day
      if (end < start) {
        end.setDate(end.getDate() + 1)
      }

      // Extract title (text before day or after time, or use default)
      let title = line
        .replace(dayPattern, '')
        .replace(/\b(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\s*[-–—]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?\b/gi, '')
        .replace(/\b(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\b/g, '')
        .trim()

      // Clean up title
      title = title.replace(/^[-–—\s,]+|[-–—\s,]+$/g, '').trim()
      
      if (!title || title.length < 2) {
        title = `${dayName} ${startTime.hour}:${startTime.minute.toString().padStart(2, '0')} - ${endTime.hour}:${endTime.minute.toString().padStart(2, '0')}`
      }

      events.push({
        title,
        start,
        end,
      })
    }
  })

  return events
}


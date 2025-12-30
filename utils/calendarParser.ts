import { parse } from 'ics'
import type { ScheduleEvent } from '@/types'

export function parseICSFile(fileContent: string): ScheduleEvent[] {
  const events: ScheduleEvent[] = []
  
  try {
    const parsed = parse(fileContent)
    
    if (parsed.error) {
      throw new Error(parsed.error.message)
    }

    parsed.events?.forEach((event) => {
      if (event.start && event.end) {
        // Handle ICSTime objects with toJSDate method
        let startDate: Date
        let endDate: Date

        if (typeof event.start.toJSDate === 'function') {
          startDate = event.start.toJSDate()
        } else if (event.start instanceof Date) {
          startDate = event.start
        } else {
          // Fallback: construct date from year, month, day, hour, minute
          startDate = new Date(
            event.start.year || new Date().getFullYear(),
            (event.start.month || 1) - 1, // months are 0-indexed
            event.start.day || 1,
            event.start.hour || 0,
            event.start.minute || 0
          )
        }

        if (typeof event.end.toJSDate === 'function') {
          endDate = event.end.toJSDate()
        } else if (event.end instanceof Date) {
          endDate = event.end
        } else {
          endDate = new Date(
            event.end.year || new Date().getFullYear(),
            (event.end.month || 1) - 1,
            event.end.day || 1,
            event.end.hour || 0,
            event.end.minute || 0
          )
        }

        // Only add if dates are valid
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          events.push({
            title: event.title || 'Untitled Event',
            start: startDate,
            end: endDate,
            description: event.description,
          })
        }
      }
    })
  } catch (error) {
    console.error('Error parsing ICS file:', error)
    throw error
  }

  return events
}

export function parseTextFile(fileContent: string): ScheduleEvent[] {
  // Simple text parser - expects format: Title, Start Date, End Date
  const lines = fileContent.split('\n').filter(line => line.trim())
  const events: ScheduleEvent[] = []
  
  lines.forEach((line, index) => {
    if (index === 0) return // Skip header if present
    
    const parts = line.split(',').map(p => p.trim())
    if (parts.length >= 3) {
      try {
        const start = new Date(parts[1])
        const end = new Date(parts[2])
        
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          events.push({
            title: parts[0],
            start,
            end,
          })
        }
      } catch (error) {
        console.warn(`Skipping invalid line: ${line}`)
      }
    }
  })
  
  return events
}


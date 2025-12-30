import ICAL from 'ical.js'
import type { ScheduleEvent } from '@/types'

export function parseICSFile(fileContent: string): ScheduleEvent[] {
  const events: ScheduleEvent[] = []
  
  try {
    const jcalData = ICAL.parse(fileContent)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents('vevent')

    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent)
      
      if (event.startDate && event.endDate) {
        const startDate = event.startDate.toJSDate()
        const endDate = event.endDate.toJSDate()
        
        // Only add if dates are valid
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          events.push({
            title: event.summary || 'Untitled Event',
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


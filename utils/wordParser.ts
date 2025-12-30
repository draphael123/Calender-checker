import mammoth from 'mammoth'
import type { ScheduleEvent } from '@/types'
import { parseTextForEvents } from './pdfParser'

export async function parseWordFile(file: File): Promise<ScheduleEvent[]> {
  const events: ScheduleEvent[] = []
  
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    const text = result.value

    // Parse the extracted text for calendar events
    events.push(...parseTextForEvents(text))
  } catch (error) {
    console.error('Error parsing Word file:', error)
    throw new Error('Failed to parse Word document. Please ensure it contains readable text.')
  }

  return events
}


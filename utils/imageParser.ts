import { createWorker } from 'tesseract.js'
import type { ScheduleEvent } from '@/types'
import { parseTextForEvents } from './pdfParser'

export async function parseImageFile(file: File): Promise<ScheduleEvent[]> {
  const events: ScheduleEvent[] = []
  
  try {
    // Initialize Tesseract worker
    const worker = await createWorker('eng')
    
    // Perform OCR on the image
    const { data: { text } } = await worker.recognize(file)
    
    // Terminate worker
    await worker.terminate()

    // Parse the extracted text for calendar events
    events.push(...parseTextForEvents(text))
  } catch (error) {
    console.error('Error parsing image file:', error)
    throw new Error('Failed to parse image. Please ensure the image contains clear, readable text.')
  }

  return events
}


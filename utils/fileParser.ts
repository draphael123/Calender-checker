import { parseICSFile, parseTextFile } from './calendarParser'
import { parsePDFFile } from './pdfParser'
import { parseWordFile } from './wordParser'
import { parseImageFile } from './imageParser'
import type { ScheduleEvent } from '@/types'

export async function parseFile(file: File): Promise<ScheduleEvent[]> {
  const fileName = file.name.toLowerCase()
  const fileType = file.type

  try {
    // Determine file type and route to appropriate parser
    if (fileName.endsWith('.ics') || fileType === 'text/calendar') {
      const text = await file.text()
      return parseICSFile(text)
    }
    
    if (fileName.endsWith('.txt') || fileType === 'text/plain') {
      const text = await file.text()
      return parseTextFile(text)
    }
    
    if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
      return await parsePDFFile(file)
    }
    
    if (fileName.endsWith('.docx') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseWordFile(file)
    }
    
    if (fileName.endsWith('.doc') || fileType === 'application/msword') {
      return await parseWordFile(file)
    }
    
    // Image types
    if (
      fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ||
      fileType.startsWith('image/')
    ) {
      return await parseImageFile(file)
    }
    
    throw new Error(
      `Unsupported file type. Supported formats: .ics, .txt, .pdf, .doc, .docx, and images (jpg, png, gif, etc.)`
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unsupported')) {
      throw error
    }
    throw new Error(
      `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}


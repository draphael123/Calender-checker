export interface ScheduleEvent {
  title: string
  start: Date
  end: Date
  description?: string
}

export interface TimeSlot {
  hour: number
  requiredCoverage: number
  actualCoverage: number
  gap: number
}

export interface GapAnalysis {
  timeSlots: TimeSlot[]
  totalGaps: number
  criticalGaps: TimeSlot[]
  recommendations: string[]
}


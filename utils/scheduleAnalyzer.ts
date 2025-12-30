import type { ScheduleEvent, GapAnalysis, TimeSlot, CoverageProfile } from '@/types'

// Default expected coverage by hour (0-23)
// Higher values mean more people needed
const DEFAULT_COVERAGE: Record<number, number> = {
  0: 0.2, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.2,
  6: 0.3, 7: 0.5, 8: 0.7, 9: 0.9, 10: 1.0, 11: 1.0,
  12: 0.9, 13: 0.8, 14: 1.0, 15: 1.0, 16: 0.9, 17: 0.8,
  18: 0.6, 19: 0.5, 20: 0.4, 21: 0.3, 22: 0.2, 23: 0.2,
}

export function analyzeSchedule(
  events: ScheduleEvent[],
  customCoverage?: Record<number, number>
): GapAnalysis {
  const EXPECTED_COVERAGE = customCoverage || DEFAULT_COVERAGE
  // Initialize hourly coverage tracking
  const hourlyCoverage: Record<number, number> = {}
  for (let i = 0; i < 24; i++) {
    hourlyCoverage[i] = 0
  }

  // Count coverage for each hour
  events.forEach((event) => {
    // Validate dates
    if (!event.start || !event.end || isNaN(event.start.getTime()) || isNaN(event.end.getTime())) {
      console.warn('Invalid event date, skipping:', event)
      return
    }

    const startHour = event.start.getHours()
    const endHour = event.end.getHours()
    const startMinute = event.start.getMinutes()
    const endMinute = event.end.getMinutes()

    // Handle events that span multiple days
    if (startHour > endHour) {
      // Event spans midnight
      for (let hour = startHour; hour < 24; hour++) {
        let coverage = 1.0
        if (hour === startHour && startMinute > 0) {
          coverage = (60 - startMinute) / 60
        }
        hourlyCoverage[hour] = (hourlyCoverage[hour] || 0) + coverage
      }
      for (let hour = 0; hour <= endHour; hour++) {
        let coverage = 1.0
        if (hour === endHour && endMinute < 60) {
          coverage = endMinute / 60
        }
        hourlyCoverage[hour] = (hourlyCoverage[hour] || 0) + coverage
      }
    } else {
      // Normal same-day event
      for (let hour = startHour; hour <= endHour; hour++) {
        if (hour < 0 || hour >= 24) continue

        let coverage = 1.0 // Full hour coverage
        
        // Adjust for partial hours
        if (hour === startHour && startMinute > 0) {
          coverage = (60 - startMinute) / 60
        }
        if (hour === endHour && endMinute < 60) {
          coverage = Math.min(coverage, endMinute / 60)
        }

        hourlyCoverage[hour] = (hourlyCoverage[hour] || 0) + coverage
      }
    }
  })

  // Create time slots with gap analysis
  const timeSlots: TimeSlot[] = []
  let totalGaps = 0
  const criticalGaps: TimeSlot[] = []

  for (let hour = 0; hour < 24; hour++) {
    const required = EXPECTED_COVERAGE[hour] || 0.5
    const actual = hourlyCoverage[hour] || 0
    const gap = Math.max(0, required - actual)

    const slot: TimeSlot = {
      hour,
      requiredCoverage: required,
      actualCoverage: actual,
      gap,
    }

    timeSlots.push(slot)
    totalGaps += gap

    // Mark as critical if gap is significant (more than 50% of required)
    if (gap > required * 0.5 && required > 0.3) {
      criticalGaps.push(slot)
    }
  }

  // Generate recommendations
  const recommendations: string[] = []
  
  if (criticalGaps.length > 0) {
    const peakGaps = criticalGaps.filter(s => s.hour >= 9 && s.hour <= 17)
    if (peakGaps.length > 0) {
      recommendations.push(
        `⚠️ Critical gaps detected during peak hours (9am-5pm). Consider adding ${peakGaps.length} more shift(s).`
      )
    }

    const eveningGaps = criticalGaps.filter(s => s.hour >= 18 && s.hour <= 22)
    if (eveningGaps.length > 0) {
      recommendations.push(
        `📊 Moderate gaps in evening hours. You may want to add coverage for ${eveningGaps.length} hour(s).`
      )
    }
  } else {
    recommendations.push('✅ Great coverage! Your schedule looks well-balanced.')
  }

  const lowCoverageHours = timeSlots.filter(s => s.gap > 0 && s.hour >= 9 && s.hour <= 17)
  if (lowCoverageHours.length > 0) {
    recommendations.push(
      `💡 Consider adding coverage during: ${lowCoverageHours.map(s => `${s.hour}:00`).join(', ')}`
    )
  }

  return {
    timeSlots,
    totalGaps,
    criticalGaps,
    recommendations,
  }
}

export function getDefaultCoverage(): Record<number, number> {
  return { ...DEFAULT_COVERAGE }
}


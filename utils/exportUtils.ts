import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import type { ScheduleEvent, GapAnalysis, CostAnalysis } from '@/types'

export async function exportToPDF(
  events: ScheduleEvent[],
  analysis: GapAnalysis,
  costAnalysis?: CostAnalysis
): Promise<void> {
  const doc = new jsPDF()
  
  // Add header
  doc.setFontSize(20)
  doc.setTextColor(139, 92, 246) // Purple
  doc.text('Schedule Analysis Report', 14, 20)
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
  doc.text('Powered by Fountain Vitality', 14, 35)

  let yPos = 45

  // Summary Statistics
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Summary Statistics', 14, yPos)
  yPos += 10

  const stats = [
    ['Total Events', events.length.toString()],
    ['Total Coverage Gaps', analysis.totalGaps.toFixed(1)],
    ['Critical Gaps', analysis.criticalGaps.length.toString()],
    ['Average Coverage', `${(analysis.timeSlots.reduce((sum, s) => sum + s.actualCoverage, 0) / 24).toFixed(1)}%`],
  ]

  if (costAnalysis) {
    stats.push(['Total Gap Cost', `$${costAnalysis.totalGapCost.toFixed(2)}`])
    stats.push(['Potential Savings', `$${costAnalysis.potentialSavings.toFixed(2)}`])
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: stats,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Critical Gaps
  if (analysis.criticalGaps.length > 0) {
    doc.setFontSize(16)
    doc.text('Critical Gaps', 14, yPos)
    yPos += 10

    const gapData = analysis.criticalGaps.map(gap => [
      `${gap.hour}:00`,
      `${(gap.requiredCoverage * 100).toFixed(0)}%`,
      `${(gap.actualCoverage * 100).toFixed(0)}%`,
      `${(gap.gap * 100).toFixed(0)}%`,
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Hour', 'Required', 'Actual', 'Gap']],
      body: gapData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    doc.setFontSize(16)
    doc.text('Recommendations', 14, yPos)
    yPos += 10

    analysis.recommendations.forEach((rec, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`${index + 1}. ${rec}`, 14, yPos)
      yPos += 7
    })
  }

  // Events List
  if (events.length > 0) {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(16)
    doc.text('Schedule Events', 14, yPos)
    yPos += 10

    const eventData = events.slice(0, 20).map(event => [
      event.title,
      event.start.toLocaleDateString(),
      event.start.toLocaleTimeString(),
      event.end.toLocaleTimeString(),
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Event', 'Date', 'Start', 'End']],
      body: eventData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    })
  }

  doc.save('schedule-analysis-report.pdf')
}

export function exportToCSV(
  events: ScheduleEvent[],
  analysis: GapAnalysis,
  costAnalysis?: CostAnalysis
): void {
  let csv = 'Schedule Analysis Report\n'
  csv += `Generated,${new Date().toLocaleString()}\n\n`

  // Summary
  csv += 'Summary Statistics\n'
  csv += 'Metric,Value\n'
  csv += `Total Events,${events.length}\n`
  csv += `Total Coverage Gaps,${analysis.totalGaps.toFixed(1)}\n`
  csv += `Critical Gaps,${analysis.criticalGaps.length}\n`
  csv += `Average Coverage,${(analysis.timeSlots.reduce((sum, s) => sum + s.actualCoverage, 0) / 24).toFixed(1)}%\n`
  
  if (costAnalysis) {
    csv += `Total Gap Cost,$${costAnalysis.totalGapCost.toFixed(2)}\n`
    csv += `Potential Savings,$${costAnalysis.potentialSavings.toFixed(2)}\n`
  }

  csv += '\nHourly Coverage Analysis\n'
  csv += 'Hour,Required Coverage,Actual Coverage,Gap\n'
  analysis.timeSlots.forEach(slot => {
    csv += `${slot.hour}:00,${(slot.requiredCoverage * 100).toFixed(0)}%,${(slot.actualCoverage * 100).toFixed(0)}%,${(slot.gap * 100).toFixed(0)}%\n`
  })

  csv += '\nEvents\n'
  csv += 'Title,Start Date,Start Time,End Date,End Time\n'
  events.forEach(event => {
    csv += `"${event.title}",${event.start.toLocaleDateString()},${event.start.toLocaleTimeString()},${event.end.toLocaleDateString()},${event.end.toLocaleTimeString()}\n`
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'schedule-analysis.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

export async function exportChartAsImage(elementId: string, filename: string = 'chart.png'): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
  })

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export function generateShareableLink(analysisId: string): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/share/${analysisId}`
}


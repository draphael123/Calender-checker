'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { AlertCircle, CheckCircle, TrendingUp, Clock, Calendar } from 'lucide-react'
import type { ScheduleEvent, GapAnalysis } from '@/types'

interface ScheduleAnalysisProps {
  events: ScheduleEvent[]
  analysis: GapAnalysis
}

export default function ScheduleAnalysis({ events, analysis }: ScheduleAnalysisProps) {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const chartData = analysis.timeSlots.map(slot => ({
    hour: formatHour(slot.hour),
    hourNum: slot.hour,
    required: (slot.requiredCoverage * 100).toFixed(0),
    actual: (slot.actualCoverage * 100).toFixed(0),
    gap: (slot.gap * 100).toFixed(0),
  }))

  const stats = {
    totalEvents: events.length,
    totalGaps: analysis.totalGaps.toFixed(1),
    criticalGaps: analysis.criticalGaps.length,
    avgCoverage: (
      analysis.timeSlots.reduce((sum, s) => sum + s.actualCoverage, 0) / 24
    ).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Events</p>
              <p className="text-3xl font-bold">{stats.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Gaps</p>
              <p className="text-3xl font-bold">{stats.totalGaps}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Critical Gaps</p>
              <p className="text-3xl font-bold">{stats.criticalGaps}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Coverage</p>
              <p className="text-3xl font-bold">{stats.avgCoverage}%</p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Coverage Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-purple-600" />
          Hourly Coverage Analysis
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="required" 
              stackId="1"
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6}
              name="Required Coverage"
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stackId="2"
              stroke="#ec4899" 
              fill="#ec4899" 
              fillOpacity={0.6}
              name="Actual Coverage"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gap Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
          Coverage Gaps by Hour
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Gap %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="gap" fill="#ef4444" name="Coverage Gap" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2 text-yellow-600" />
          Recommendations
        </h3>
        <ul className="space-y-3">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-2xl">{index === 0 ? '💡' : index === 1 ? '📊' : '✅'}</span>
              <p className="text-gray-700 text-lg">{rec}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Critical Gaps Detail */}
      {analysis.criticalGaps.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            Critical Gaps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.criticalGaps.map((gap, index) => (
              <div 
                key={index}
                className="bg-red-50 border-2 border-red-300 rounded-xl p-4"
              >
                <p className="font-bold text-red-700 text-lg">{formatHour(gap.hour)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Required: {(gap.requiredCoverage * 100).toFixed(0)}% | 
                  Actual: {(gap.actualCoverage * 100).toFixed(0)}%
                </p>
                <p className="text-red-600 font-semibold mt-2">
                  Gap: {(gap.gap * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📅 Your Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.map((event, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-800">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {event.start.toLocaleString()} - {event.end.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


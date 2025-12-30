'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, X } from 'lucide-react'
import { getCoverageProfiles, saveCoverageProfile, getDefaultCoverageProfiles } from '@/utils/storageUtils'
import type { CoverageProfile } from '@/types'

interface CoverageSettingsProps {
  onCoverageChange: (coverage: Record<number, number>) => void
  currentCoverage?: Record<number, number>
}

export default function CoverageSettings({ onCoverageChange, currentCoverage }: CoverageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string>('default')
  const [customCoverage, setCustomCoverage] = useState<Record<number, number>>(
    currentCoverage || getDefaultCoverageProfiles()[0].coverage
  )
  const [profiles, setProfiles] = useState<CoverageProfile[]>([])

  useEffect(() => {
    const defaultProfiles = getDefaultCoverageProfiles()
    const savedProfiles = getCoverageProfiles()
    setProfiles([...defaultProfiles, ...savedProfiles])
  }, [])

  useEffect(() => {
    if (selectedProfile === 'default') {
      const defaultCoverage = getDefaultCoverageProfiles()[0].coverage
      setCustomCoverage(defaultCoverage)
      onCoverageChange(defaultCoverage)
    } else if (selectedProfile === 'custom') {
      onCoverageChange(customCoverage)
    } else {
      const profile = profiles.find(p => p.id === selectedProfile)
      if (profile) {
        setCustomCoverage(profile.coverage)
        onCoverageChange(profile.coverage)
      }
    }
  }, [selectedProfile, profiles, onCoverageChange])

  const handleSliderChange = (hour: number, value: number) => {
    const updated = { ...customCoverage, [hour]: value / 100 }
    setCustomCoverage(updated)
    if (selectedProfile === 'custom') {
      onCoverageChange(updated)
    }
  }

  const handleSaveProfile = () => {
    const name = prompt('Enter profile name:')
    if (name) {
      const saved = saveCoverageProfile({
        name,
        coverage: customCoverage,
        isCustom: true,
      })
      setProfiles([...profiles, saved])
      setSelectedProfile(saved.id)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
      >
        <Settings className="w-5 h-5" />
        <span>Coverage Settings</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Coverage Requirements</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Profile
                </label>
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="default">Default (Retail)</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} {profile.isCustom ? '(Custom)' : ''}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>
              </div>

              {selectedProfile === 'custom' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Customize by Hour</h3>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          {i}:00 - {(i + 1) % 24}:00
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(customCoverage[i] || 0) * 100}
                          onChange={(e) => handleSliderChange(i, parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-center mt-1 font-semibold text-purple-600">
                          {((customCoverage[i] || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onCoverageChange(customCoverage)
                    setIsOpen(false)
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


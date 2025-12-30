import type { SavedAnalysis, CoverageProfile } from '@/types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const STORAGE_KEYS = {
  ANALYSES: 'fv_schedule_analyses',
  COVERAGE_PROFILES: 'fv_coverage_profiles',
  SETTINGS: 'fv_settings',
}

export function saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'timestamp'>): SavedAnalysis {
  if (typeof window === 'undefined') {
    // Server-side, return mock
    return {
      id: generateId(),
      timestamp: new Date(),
      ...analysis,
    }
  }

  try {
    const saved: SavedAnalysis = {
      id: generateId(),
      timestamp: new Date(),
      ...analysis,
    }

    const existing = getSavedAnalyses()
    existing.unshift(saved) // Add to beginning
    // Keep only last 50 analyses
    const limited = existing.slice(0, 50)
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(limited))
    
    return saved
  } catch (error) {
    console.error('Failed to save analysis to localStorage:', error)
    // Return the analysis object anyway so UI doesn't break
    return {
      id: generateId(),
      timestamp: new Date(),
      ...analysis,
    }
  }
}

export function getSavedAnalyses(): SavedAnalysis[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.ANALYSES)
  if (!stored) return []

  try {
    const analyses = JSON.parse(stored)
    // Convert date strings back to Date objects
    return analyses.map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp),
      events: a.events.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      })),
    }))
  } catch {
    return []
  }
}

export function deleteAnalysis(id: string): void {
  const analyses = getSavedAnalyses()
  const filtered = analyses.filter(a => a.id !== id)
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(filtered))
}

export function getAnalysisById(id: string): SavedAnalysis | null {
  const analyses = getSavedAnalyses()
  return analyses.find(a => a.id === id) || null
}

export function saveCoverageProfile(profile: Omit<CoverageProfile, 'id'>): CoverageProfile {
  const saved: CoverageProfile = {
    id: generateId(),
    ...profile,
  }

  const existing = getCoverageProfiles()
  const updated = existing.filter(p => p.id !== saved.id)
  updated.push(saved)
  localStorage.setItem(STORAGE_KEYS.COVERAGE_PROFILES, JSON.stringify(updated))
  
  return saved
}

export function getCoverageProfiles(): CoverageProfile[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEYS.COVERAGE_PROFILES)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function deleteCoverageProfile(id: string): void {
  const profiles = getCoverageProfiles()
  const filtered = profiles.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.COVERAGE_PROFILES, JSON.stringify(filtered))
}

export function getDefaultCoverageProfiles(): CoverageProfile[] {
  return [
    {
      id: 'retail',
      name: 'Retail',
      isCustom: false,
      coverage: {
        0: 0.1, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.2,
        6: 0.3, 7: 0.5, 8: 0.7, 9: 0.9, 10: 1.0, 11: 1.0,
        12: 0.9, 13: 0.8, 14: 1.0, 15: 1.0, 16: 0.9, 17: 0.8,
        18: 0.6, 19: 0.5, 20: 0.4, 21: 0.3, 22: 0.2, 23: 0.2,
      },
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      isCustom: false,
      coverage: {
        0: 0.7, 1: 0.7, 2: 0.7, 3: 0.7, 4: 0.7, 5: 0.8,
        6: 0.9, 7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0, 11: 1.0,
        12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0,
        18: 0.9, 19: 0.8, 20: 0.8, 21: 0.8, 22: 0.7, 23: 0.7,
      },
    },
    {
      id: 'call-center',
      name: 'Call Center',
      isCustom: false,
      coverage: {
        0: 0.3, 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.3, 5: 0.4,
        6: 0.5, 7: 0.7, 8: 0.9, 9: 1.0, 10: 1.0, 11: 1.0,
        12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0, 16: 0.9, 17: 0.8,
        18: 0.7, 19: 0.6, 20: 0.5, 21: 0.4, 22: 0.3, 23: 0.3,
      },
    },
  ]
}


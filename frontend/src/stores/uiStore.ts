import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  historyPanelOpen: boolean
  currentGenerationId: string | null
  isGenerating: boolean
  error: string | null

  toggleSidebar: () => void
  toggleHistoryPanel: () => void
  setCurrentGeneration: (id: string | null) => void
  setIsGenerating: (generating: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  historyPanelOpen: true,
  currentGenerationId: null,
  isGenerating: false,
  error: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleHistoryPanel: () => set((state) => ({ historyPanelOpen: !state.historyPanelOpen })),
  setCurrentGeneration: (id) => set({ currentGenerationId: id }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

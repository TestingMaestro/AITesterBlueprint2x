import { create } from 'zustand'

/* ─── CROSS-BROWSER THEME PERSISTENCE ────────────────────────
   1. Try localStorage first (works in all modern browsers, normal mode)
   2. Fall back to document.cookie (works in incognito / storage-blocked)
   3. Fall back to OS prefers-color-scheme media query
   4. Apply both `dark` class AND `data-theme` attribute for CSS compat
─────────────────────────────────────────────────────────────── */

/** Safe localStorage read — returns null if storage is blocked */
function safeGetStorage(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key)
    }
  } catch (_e) {
    // localStorage blocked (incognito Safari, storage quota, etc.)
  }
  return null
}

/** Safe localStorage write — silently fails if storage is blocked */
function safeSetStorage(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value)
    }
  } catch (_e) {
    // localStorage blocked — fall through to cookie fallback
  }
}

/** Cookie-based fallback for when localStorage is unavailable */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

/** Detect the initial theme from saved preference or OS setting */
function getInitialTheme(): boolean {
  // 1. Check localStorage
  const stored = safeGetStorage('jobtracker-theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false

  // 2. Check cookie fallback
  const cookie = getCookie('jobtracker-theme')
  if (cookie === 'dark') return true
  if (cookie === 'light') return false

  // 3. Respect OS-level preference (works in all modern browsers)
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  return false // default to light
}

/** Apply theme to the DOM — uses both class and data-attribute for max compat */
function applyThemeToDOM(isDark: boolean): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  if (isDark) {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
}

/** Persist theme to both localStorage AND cookie for maximum reliability */
function persistTheme(isDark: boolean): void {
  const value = isDark ? 'dark' : 'light'
  safeSetStorage('jobtracker-theme', value)
  setCookie('jobtracker-theme', value)
}

// ─── Initialize theme on module load ───
const initialDark = getInitialTheme()
applyThemeToDOM(initialDark)

interface UIStore {
  sidebarOpen: boolean
  aiPanelOpen: boolean
  addJobModalOpen: boolean
  editJobId: string | null
  activeModal: string | null
  isDarkMode: boolean
  setSidebarOpen: (open: boolean) => void
  setAIPanelOpen: (open: boolean) => void
  setAddJobModalOpen: (open: boolean) => void
  setEditJobId: (id: string | null) => void
  setActiveModal: (modal: string | null) => void
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  aiPanelOpen: false,
  addJobModalOpen: false,
  editJobId: null,
  activeModal: null,
  isDarkMode: initialDark,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
  setAddJobModalOpen: (open) => set({ addJobModalOpen: open }),
  setEditJobId: (id) => set({ editJobId: id }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  toggleTheme: () => set((state) => {
    const newDark = !state.isDarkMode
    applyThemeToDOM(newDark)
    persistTheme(newDark)
    return { isDarkMode: newDark }
  }),
}))

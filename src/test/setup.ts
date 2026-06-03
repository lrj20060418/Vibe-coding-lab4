import '@testing-library/jest-dom/vitest'

const storage = new Map<string, string>()

const localStorageMock: Storage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => {
    storage.set(key, value)
  },
  removeItem: (key) => {
    storage.delete(key)
  },
  clear: () => {
    storage.clear()
  },
  get length() {
    return storage.size
  },
  key: (index) => Array.from(storage.keys())[index] ?? null,
}

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

beforeEach(() => {
  storage.clear()
})

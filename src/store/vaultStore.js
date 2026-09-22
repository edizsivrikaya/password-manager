import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createSalt,
  deriveKey,
  createVerifier,
  verifyKey,
  encryptText,
  decryptText,
} from '../lib/crypto'

export const useVaultStore = create(
  persist(
    (set, get) => ({
      salt: null,
      verifier: null,
      entries: [],

      encryptionKey: null,
      isUnlocked: false,

      setup: async (masterPassword) => {
        const salt = createSalt()
        const key = await deriveKey(masterPassword, salt)
        const verifier = await createVerifier(key)

        set({
          salt,
          verifier,
          entries: [],
          encryptionKey: key,
          isUnlocked: true,
        })
      },

      unlock: async (masterPassword) => {
        const { salt, verifier } = get()
        const key = await deriveKey(masterPassword, salt)

        if (!(await verifyKey(key, verifier))) {
          return false
        }

        set({ encryptionKey: key, isUnlocked: true })
        return true
      },

      lock: () => set({ encryptionKey: null, isUnlocked: false }),

      addEntry: async ({ title, username, category, password }) => {
        const { encryptionKey, entries } = get()

        const entry = {
          id: crypto.randomUUID(),
          title,
          username,
          category,
          password: await encryptText(encryptionKey, password),
        }

        set({ entries: [...entries, entry] })
      },

      deleteEntry: (id) => {
        const { entries } = get()

        set({ entries: entries.filter((item) => item.id !== id) })
      },

      updateEntry: async (id, { title, username, category, password }) => {
        const { encryptionKey, entries } = get()
        const encrypted = await encryptText(encryptionKey, password)

        set({
          entries: entries.map((item) =>
            item.id === id
              ? { ...item, title, username, category, password: encrypted }
              : item,
          ),
        })
      },

      getEntryPassword: async (id) => {
        const { encryptionKey, entries } = get()
        const entry = entries.find((item) => item.id === id)

        return decryptText(encryptionKey, entry.password)
      },
    }),
    {
      name: 'password-manager',
      partialize: (state) => ({
        salt: state.salt,
        verifier: state.verifier,
        entries: state.entries,
      }),
    },
  ),
)

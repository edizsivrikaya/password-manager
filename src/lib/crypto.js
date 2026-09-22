const CHECK_TEXT = 'password-manager-unlock-check'

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
}

export function createSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return bytesToBase64(salt)
}

export async function deriveKey(masterPassword, saltBase64) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(saltBase64),
      iterations: 250000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptText(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(text),
  )

  return {
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(cipher)),
  }
}

export async function decryptText(key, payload) {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(payload.iv) },
    key,
    base64ToBytes(payload.data),
  )

  return new TextDecoder().decode(plain)
}

export function createVerifier(key) {
  return encryptText(key, CHECK_TEXT)
}

export async function verifyKey(key, verifier) {
  try {
    const text = await decryptText(key, verifier)
    return text === CHECK_TEXT
  } catch {
    return false
  }
}

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*-_=+:,.?',
}

export function generatePassword({
  length,
  lowercase,
  uppercase,
  numbers,
  symbols,
}) {
  let pool = ''

  if (lowercase) pool += CHARSETS.lowercase
  if (uppercase) pool += CHARSETS.uppercase
  if (numbers) pool += CHARSETS.numbers
  if (symbols) pool += CHARSETS.symbols

  if (pool === '') {
    return ''
  }

  const randomValues = crypto.getRandomValues(new Uint32Array(length))
  let result = ''

  for (let i = 0; i < length; i++) {
    result += pool[randomValues[i] % pool.length]
  }

  return result
}

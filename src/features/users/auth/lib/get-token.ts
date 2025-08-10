export const generateToken = async (tokenSize: number = 32): Promise<string> => {
  const array = new Uint8Array(tokenSize)
  crypto.getRandomValues(array)

  // Convert to hex string
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const generateToken = async (tokenSize: number = 32): Promise<string> => {
  // Use Web Crypto API which is compatible with Edge runtime
  const array = new Uint8Array(tokenSize)
  crypto.getRandomValues(array)
  
  // Convert to hex string
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

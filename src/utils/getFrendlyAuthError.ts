function getFriendlyAuthError(error: { message?: string } | null) {
  if (!error?.message) return ''
  const message = error.message.toLowerCase()
  if (message.includes('invalid login credentials')) return 'Email or password is incorrect. Please try again.'
  if (message.includes('email not confirmed')) return 'Please confirm your email before signing in.'
  if (message.includes('user not found')) return 'No account found for that email.'
  if (message.includes('network')) return 'Network issue. Please check your connection and try again.'
  return 'Unable to sign in right now. Please try again.'
}
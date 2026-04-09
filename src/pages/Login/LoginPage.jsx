import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthScreen from '../../components/auth/AuthScreen'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const { login, signup, user, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(mode, formData) {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (mode === 'signup') {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        })
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthScreen
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      errorMessage={errorMessage}
    />
  )
}

export default LoginPage

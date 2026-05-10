import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken } from '../utils/auth'
import { useTranslation } from 'react-i18next'
import { apiPath } from '../utils/api'

export default function useLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(false)
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('login_module.error_empty')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch(apiPath('login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError('login_module.error_login_failed')
        return
      }

      saveToken(data.token, rememberMe)
      navigate('/dashboard')

    } catch (err) {
      setError('login_module.error_connection')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    error, loading,
    handleLogin, handleKeyDown,
  }
}

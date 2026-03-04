import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function useLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect.')
      } else if (err.response?.status === 422) {
        setError(Object.values(err.response.data.errors).flat()[0])
      } else {
        setError('Erreur de connexion. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    error,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePassword: () => setShowPassword(!showPassword),
  }
}
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../index.css'

const ResetPassword = () => {
  const { t, i18n } = useTranslation()
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== passwordConfirmation) {
      setError(t('password_reset_module.error_mismatch'))
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.message || t('password_reset_module.error_failed'))
      }
    } catch (err) {
      setError(t('login_module.error_connection'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#ffffff' }}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src="/images/tablebooking.png"
          alt="TableBooking Logo"
          className="h-12 sm:h-16 object-contain"
          onError={(e) => { e.target.src = 'images/tablebooking.png' }}
        />
      </div>

      <div className="bg-white shadow-xl px-6 sm:px-8 pt-6 pb-7 w-full max-w-sm border-t-4" style={{ borderColor: '#c8a97e' }}>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {t('password_reset_module.title')}
        </h2>

        {error && (
          <div className="mb-4 px-3 py-2 border text-xs" style={{ backgroundColor: '#ffffff', borderColor: '#DC2626', color: '#DC2626' }}>
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-6 py-4 px-3 border border-green-200 bg-green-50 text-green-700 text-sm font-medium">
              {t('password_reset_module.success_message')}
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-bold text-[#c8a97e] uppercase hover:underline"
            >
              {t('password_reset_module.back_to_login')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                {t('password_reset_module.email_label')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                {t('password_reset_module.password_label')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 pr-9"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${i18n.language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 focus:outline-none`}
                  style={{ color: '#c8a97e' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="confirm-password">
                {t('password_reset_module.confirm_password_label')}
              </label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 pr-9"
                dir="ltr"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-60"
                style={{ backgroundColor: '#c8a97e' }}
              >
                {loading ? t('password_reset_module.updating') : t('password_reset_module.submit_button')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs font-bold text-gray-400 uppercase hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {t('password_reset_module.back_to_login')}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(200,169,126,0.18)' }}>
          <LanguageSwitcher position="top" />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

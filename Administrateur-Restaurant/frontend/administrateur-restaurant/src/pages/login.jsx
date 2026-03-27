import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLogin from '../hooks/useLogin'
import LanguageSwitcher from '../components/LanguageSwitcher'
import '../index.css'

const Login = () => {
  const { t, i18n } = useTranslation()
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    error, loading,
    handleLogin, handleKeyDown,
  } = useLogin()

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      setForgotError(t('login_module.error_empty'))
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail)) {
      setForgotError(t('login_module.error_invalid_email'))
      return
    }

    setForgotError('')
    setResetLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })

      if (response.ok) {
        setResetSuccess(true)
      } else {
        const d = await response.json()
        setForgotError(d.message || t('login_module.error_sending_reset'))
      }
    } catch (err) {
      setForgotError(t('login_module.error_connection'))
    } finally {
      setResetLoading(false)
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
          src="images/tablebooking.png"
          alt={t('login_module.logo_alt')}
          className="h-12 sm:h-16 object-contain"
        />
      </div>

      <div className="bg-white shadow-xl px-6 sm:px-8 pt-6 pb-7 w-full max-w-sm border-t-4" style={{ borderColor: '#c8a97e' }}>

        {!showForgot ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{t('login_module.title')}</h2>
            {error && (
              <div className="mb-4 px-3 py-2 border text-xs" style={{ backgroundColor: '#ffffff', borderColor: '#DC2626', color: '#DC2626' }}>
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
                {t('login_module.username_or_email')}
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
                {t('login_module.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-start mb-6">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] font-bold text-[#c8a97e] uppercase hover:underline"
              >
                {t('login_module.forgot_password')}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-700">{t('login_module.remember_me')}</span>
              </label>
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="text-white text-sm font-medium px-4 py-1.5 hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-60"
                style={{ backgroundColor: '#c8a97e' }}
              >
                {loading ? t('login_module.logging_in') : t('login_module.log_in')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{t('login_module.forgot_password_title')}</h2>
            
            {forgotError && (
              <div className="mb-4 px-3 py-2 border text-xs" style={{ backgroundColor: '#ffffff', borderColor: '#DC2626', color: '#DC2626' }}>
                {forgotError}
              </div>
            )}

            {resetSuccess ? (
              <div className="text-center">
                <div className="mb-6 py-4 px-3 border border-green-200 bg-green-50 text-green-700 text-sm font-medium">
                  {t('login_module.reset_link_sent')}
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setResetSuccess(false); setForgotEmail(''); }}
                  className="text-xs font-bold text-[#c8a97e] uppercase hover:underline"
                >
                  {t('login_module.back_to_login')}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="forgot-email">
                    {t('login_module.email_label')}
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={t('login_module.email_placeholder')}
                    className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={resetLoading}
                    className="w-full text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-60"
                    style={{ backgroundColor: '#c8a97e' }}
                  >
                    {resetLoading ? t('login_module.saving') : t('login_module.reset_button')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(false); setForgotError(''); }}
                    className="text-xs font-bold text-gray-400 uppercase hover:text-gray-600 transition-colors"
                  >
                    {t('login_module.back_to_login')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
        
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(200,169,126,0.18)' }}>
          <LanguageSwitcher position="top" />
        </div>

      </div>
    </div>
  )
}

export default Login

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useLogin from '../hooks/useLogin'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ChevronLeft, Check } from 'lucide-react'
import { ThreeDot } from 'react-loading-indicators'
import {
  DARK, LIGHT_BROWN, WHITE, BORDER, RADIUS
} from '../styles/dashboard/tokens'
import { apiPath } from '../utils/api'

const Login = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
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
  const [resetSuccess, setResetSuccess] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      setForgotError(t('login_module.error_empty'))
      return
    }

    setForgotError('')
    setResetLoading(true)

    try {
      const response = await fetch(apiPath('auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResetSuccess(true)
      } else {
        setForgotError(data.message || t('login_module.error_failed'))
      }
    } catch (err) {
      setForgotError(t('login_module.error_connection'))
    } finally {
      setResetLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    background: '#ffffff',
    border: `1.5px solid ${BORDER}`,
    borderRadius: RADIUS.md,
    fontSize: '14px',
    color: DARK,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '800',
    color: DARK,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  }

  const btnStyle = {
    width: '100%',
    height: '52px',
    background: LIGHT_BROWN,
    border: 'none',
    borderRadius: RADIUS.md,
    color: WHITE,
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/login_bg.png") center/cover no-repeat',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      

      {/* Branding Logo - Top Left */}
      <div style={{ 
        position: 'absolute', 
        top: '40px', 
        left: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <img src="/images/tablebooking.png" alt="Logo" style={{ height: '48px', filter: 'brightness(0) invert(1)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '900', 
            color: WHITE,
            letterSpacing: '-0.03em',
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            {showForgot ? t('login_module.forgot_title') : t('login_module.welcome_back')}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888', fontWeight: '500' }}>
            {showForgot ? t('login_module.reset_instructions') : t('login_module.subtitle_login')}
          </p>
        </div>

        <div style={{ 
          background: WHITE, 
          padding: '48px', 
          borderRadius: RADIUS.lg, 
          border: `1px solid ${BORDER}`,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03), 0 8px 10px -6px rgba(0,0,0,0.03)',
        }}>
          {!showForgot ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {error && (
                <div style={{ 
                  margin: '0 0 20px',
                  fontSize: '13px', 
                  color: '#EF4444', 
                  fontWeight: '700', 
                  textAlign: 'center',
                }}>
                  {t(error)}
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>{t('login_module.email_label')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="admin@tablebooking.ma"
                    style={inputStyle}
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>{t('login_module.password_label')}</label>
                  <button
                    onClick={() => setShowForgot(true)}
                    style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '700', color: LIGHT_BROWN, cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {t('login_module.forgot_password')}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    style={inputStyle}
                    className="login-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: DARK, opacity: 0.3, cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ position: 'relative', width: '18px', height: '18px' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ 
                        width: '18px', height: '18px', cursor: 'pointer', accentColor: LIGHT_BROWN,
                        margin: 0, appearance: 'auto'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#4B4B4B' }}>
                    {t('login_module.remember_me')}
                  </span>
                </label>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                style={{ 
                  ...btnStyle, 
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transform: loading ? 'none' : undefined
                }}
                className="login-btn"
              >
                {loading ? t('login_module.logging_in') : t('login_module.log_in')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {forgotError && (
                <div style={{ padding: '14px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: RADIUS.md, fontSize: '13px', color: '#DC2626', fontWeight: '600', textAlign: 'center' }}>
                  {forgotError}
                </div>
              )}

              {resetSuccess ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: '56px', height: '56px', background: '#F0FDF4', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={28} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: DARK, margin: '0 0 12px' }}>
                    {t('login_module.reset_link_sent_title') || 'Check your email'}
                  </h3>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
                    {t('login_module.reset_link_sent')}
                  </p>
                  <button
                    onClick={() => { setShowForgot(false); setResetSuccess(false); setForgotEmail(''); }}
                    style={{ background: 'none', border: `1.5px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '12px 24px', fontSize: '14px', fontWeight: '700', color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto', transition: 'all 0.2s' }}
                  >
                    <ChevronLeft size={18} />
                    {t('login_module.back_to_login')}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ position: 'relative' }}>
                    <label style={labelStyle}>{t('login_module.email_label')}</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder={t('login_module.email_placeholder')}
                        style={inputStyle}
                        className="login-input"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleForgotSubmit}
                    disabled={resetLoading}
                    style={{ ...btnStyle, opacity: resetLoading ? 0.8 : 1 }}
                    className="login-btn"
                  >
                    {resetLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px' }}>
                        {t('settings_module.saving', { defaultValue: 'Loading...' })}
                      </div>
                    ) : t('login_module.reset_button')}
                  </button>

                  <button
                    onClick={() => { setShowForgot(false); setForgotError(''); }}
                    style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '800', color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s', marginTop: '8px' }}
                  >
                    <ChevronLeft size={16} />
                    {t('login_module.back_to_login')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher inline={true} />
        </div>
      </div>

      <style>{`
        .login-input:focus {
          border-color: ${LIGHT_BROWN} !important;
          box-shadow: 0 0 0 4px rgba(193, 154, 107, 0.1) !important;
        }
        .login-btn:hover:not(:disabled) {
          background: #A8834E !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(193, 154, 107, 0.2);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px white inset !important; }
      `}</style>
    </div>
  )
}

export default Login

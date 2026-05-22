import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, ChevronLeft } from 'lucide-react'
import { ThreeDot } from 'react-loading-indicators'
import {
  DARK, LIGHT_BROWN, WHITE, BORDER, RADIUS
} from '../styles/dashboard/tokens'
import { apiPath } from '../utils/api'

const ResetPassword = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError(t('login_module.error_password_mismatch'))
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch(apiPath('auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmPassword
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      } else {
        const data = await response.json()
        setError(data.message || t('login_module.error_reset_failed'))
      }
    } catch (err) {
      setError(t('login_module.error_connection'))
    } finally {
      setLoading(false)
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
    }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Branding Logo - Top Left */}
      <div style={{ position: 'absolute', top: '40px', left: '40px' }}>
        <img src="/images/tablebooking.png" alt="Logo" style={{ height: '36px' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '900', 
            color: DARK,
            letterSpacing: '-0.03em',
            marginBottom: '8px'
          }}>
            {t('password_reset_module.title')}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#888', fontWeight: '500' }}>
            {t('password_reset_module.subtitle_reset') || 'Set your new secure password'}
          </p>
        </div>

        <div style={{ 
          background: WHITE, 
          padding: '48px', 
          borderRadius: RADIUS.lg, 
          border: `1px solid ${BORDER}`,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03), 0 8px 10px -6px rgba(0,0,0,0.03)',
        }}>
          {error && (
            <div style={{ padding: '14px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: RADIUS.md, fontSize: '13px', color: '#DC2626', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#F0FDF4', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={28} strokeWidth={3} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: DARK, margin: '0 0 12px' }}>
                {t('password_reset_module.success_title')}
              </h3>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
                {t('password_reset_module.success_message')}
              </p>
              <button
                onClick={() => navigate('/')}
                style={btnStyle}
                className="login-btn"
              >
                {t('password_reset_module.back_to_login')}
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <label style={labelStyle}>{t('password_reset_module.email_label')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@tablebooking.ma"
                    style={inputStyle}
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('password_reset_module.password_label')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <div>
                <label style={labelStyle}>{t('password_reset_module.confirm_password_label')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: DARK, opacity: 0.3 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    className="login-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ 
                  ...btnStyle, 
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                className="login-btn"
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px', scale: '0.8' }}>
                    {t('settings_module.saving', { defaultValue: 'Loading...' })}
                  </div>
                ) : (
                  <>
                    {t('password_reset_module.submit_button')}
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '800', color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }}
              >
                <ChevronLeft size={16} />
                {t('password_reset_module.back_to_login')}
              </button>
            </form>
          )}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher position="top" />
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

export default ResetPassword

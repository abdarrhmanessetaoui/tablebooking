import { useRef } from 'react'
import useLogin from '../hooks/useLogin'

const BROWN      = '#9A6F2E'
const BROWN_DARK = '#7A5520'

export default function Login() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    error, loading,
    handleLogin, handleKeyDown,
  } = useLogin()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      background: '#fff',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── LEFT — branding panel ── */}
      <div style={{
        width: '45%',
        background: BROWN,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(32px,5vw,64px)',
        flexShrink: 0,
      }}
        className="login-left"
      >
        {/* Logo */}
        <div>
          <img
            src="images/tablebooking.png"
            alt="TableBooking.ma"
            style={{ height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
          />
          <span style={{ display: 'none', fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
            TableBooking.ma
          </span>
        </div>

        {/* Headline */}
        <div>
          <p style={{ margin: '0 0 16px', fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05 }}>
            Gérez vos<br />réservations.
          </p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Tableau de bord complet pour<br />les restaurants marocains.
          </p>
        </div>

        {/* Footer */}
        <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>
          © 2025 TableBooking.ma
        </p>
      </div>

      {/* ── RIGHT — form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px,4vw,64px)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: '-0.8px' }}>
            Connexion
          </h1>
          <p style={{ margin: '0 0 36px', fontSize: 14, fontWeight: 500, color: '#BABABA' }}>
            Bienvenue. Entrez vos identifiants.
          </p>

          {/* Error */}
          {error && (
            <p style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 600, color: '#C0182B' }}>
              ⚠ {error}
            </p>
          )}

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              style={{
                width: '100%', padding: '14px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #E8E8E8',
                fontSize: 15, fontWeight: 600, color: '#111',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderBottomColor = BROWN}
              onBlur={e => e.target.style.borderBottomColor = '#E8E8E8'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              style={{
                width: '100%', padding: '14px 36px 14px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #E8E8E8',
                fontSize: 15, fontWeight: 600, color: '#111',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderBottomColor = BROWN}
              onBlur={e => e.target.style.borderBottomColor = '#E8E8E8'}
            />
            {/* Show/hide toggle */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 0, bottom: 14,
                background: 'none', border: 'none', padding: 0,
                cursor: 'pointer', color: '#BABABA',
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                width: 18, height: 18, flexShrink: 0,
                border: `2px solid ${rememberMe ? BROWN : '#D0D0D0'}`,
                background: rememberMe ? BROWN : 'transparent',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.13s',
              }}
            >
              {rememberMe && (
                <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span
              onClick={() => setRememberMe(!rememberMe)}
              style={{ fontSize: 13, fontWeight: 600, color: '#888', cursor: 'pointer', userSelect: 'none' }}
            >
              Se souvenir de moi
            </span>
          </div>

          {/* Submit */}
          <LoginButton onClick={handleLogin} loading={loading} />

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .login-left { display: none !important; }
        }
        input::placeholder { color: #D0D0D0; }
      `}</style>
    </div>
  )
}

function LoginButton({ onClick, loading }) {
  const [hov, setHov] = [false, () => {}]
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={e => e.currentTarget.style.background = BROWN_DARK}
      onMouseLeave={e => e.currentTarget.style.background = BROWN}
      style={{
        width: '100%',
        padding: '16px',
        background: BROWN,
        border: 'none',
        color: '#fff',
        fontSize: 15, fontWeight: 800,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.65 : 1,
        transition: 'background 0.15s',
        fontFamily: 'inherit',
        letterSpacing: '-0.2px',
      }}
    >
      {loading ? 'Connexion…' : 'Se connecter'}
    </button>
  )
}

const BROWN_DARK = '#7A5520'
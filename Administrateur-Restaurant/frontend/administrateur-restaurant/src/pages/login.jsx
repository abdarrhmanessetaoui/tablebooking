import useLogin from '../hooks/useLogin'
import { styles } from '../styles/loginStyles'

export default function Login() {
  const { form, error, loading, showPassword, handleChange, handleSubmit, togglePassword } = useLogin()

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>

        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l19-9-9 19-2-8-8-2z"/>
            </svg>
          </div>
          <h1 style={styles.title}>Administrateur</h1>
          <p style={styles.subtitle}>Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Adresse email</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" name="email" placeholder="admin@restaurant.com"
                value={form.email} onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required style={styles.input} />
              <button type="button" onClick={togglePassword} style={styles.eyeBtn}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }}>
            {loading ? <span style={styles.spinner} /> : 'Se connecter'}
          </button>

        </form>
      </div>
    </div>
  )
}
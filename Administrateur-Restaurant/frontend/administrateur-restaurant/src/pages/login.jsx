import React from 'react'
import useLogin from '../hooks/useLogin'
import '../index.css'

const Login = () => {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    error, loading,
    handleLogin, handleKeyDown,
  } = useLogin()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#FFFFFF', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src="images/tablebooking.png"
          alt="TableBooking Logo"
          className="h-12 sm:h-16 object-contain"
        />
      </div>

      <div className="bg-white border-2 border-[#2b2118] px-6 sm:px-8 pt-6 pb-7 w-full max-w-sm">

        {error && (
          <div className="mb-4 px-3 py-2 bg-[#FF0000] border-none text-xs text-[#FFFFFF] font-black uppercase">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-black uppercase text-[#2b2118] mb-1" htmlFor="email">
            Username or Email Address
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-2 border-[#2b2118] px-3 py-2 text-sm text-[#2b2118] font-bold focus:outline-none"
            style={{ borderRadius: 0, background: '#FFFFFF' }}
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-black uppercase text-[#2b2118] mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border-2 border-[#2b2118] px-3 py-2 text-sm text-[#2b2118] font-bold focus:outline-none pr-9"
              style={{ borderRadius: 0, background: '#FFFFFF' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
              style={{ color: '#2b2118', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              tabIndex={-1}
            >
              {showPassword ? 'Masquer' : 'Voir'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-5 h-5 accent-[#c8a97e] bg-white border-2 border-[#2b2118]"
              style={{ borderRadius: 0 }}
            />
            <span className="text-[11px] font-black uppercase text-[#2b2118] letter-spacing-tight">Remember Me</span>
          </label>
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 text-[#c8a97e] text-xs font-black px-4 py-3 focus:outline-none disabled:opacity-50"
            style={{ backgroundColor: '#2b2118', border: '2px solid #2b2118' }}
          >
            {loading ? 'Connexion…' : 'SE CONNECTER'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login
import React from 'react'
import useLogin from '../hooks/useLogin'
import '../index.css'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-sidebar"
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src="images/tablebooking.png"
          alt="TableBooking Logo"
          className="h-12 sm:h-16 object-contain"
        />
      </div>

      <div className="w-full max-w-sm">
        <div className="card px-6 sm:px-8 pt-7 pb-7">

          {error && (
            <div
              role="alert"
              className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
              Username or email
            </label>
            <Input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@restaurant.com"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-accent hover:bg-bg focus-ring"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
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

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded border-border text-accent focus-ring"
              />
              <span className="text-xs font-medium text-ink/80">Remember me</span>
            </label>
            <Button onClick={handleLogin} disabled={loading} size="md">
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </div>

        </div>

        <p className="mt-5 text-center text-xs text-white/50">
          Secure access for restaurant administrators.
        </p>
      </div>
    </div>
  )
}

export default Login
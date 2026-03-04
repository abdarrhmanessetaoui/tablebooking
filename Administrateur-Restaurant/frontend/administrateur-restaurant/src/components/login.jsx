import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../index.css'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#2b2118' }}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src="images/tablebooking.png"
          alt="TableBooking Logo"
          className="h-12 sm:h-16 object-contain"
        />
      </div>

      <div className="bg-white rounded shadow-xl px-6 sm:px-8 pt-6 pb-7 w-full max-w-sm">

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
            Username or Email Address
          </label>
          <input
            id="email"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-3.5 h-3.5"
            />
            <span className="text-xs text-gray-700">Remember Me</span>
          </label>
          <button
            type="button"
            className="text-white text-sm font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity focus:outline-none"
            style={{ backgroundColor: '#c8a97e' }}
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login
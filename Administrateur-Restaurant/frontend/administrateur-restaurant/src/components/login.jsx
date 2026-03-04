import React from 'react'
import index
const login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">Login</h1>
        <form>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            <a href="#" className="text-sm text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default login
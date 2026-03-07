import { useState } from 'react'
import { B } from '../../utils/brand'

export default function Card({ children, onClick }) {

  return (
    <div
      onClick={onClick}
      className="
        bg-white
        border border-gray-200
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition
        duration-200
        hover:-translate-y-1
        cursor-pointer
      "
    >
      {children}
    </div>
  )
}
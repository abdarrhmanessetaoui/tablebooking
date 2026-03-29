import { useState } from 'react'
import { DARK, GOLD, BORDER, CREAM } from './constants'

export default function TextInput({ value, onChange, placeholder, type = 'text', icon: Icon, disabled, readOnly }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && (
        <Icon
          size={14}
          strokeWidth={2}
          color={focused ? GOLD : DARK}
          style={{
            position: 'absolute',
            left: 12,
            flexShrink: 0,
            transition: 'color 0.15s',
            pointerEvents: 'none',
          }}
        />
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => { if (!readOnly) onChange(e.target.value) }}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: Icon ? '11px 14px 11px 36px' : '11px 14px',
          border: `4px solid ${focused ? GOLD : BORDER}`,
          fontSize: 13,
          fontWeight: 700,
          color: DARK,
          fontFamily: 'inherit',
          outline: 'none',
          background: disabled || readOnly ? CREAM : '#fff',
          borderRadius: 0,
          transition: 'border-color 0.15s',
          WebkitAppearance: 'none',
          cursor: readOnly ? 'text' : disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  )
}
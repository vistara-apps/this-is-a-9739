import React from 'react'

const Card = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'card animate-fade-in'
  const variantClasses = {
    default: '',
    highlighted: 'card-highlighted'
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
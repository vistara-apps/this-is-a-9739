// React import removed for JSX transform

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  }

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    default: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg'
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
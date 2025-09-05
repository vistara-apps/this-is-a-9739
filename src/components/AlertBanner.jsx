import { Info, AlertTriangle, CheckCircle, X } from 'lucide-react'
import PropTypes from 'prop-types'
import Button from './Button'

const AlertBanner = ({ type = 'info', message, action, onAction, onDismiss }) => {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle
  }

  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const Icon = icons[type]

  return (
    <div className={`border-l-4 p-4 ${colors[type]} animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {action && onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="text-xs"
            >
              {action}
            </Button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

AlertBanner.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'success']),
  message: PropTypes.string.isRequired,
  action: PropTypes.string,
  onAction: PropTypes.func,
  onDismiss: PropTypes.func
}

export default AlertBanner

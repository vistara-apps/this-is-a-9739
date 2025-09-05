
import { MapPin, Globe, Menu, Shield } from 'lucide-react'
import Button from './Button'

const AppBar = ({ location, language, onLanguageToggle, onMenuToggle, isSubscribed }) => {
  return (
    <header className="bg-surface shadow-card border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-text-primary">Pocket Parley</h1>
              {isSubscribed && (
                <span className="text-xs text-secondary font-medium">Premium</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {location && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{location.state}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'ES'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onMenuToggle}
              className="sm:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppBar
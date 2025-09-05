import React from 'react'

const Tabs = ({ tabs, activeTab, onTabChange, language }) => {
  const getTabLabel = (tab) => {
    const labels = {
      en: {
        rights: 'Rights',
        scripts: 'Scripts', 
        record: 'Record',
        summary: 'Summary'
      },
      es: {
        rights: 'Derechos',
        scripts: 'Guiones',
        record: 'Grabar',
        summary: 'Resumen'
      }
    }
    return labels[language][tab.id] || tab.label
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{getTabLabel(tab)}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Tabs
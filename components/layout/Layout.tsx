'use client'

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header' // Importation du nouveau Header
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  // unreadNotificationCount?: number // Cette prop ne sera plus utilisée ici
}

const Layout: React.FC<LayoutProps> = ({ children /*, unreadNotificationCount*/ }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header /> {/* Nouvelle barre de navigation */}
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          // unreadNotificationCount={unreadNotificationCount} // Ne sera plus passé ici
        />
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } p-6 pt-20 min-h-screen flex flex-col`}> {/* pt-16 pour compenser la hauteur du header */}
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default Layout 
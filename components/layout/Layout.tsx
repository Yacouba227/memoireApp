'use client'

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  unreadNotificationCount?: number
}

const Layout: React.FC<LayoutProps> = ({ children, unreadNotificationCount }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        unreadNotificationCount={unreadNotificationCount}
      />
      
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } p-6 min-h-screen flex flex-col`}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default Layout 
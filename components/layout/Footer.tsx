'use client'

import React from 'react'

const Footer: React.FC = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="w-full border-t border-gray-200 py-4 text-center text-xs text-gray-500">
      © {year} FAST - Tous droits réservés
    </footer>
  )
}

export default Footer



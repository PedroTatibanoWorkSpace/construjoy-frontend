"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clientes', href: '/customers', icon: UserGroupIcon },
  { name: 'Compras a Crédito', href: '/credit-purchases', icon: CreditCardIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-900">
      <motion.div 
        initial={false}
        animate={{ width: collapsed ? '5rem' : '16rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col shadow-xl z-10"
      >
        {/* Logo/Cabeçalho */}
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-gray-700 bg-gradient-to-r from-blue-900 to-gray-800`}>
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.span 
                key="collapsed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-2xl font-bold text-blue-400"
              >
                CJ
              </motion.span>
            ) : (
              <motion.div 
                key="expanded"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex items-center"
              >
                <span className="text-2xl font-bold text-blue-400">Constru</span>
                <span className="text-2xl font-bold text-white">Joy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* Links de Navegação */}
        <nav className="flex-1 pt-8 px-2">
          <ul className="space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.li 
                  key={item.name}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                >
                  <Link 
                    href={item.href}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : 'px-4'
                    } py-3 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } transition-colors rounded-lg ${
                      collapsed ? 'mx-1' : 'mx-1'
                    } hover:shadow-md`}
                  >
                    <item.icon className={`h-6 w-6 ${!collapsed && 'mr-3'} ${isActive ? 'text-blue-200' : ''}`} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span 
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Botão Toggle Sidebar - Na parte inferior */}
        <div className="p-3 border-t border-gray-700 flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 h-16 flex items-center px-6 shadow-md">
        </header>
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6 bg-gray-900"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}
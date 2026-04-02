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
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";
import Logo, { LogoIcon } from "./Logo";

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, description: 'Visão geral' },
  { name: 'Clientes', href: '/customers', icon: UserGroupIcon, description: 'Gerenciar clientes' },
  { name: 'Compras a Crédito', href: '/credit-purchases', icon: CreditCardIcon, description: 'Contas a receber' },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon, description: 'Análises e PDFs' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-gray-800/90 backdrop-blur-sm text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg border border-gray-700/50 transition-all"
        aria-label="Abrir menu"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? '5rem' : '17rem' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          hidden lg:flex flex-col z-30 relative
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950
          border-r border-gray-800/80
          shadow-2xl shadow-black/20
        `}
      >
        {/* Logo */}
        <div className={`h-[4.5rem] flex items-center ${collapsed ? 'justify-center' : 'px-5'} border-b border-gray-800/60`}>
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.div
                key="collapsed"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <LogoIcon className="w-9 h-9" />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Logo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section label */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 pt-6 pb-2"
          >
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Menu</span>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? 'pt-6' : 'pt-1'} px-3`} role="navigation" aria-label="Menu principal">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.name : undefined}
                    className={`
                      group relative flex items-center gap-3 rounded-xl transition-all duration-200
                      ${collapsed ? 'justify-center p-3 mx-1' : 'px-4 py-3'}
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-300 rounded-r-full -ml-3"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-200' : 'text-gray-500 group-hover:text-gray-300'}`} />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col overflow-hidden"
                        >
                          <span className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-white' : ''}`}>
                            {item.name}
                          </span>
                          {!isActive && (
                            <span className="text-[11px] text-gray-600 whitespace-nowrap">
                              {item.description}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-gray-700 z-50">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-700" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-gray-800/60">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center gap-3 p-2.5 rounded-xl
              text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
              ${collapsed ? 'justify-center' : 'px-4'}
            `}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Recolher</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-[17rem] z-30 lg:hidden flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800/80 shadow-2xl"
          >
            {/* Mobile header */}
            <div className="h-[4.5rem] flex items-center justify-between px-5 border-b border-gray-800/60">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Fechar menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pt-6 pb-2">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Menu</span>
            </div>

            <nav className="flex-1 pt-1 px-3" role="navigation" aria-label="Menu principal">
              <ul className="space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`
                          group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-600/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-300 rounded-r-full -ml-3" />
                        )}
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-200' : 'text-gray-500'}`} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.name}</span>
                          {!isActive && (
                            <span className="text-[11px] text-gray-600">{item.description}</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.main
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-950"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}

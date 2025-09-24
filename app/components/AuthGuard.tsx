"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AuthGuard = () => {
  const pathname = usePathname();

  useEffect(() => {
    const loginURL = "https://studio--studio-5593614148-ea971.us-central1.hosted.app/";
    const loginPath = '/';

    // Se estivermos na página de login, não fazemos nada.
    if (pathname === loginPath) {
      return;
    }

    const referrer = document.referrer;
    const loginOrigin = new URL(loginURL).origin;
    const currentOrigin = window.location.origin;

    // Se houver um referenciador, verificamos se é do mesmo domínio ou do domínio de login.
    if (referrer) {
        try {
            const referrerOrigin = new URL(referrer).origin;
            if (referrerOrigin === currentOrigin || referrerOrigin === loginOrigin) {
                // Permite a navegação se for do mesmo app ou vindo do login.
                return;
            }
        } catch (e) {
            // Se o referenciador for inválido, redireciona para o login por segurança.
            window.location.href = loginURL;
            return;
        }
    }
    
    // Se não houver referenciador válido ou se veio de um site externo, redireciona para o login.
    window.location.href = loginURL;

  }, [pathname]);

  return null; // Este componente não renderiza nada.
};

export default AuthGuard;

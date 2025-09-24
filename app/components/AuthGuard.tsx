"use client";

import { useEffect } from 'react';

const AuthGuard = () => {
  useEffect(() => {
    const loginURL = "https://studio--studio-5593614148-ea971.us-central1.hosted.app/";
    
    // Se não houver referenciador, é um acesso direto, então redireciona para o login.
    if (!document.referrer) {
        window.location.href = loginURL;
        return;
    }

    try {
        const referrerOrigin = new URL(document.referrer).origin;
        const currentOrigin = window.location.origin;

        // Se o referenciador for de uma origem diferente E não for a página de login, redireciona.
        if (referrerOrigin !== currentOrigin && new URL(loginURL).origin !== referrerOrigin) {
            window.location.href = loginURL;
        }
    } catch (e) {
        // Referenciador inválido ou vazio, redireciona para o login como medida de segurança.
        window.location.href = loginURL;
    }

  }, []);

  return null; // Este componente não renderiza nada.
};

export default AuthGuard;

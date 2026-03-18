import { useState, useEffect } from 'react';

// Declaração de tipo para compatibilidade com navegadores que suportam PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export function usePWAInstall() {
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    isInstalling: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Verificar se o app já está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setState((prev) => ({ ...prev, isInstalled: true }));
        return true;
      }
      return false;
    };

    // Verificar imediatamente
    checkIfInstalled();

    // Capturar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      console.log('[PWA] beforeinstallprompt event captured');
      setState((prev) => ({
        ...prev,
        canInstall: true,
        deferredPrompt: promptEvent,
      }));
    };

    // Monitorar mudança de display mode (quando instalado)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log('[PWA] App instalado detectado');
        setState((prev) => ({
          ...prev,
          isInstalled: true,
          canInstall: false,
        }));
      }
    };

    // Capturar evento de sucesso de instalação
    const handleAppInstalled = () => {
      console.log('[PWA] App instalado com sucesso');
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        isInstalling: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const triggerInstall = async () => {
    if (!state.deferredPrompt) {
      console.warn('[PWA] No install prompt available');
      return;
    }

    setState((prev) => ({ ...prev, isInstalling: true }));

    try {
      // Mostrar o prompt de instalação nativo do navegador
      state.deferredPrompt.prompt();

      // Aguardar resposta do usuário
      const { outcome } = await state.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[PWA] Usuário aceitou a instalação');
      } else {
        console.log('[PWA] Usuário recusou a instalação');
      }

      setState((prev) => ({
        ...prev,
        deferredPrompt: null,
        isInstalling: false,
      }));
    } catch (error) {
      console.error('[PWA] Erro ao disparar instalação:', error);
      setState((prev) => ({ ...prev, isInstalling: false }));
    }
  };

  return {
    canInstall: state.canInstall,
    isInstalled: state.isInstalled,
    isInstalling: state.isInstalling,
    triggerInstall,
  };
}

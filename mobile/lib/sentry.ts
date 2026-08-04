/**
 * Sentry — inicialización opcional.
 * Activo solo cuando EXPO_PUBLIC_SENTRY_DSN está definido.
 * Si el paquete no está instalado, o el DSN está vacío, las funciones son no-op.
 *
 * Para habilitar:
 *   1. npm install @sentry/react-native
 *   2. npx expo install sentry-expo   (agrega el plugin a app.json)
 *   3. Definir EXPO_PUBLIC_SENTRY_DSN en eas.json y en .env.local
 */

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SentryModule = { init: (opts: Record<string, unknown>) => void; captureException: (e: unknown) => void };

let _sentry: SentryModule | null = null;

if (DSN) {
  try {
    // Dynamic require so TypeScript doesn't error if the package isn't installed.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _sentry = require('@sentry/react-native') as SentryModule;
    _sentry!.init({
      dsn: DSN,
      tracesSampleRate: 0.2,
      environment: process.env.NODE_ENV ?? 'production',
      // Reduce noise in development
      enabled: process.env.NODE_ENV !== 'development',
    });
  } catch {
    // Package not installed — silently skip
  }
}

/** Captura una excepción en Sentry (no-op si no está configurado). */
export function captureException(error: unknown): void {
  _sentry?.captureException(error);
}

/** Verdadero si Sentry está activo en este entorno. */
export const isSentryEnabled = Boolean(_sentry);

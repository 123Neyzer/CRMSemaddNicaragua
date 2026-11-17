import { useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M8 29.5 18.2 10h5.5L13.5 29.5H8Z" fill="currentColor" />
        <path d="M19.8 29.5 30 10h5.5L25.3 29.5h-5.5Z" fill="currentColor" opacity=".58" />
        <path d="M16.1 22.4h10.3l-2.5 4.8H13.6l2.5-4.8Z" fill="#C8E6D7" />
      </svg>
    </span>
  )
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.9 5.3A10.7 10.7 0 0 1 12 5c5.2 0 8.7 5.2 9.5 6.5a.9.9 0 0 1 0 1c-.4.7-1.4 2.1-2.9 3.5M6.2 6.3C4.3 7.6 3 9.5 2.5 11.5a1.2 1.2 0 0 0 0 1c.8 1.3 4.3 6.5 9.5 6.5 1 0 2-.2 2.9-.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function LoginForm({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.')
      }
      if (!result.token || !result.user) {
        throw new Error('La respuesta del servidor no contiene una sesión válida.')
      }

      onAuthenticated(result)
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con el servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-intro">
        <span className="eyebrow">ACCESO A TU ESPACIO</span>
        <h1>Qué bueno verte.</h1>
        <p>Inicia sesión para continuar con tu equipo.</p>
      </div>

      <div className="field-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="nombre@empresa.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="field-group">
        <div className="field-label-row">
          <label htmlFor="password">Contraseña</label>
        </div>
        <div className="password-wrap">
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Escribe tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="visibility-toggle"
            type="button"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          <span className="error-symbol" aria-hidden="true">!</span>
          {error}
        </p>
      )}

      <button className="submit-button" type="submit" disabled={isSubmitting || !email.trim() || !password}>
        {isSubmitting ? (
          <>
            <span className="button-spinner" aria-hidden="true" />
            Validando acceso...
          </>
        ) : (
          <>
            Iniciar sesión
            <span className="button-arrow" aria-hidden="true">→</span>
          </>
        )}
      </button>

      <p className="form-footnote">¿Necesitas acceso? Contacta al administrador de tu empresa.</p>
    </form>
  )
}

function AuthenticatedView({ session, onSignOut }) {
  const displayName = session.user.name || session.user.email
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <section className="success-panel" aria-live="polite">
      <span className="success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="eyebrow">SESIÓN ACTIVA</span>
      <h1>Bienvenido{session.user.name ? `, ${session.user.name}` : ''}.</h1>
      <p>Tu acceso a Semadd CRM está listo.</p>
      <div className="account-card">
        <span className="account-avatar" aria-hidden="true">{initials || 'U'}</span>
        <span className="account-info">
          <strong>{displayName}</strong>
          <span>{session.user.role || 'Usuario'}</span>
        </span>
        <span className="online-indicator" aria-label="En línea" />
      </div>
      <button className="submit-button signout-button" type="button" onClick={onSignOut}>
        Cerrar sesión
        <span className="button-arrow" aria-hidden="true">→</span>
      </button>
    </section>
  )
}

export default function App() {
  const [session, setSession] = useState(null)

  return (
    <main className="app-shell">
      <section className="brand-panel" aria-label="Semadd CRM">
        <header className="brand-header">
          <BrandMark />
          <span className="brand-name">semadd<span>crm</span></span>
        </header>

        <div className="brand-copy">
          <span className="brand-kicker"><span className="kicker-line" /> GESTIÓN QUE CONECTA</span>
          <h2>Cada conversación<br />abre una oportunidad.</h2>
          <p>Reúne a tu equipo, entiende a tus clientes y convierte cada seguimiento en una relación duradera.</p>
        </div>

        <div className="brand-footer">
          <span className="footer-dot" />
          <span>Tu equipo, en sintonía.</span>
          <span className="footer-divider" />
          <span>Nicaragua</span>
        </div>
        <span className="panel-index" aria-hidden="true">01 — 02</span>
      </section>

      <section className="form-panel">
        <div className="mobile-brand">
          <BrandMark />
          <span className="brand-name">semadd<span>crm</span></span>
        </div>
        <div className="form-content">
          {session ? (
            <AuthenticatedView session={session} onSignOut={() => setSession(null)} />
          ) : (
            <LoginForm onAuthenticated={setSession} />
          )}
        </div>
        <footer className="legal-footer">
          <span>© {new Date().getFullYear()} Semadd CRM</span>
          <span className="legal-separator">•</span>
          <span>Acceso seguro para tu organización</span>
        </footer>
      </section>
    </main>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FileProvider } from './lib/FileContext.tsx'
import { AuthProvider } from './lib/AuthContext.tsx'
import { ThemeProvider } from './lib/ThemeContext.tsx'
import { ToastProvider } from './lib/ToastContext.tsx'
import { I18nProvider } from './lib/I18nContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <FileProvider>
              <App />
            </FileProvider>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)

import './styles/index.css'
import './styles/addon.css'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'

// Разворачиваем приложение на весь экран в Telegram
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
}

createRoot(document.getElementById('root')).render(
    <App />,
)

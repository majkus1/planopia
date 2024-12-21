import React from 'react'
import ReactDOM from 'react-dom/client' // Zmiana importu
import App from './App'
import { HelmetProvider } from 'react-helmet-async'

// Nowy sposób renderowania korzenia aplikacji w React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<HelmetProvider>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</HelmetProvider>
)

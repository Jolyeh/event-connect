import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		proxy: {
			// En local, on redirige vers le backend
			'/api': {
				target: 'https://test-jolyeh.netiify.cloud',
				changeOrigin: true,
				secure: true,
			}
		}
	}
});
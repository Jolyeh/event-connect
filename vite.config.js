import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	preview: {
		https: {
			key: fs.readFileSync("cert.key"),
			cert: fs.readFileSync("cert.crt"),
		},
		host: "0.0.0.0",
		port: 4173,
	}
});

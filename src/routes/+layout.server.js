// src/routes/+layout.server.js
export async function load({ fetch }) {
    // SvelteKit va faire l'appel au VPS. 
    // Grâce à credentials: 'include', il va passer le cookie du VPS s'il existe.
    const response = await fetch(`${apiUrl}/auth/profile`, {
        credentials: "include"
    });

    const result = await response.json();

    return {
        // Si ton API répond status: true, l'utilisateur est connecté
        isLoggedIn: result.status,
        user: result.user || null
    };
}
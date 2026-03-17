// src/routes/+layout.server.js
export function load({ cookies }) {
    const token = cookies.get('token');
    return { isLoggedIn: !!token };
}
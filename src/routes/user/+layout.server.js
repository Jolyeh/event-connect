// src/routes/user/profile/+page.server.js
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const token = cookies.get('token');
    
    if (!token) {
        throw redirect(303, '/auth/login');
    }
}
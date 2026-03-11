import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
    const token = cookies.get('token') || cookies.get('__Host-token');

    if (!token) {
        const redirectTo = encodeURIComponent(url.pathname + url.search);
        throw redirect(303, `/auth/login?redirectTo=${redirectTo}`);
    }
}
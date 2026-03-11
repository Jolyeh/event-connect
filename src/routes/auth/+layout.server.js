import { redirect } from '@sveltejs/kit';

export function load({ cookies, url }) {
    const token = cookies.get('token') || cookies.get('__Host-token');

    if (token) {
        const redirectTo = url.searchParams.get('redirectTo') || '/user/profile';
        throw redirect(303, redirectTo);
    }
}
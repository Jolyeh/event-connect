export function load({ cookies, request }) {
    const token = cookies.get('token') || cookies.get('__Host-token');
    return { isLoggedIn: !!token };
}
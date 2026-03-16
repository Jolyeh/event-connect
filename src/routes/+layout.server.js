export function load({ cookies, request }) {
    const token = cookies.get('token');
    return { isLoggedIn: !!token };
}
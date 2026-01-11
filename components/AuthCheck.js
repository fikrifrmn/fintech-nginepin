function checkAuthOnLoad() {
    const TOKEN_KEY = 'blueflame_token';
    const LOGIN_PAGE = '/login.html';
    const BOOKING_PAGE = '/booking.html';

    const token = localStorage.getItem(TOKEN_KEY);
    const path = window.location.pathname;
    const isLoginPage =
        path === '/' ||
        path.endsWith('/index.html') ||
        path.endsWith('/login.html');

    // 🔴 Tidak ada token
    if (!token) {
        if (path.endsWith('/booking.html')) {
            window.location.replace(LOGIN_PAGE);
        }
        return;
    }

    // 🧠 Decode token
    let payload;
    try {
        payload = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.replace(LOGIN_PAGE);
        return;
    }

    // ⏰ Token expired
    if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.replace(LOGIN_PAGE);
        return;
    }

    // ✅ Sudah login tapi buka login page
    if (isLoginPage) {
        window.location.replace(BOOKING_PAGE);
    }
}

document.addEventListener('DOMContentLoaded', checkAuthOnLoad);

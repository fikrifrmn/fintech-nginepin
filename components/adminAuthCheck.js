(function () {
    const TOKEN_KEY = 'blueflame_token';
    const LOGIN_PAGE = '/login.html';
    const ADMIN_PAGE = '/admin.html';

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        window.location.replace(LOGIN_PAGE);
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.replace(LOGIN_PAGE);
            return;
        }

        if (payload.role !== 'admin') {
            alert('Akses ditolak. Admin only.');
            window.location.replace('/');
        }

    } catch {
        localStorage.removeItem(TOKEN_KEY);
        window.location.replace(LOGIN_PAGE);
    }
})();

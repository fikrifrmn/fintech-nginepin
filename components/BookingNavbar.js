function BookingNavbar() {
  const user = JSON.parse(localStorage.getItem('blueflame_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('blueflame_user');
    localStorage.removeItem('blueflame_token');
    window.location.href = 'index.html';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--dark-bg)] bg-opacity-95 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <a href="index.html" className="flex items-center space-x-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
              <img 
                src="assets/logo-app-rmv.png" 
                alt="Logo Fintech Hotel" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
          </div>
          <span className="text-2xl font-bold gradient-text">Fintech Hotel</span>
        </a>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Hi, {user.username || user.email}</span>
            <button onClick={handleLogout} className="text-sm text-[var(--accent-color)] hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <a href="login.html" className="text-sm text-[var(--accent-color)] hover:underline">Login</a>
        )}
      </div>
    </nav>
  );
}

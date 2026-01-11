function AdminSidebar({ activeView, setActiveView }) {
  try {
    const menuItems = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'bookings', icon: 'calendar', label: 'Bookings' },
      { id: 'rooms', icon: 'bed-double', label: 'Rooms' }
    ];

    const handleLogout = () => {
      localStorage.removeItem('blueflame_user');
      window.location.href = 'index.html';
    };

    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--primary-color)] backdrop-blur-lg">
        <div className="p-6">
          <a href="index.html" className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 shadow-md rounded-lg flex items-center justify-center">
              <img 
                src="assets/logo-app-rmv.png" 
                alt="Logo Fintech Hotel" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <span className="text-xl font-bold gradient-text">Nginep.in</span>
          </a>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-gray-400 hover:bg-[var(--primary-color)] hover:bg-opacity-20'
                }`}
              >
                <div className={`icon-${item.icon} text-xl`}></div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <div className="icon-log-out text-xl"></div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminSidebar error:', error);
    return null;
  }
}
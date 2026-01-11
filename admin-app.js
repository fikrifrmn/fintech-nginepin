console.log('📄 admin-app.js loaded');
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center p-12">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Terjadi Kesalahan</h1>
                        <p className="text-gray-400 mb-4">Silakan refresh halaman</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="glow-button"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function AdminDashboard() {
    const [activeView, setActiveView] = React.useState('dashboard');
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        console.log('🔐 Checking admin authentication...');
        
        const token = localStorage.getItem('blueflame_token');
        const userJson = localStorage.getItem('blueflame_user');
        
        // Check token
        if (!token) {
            console.log('❌ No token found, redirecting to login');
            window.location.href = 'login.html';
            return;
        }

        // Parse user data
        let user;
        try {
            user = JSON.parse(userJson);
            console.log('✓ User data parsed:', user);
        } catch (e) {
            console.error('❌ Failed to parse user JSON:', e);
            localStorage.removeItem('blueflame_token');
            localStorage.removeItem('blueflame_user');
            window.location.href = 'login.html';
            return;
        }

        // Check admin role
        if (!user || user.role !== 'admin') {
            console.log('❌ User is not admin, role:', user?.role);
            localStorage.removeItem('blueflame_token');
            localStorage.removeItem('blueflame_user');
            window.location.href = 'login.html';
            return;
        }

        console.log('✓ Admin authentication successful');
        setIsAdmin(true);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-medium">Memuat Dashboard...</p>
                </div>
            </div>
        );
    }
    
    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-12">
                    <h1 className="text-2xl font-bold text-red-500">Akses Ditolak</h1>
                    <p className="text-gray-400 mt-2">Anda tidak memiliki izin mengakses halaman ini</p>
                </div>
            </div>
        );
    }

    console.log('✓ Rendering AdminDashboard component');

    return (
        <div className="flex min-h-screen" data-name="admin-dashboard">
            <AdminSidebar activeView={activeView} setActiveView={setActiveView} /> 
            
            <div className="flex-1 p-8 ml-64">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Kelola booking dan analitik hotel</p>
                </div>

                {activeView === 'dashboard' && (
                    <>
                        <AdminStats /> 
                        <AdminChart /> 
                    </>
                )}
                
                {activeView === 'bookings' && <AdminBookings />}
                {activeView === 'rooms' && <AdminRooms />}
            </div>
        </div>
    );
}

// ✅ CRITICAL: Render component ke DOM
console.log('🚀 Rendering AdminDashboard to root...');

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <ErrorBoundary>
            <AdminDashboard />
        </ErrorBoundary>
    );
    console.log('✓ AdminDashboard rendered');
} else {
    console.error('❌ Root element not found!');
}
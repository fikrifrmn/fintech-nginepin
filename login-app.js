function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      setLoading(false);
      return;
    }

    // ✅ Simpan JWT token dan info user termasuk role
    localStorage.setItem('blueflame_token', data.token);
    localStorage.setItem('blueflame_user', JSON.stringify({
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      role: data.user.role
    }));

    // 🔹 Redirect berdasarkan role
    if (data.user.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'booking.html';
    }

  } catch (error) {
    console.error('Login error:', error);
    alert('Server error, please try again later');
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] via-[var(--dark-bg)] to-[var(--secondary-color)] opacity-80"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="index.html" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src="assets/logo-app-rmv.png" 
                alt="Logo Fintech Hotel" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <span className="text-2xl font-bold gradient-text">Nginep.In</span>
          </a>
          <h1 className="text-4xl font-bold mb-2">Welcome Back 🔥</h1>
          <p className="text-gray-400">Back again? Let's roll.</p>
        </div>

        <div className="bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--primary-color)] rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full glow-button">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center">
              <a href="#" className="text-[var(--accent-color)] text-sm hover:underline">Forgot Password?</a>
            </div>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          <div className="space-y-3">
            <button onClick={() => handleSocialLogin('Google')} className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center space-x-2">
              <div className="icon-chrome text-xl"></div>
              <span>Continue with Google</span>
            </button>
            <button onClick={() => handleSocialLogin('Apple')} className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center space-x-2">
              <div className="icon-apple text-xl"></div>
              <span>Continue with Apple</span>
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account? <a href="register.html" className="text-[var(--accent-color)] font-medium hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginPage />);
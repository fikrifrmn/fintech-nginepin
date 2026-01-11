function RegisterPage() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    subscribe: true
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://fintech-nginepin-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        // Simpan data user ke localStorage
        localStorage.setItem('blueflame_user', JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          loggedIn: true
        }));
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary-color)] via-[var(--dark-bg)] to-[var(--primary-color)] opacity-80"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="index.html" className="inline-flex items-center space-x-2 mb-6">
            <span className="text-2xl font-bold gradient-text">Nginep.In</span>
          </a>
          <h1 className="text-4xl font-bold mb-2">Let's Get You Checked In ✨</h1>
          <p className="text-gray-400">Your stay starts here.</p>
        </div>

        <div className="bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--primary-color)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="John.doe2"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="6"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-field"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[var(--primary-color)]"
              />
              <span className="text-sm text-gray-300">Subscribe to our travel deals</span>
            </label>

            <button type="submit" disabled={loading} className="w-full glow-button">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <a href="login.html" className="text-[var(--accent-color)] font-medium hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RegisterPage />);
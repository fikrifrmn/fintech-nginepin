function Footer() {
  try {
    const [email, setEmail] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Thanks for subscribing! We'll send updates to ${email}`);
      setEmail('');
    };

    return (
      <footer 
        id="contact"
        className="bg-[rgba(15,82,186,0.05)] border-t border-[var(--primary-color)] py-12 px-6"
        data-name="footer" 
        data-file="components/Footer.js"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">BlueFlame Stay</h3>
              <p className="text-gray-400 mb-2">123 Neon Boulevard</p>
              <p className="text-gray-400 mb-2">Downtown District, Metro City</p>
              <p className="text-gray-400">contact@blueflame.stay</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Follow the Vibe</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="icon-music text-xl"></div>
                </a>
                <a href="#" className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="icon-instagram text-xl"></div>
                </a>
                <a href="#" className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="icon-twitter text-xl"></div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--primary-color)] focus:outline-none focus:border-[var(--accent-color)]"
                />
                <button type="submit" className="glow-button px-6 py-2">
                  Go
                </button>
              </form>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm border-t border-[var(--primary-color)] pt-6">
            <p>© 2025 BlueFlame Stay. All rights reserved. Stay cool, stay blue.</p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
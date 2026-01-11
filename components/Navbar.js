function Navbar() {
  try {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[var(--dark-bg)] bg-opacity-95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
        data-name="navbar" 
        data-file="components/Navbar.js">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo dan Nama */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
              <img 
                src="assets/logo-app-rmv.png" 
                alt="Logo Nginep.In" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>

            <span className="text-2xl font-bold">Nginep.In</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="hover:text-[var(--accent-color)] transition-colors">Home</button>
            <button onClick={() => scrollToSection('rooms')} className="hover:text-[var(--accent-color)] transition-colors">Rooms</button>
            <button onClick={() => scrollToSection('facilities')} className="hover:text-[var(--accent-color)] transition-colors">Facilities</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-[var(--accent-color)] transition-colors">Reviews</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[var(--accent-color)] transition-colors">Contact</button>
          </div>
          
          <button onClick={() => scrollToSection('rooms')} className="glow-button text-sm">
            Book Now
          </button>
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navbar component error:', error);
    return null;
  }
}
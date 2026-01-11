function Hero() {
  try {
    const scrollToRooms = () => {
      const element = document.getElementById('rooms');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <section 
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        data-name="hero" 
        data-file="components/Hero.js"
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-color)] via-transparent to-[var(--dark-bg)] opacity-60 z-0"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text animate-pulse">
            Stay Cool, Stay Blue.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[var(--accent-color)] font-light">
            Crash here, chill hard. Your vibes, our space.
          </p>
          <button onClick={scrollToRooms} className="glow-button text-lg">
            Book Your Vibe
          </button>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="icon-chevron-down text-3xl text-[var(--accent-color)]"></div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
function About() {
  try {
    return (
      <section 
        className="py-20 px-6 bg-gradient-to-b from-[var(--dark-bg)] to-[rgba(15,82,186,0.05)]"
        data-name="about" 
        data-file="components/About.js"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Smart Stay, No Boring Days
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
            BlueFlame Stay isn't just a place to crash—it's where digital nomads, 
            content creators, and adventure seekers come to recharge. Think cozy smart rooms, 
            lightning-fast WiFi, and spaces so Instagrammable your feed will thank you.
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            From our VR lounge to the rooftop bar with city views, every corner is designed 
            for the 'gram and built for the future. Welcome to the hotel that gets you.
          </p>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}
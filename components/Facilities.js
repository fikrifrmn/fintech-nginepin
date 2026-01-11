function Facilities() {
  try {
    const facilities = [
      { icon: 'wifi', name: 'Fast WiFi', desc: '1Gbps speed' },
      { icon: 'key', name: 'Smart Lock', desc: 'Keyless entry' },
      { icon: 'glasses', name: 'VR Lounge', desc: 'Meta Quest' },
      { icon: 'wine', name: 'Rooftop Bar', desc: 'Sky views' },
      { icon: 'briefcase', name: 'Coworking', desc: '24/7 access' }
    ];

    return (
      <section 
        id="facilities"
        className="py-20 px-6 bg-gradient-to-b from-transparent to-[rgba(63,0,255,0.05)]"
        data-name="facilities" 
        data-file="components/Facilities.js"
      >
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
            What We Got
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {facilities.map((facility, index) => (
              <div 
                key={index} 
                className="text-center p-6 card-glow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent-color)] bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <div className={`icon-${facility.icon} text-2xl text-[var(--accent-color)]`}></div>
                </div>
                <h3 className="font-semibold mb-1">{facility.name}</h3>
                <p className="text-sm text-gray-400">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Facilities component error:', error);
    return null;
  }
}
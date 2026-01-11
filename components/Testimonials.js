function Testimonials() {
  try {
    const [current, setCurrent] = React.useState(0);
    
    const testimonials = [
      {
        name: 'Alex Chen',
        role: 'Content Creator',
        image: 'https://i.pravatar.cc/150?img=33',
        text: 'The VR lounge is insane! Best hotel stay ever. 10/10 vibes.'
      },
      {
        name: 'Maya Rodriguez',
        role: 'Digital Nomad',
        image: 'https://i.pravatar.cc/150?img=47',
        text: 'WiFi is blazing fast. Got all my work done and hit the rooftop bar after. Perfect.'
      },
      {
        name: 'Jordan Kim',
        role: 'Travel Blogger',
        image: 'https://i.pravatar.cc/150?img=15',
        text: 'Every corner is Instagram gold. My followers loved it. Booking again next month!'
      }
    ];

    const next = () => setCurrent((current + 1) % testimonials.length);
    const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

    React.useEffect(() => {
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
    }, [current]);

    return (
      <section 
        id="testimonials"
        className="py-20 px-6"
        data-name="testimonials" 
        data-file="components/Testimonials.js"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
            What the Squad Says
          </h2>
          <div className="relative card-glow p-10">
            <div className="text-center">
              <img 
                src={testimonials[current].image} 
                alt={testimonials[current].name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[var(--primary-color)]"
              />
              <p className="text-xl md:text-2xl mb-6 italic text-gray-300">
                "{testimonials[current].text}"
              </p>
              <h4 className="font-bold text-lg">{testimonials[current].name}</h4>
              <p className="text-[var(--accent-color)]">{testimonials[current].role}</p>
            </div>
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <div className="icon-chevron-left text-xl"></div>
            </button>
            <button 
              onClick={next}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <div className="icon-chevron-right text-xl"></div>
            </button>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Testimonials component error:', error);
    return null;
  }
}
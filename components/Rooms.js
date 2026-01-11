function Rooms() {
  // Tetap gunakan React.useState dan React.useEffect
  const [rooms, setRooms] = React.useState([]); 
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // 2. Gunakan useEffect untuk mengambil data saat komponen dimuat
  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true); // Mulai loading
        const res = await fetch("https://fintech-nginepin-production.up.railway.app/api/rooms");
        
        if (!res.ok) {
          // Buang error jika respons HTTP tidak 200-299
          throw new Error(`Failed to fetch room data: ${res.statusText}`);
        }
        
        const data = await res.json();
        setRooms(data); // Simpan data yang diterima
        setError(null); // Bersihkan error sebelumnya
      } catch (err) {
        console.error("Fetch rooms error:", err);
        // Tetapkan pesan error yang akan ditampilkan
        setError("Gagal memuat daftar kamar. Silakan coba lagi nanti.");
      } finally {
        setLoading(false); // Selesai loading, terlepas dari sukses atau gagal
      }
    };
    
    fetchRooms();
  }, []); // Array dependensi kosong agar hanya berjalan sekali (componentDidMount)

  // 3. Tampilkan status loading atau error
  if (loading) {
    return (
      <section id="rooms" className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12">Pick Your Vibe</h2>
          <p className="text-xl text-[var(--accent-color)]">Loading data kamar...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12">Pick Your Vibe</h2>
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }
  
  // 4. Pastikan rooms ada data sebelum merender
  if (rooms.length === 0) {
     return (
      <section id="rooms" className="py-20 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12">Pick Your Vibe</h2>
          <p className="text-xl text-gray-400">Belum ada kamar yang tersedia saat ini.</p>
        </div>
      </section>
    );
  }


  // 5. Render daftar kamar menggunakan data dari state (yang diisi dari API)
  return (
    <section 
      id="rooms"
      className="py-20 px-6"
      data-name="rooms" 
      data-file="components/Rooms.js"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text">
          Pick Your Vibe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {rooms.map((room, index) => (
            <div key={room.id || index} className="card-glow">
              <div 
                className="h-48 rounded-xl mb-4 bg-cover bg-center"
                // Asumsi properti image di objek room dari database sesuai dengan URL gambar
                style={{ backgroundImage: `url(${room.image})` }}
              ></div>
              <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
              <p className="text-3xl font-bold text-[var(--accent-color)] mb-4">
                {/* Asumsi properti price adalah angka atau string yang dapat ditampilkan */}
                {room.price ? `IDR ${room.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                <span className="text-sm text-gray-400">/night</span>
              </p>
              <ul className="space-y-2 mb-6">
                {/* Asumsi properti features adalah array of string. 
                   Jika di database fitur disimpan sebagai string koma (ex: "WiFi,Mini Bar"), 
                   Anda mungkin perlu memisahkannya: {room.features.split(',').map...} 
                   Saya anggap room.features sudah berupa array.
                */}
                {Array.isArray(room.features) && room.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <div className="icon-check text-sm text-[var(--accent-color)]"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="login.html"><button className="w-full glow-button">View Details</button></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Rooms; // Jangan lupa export komponen
// =========================
// FORMAT RUPIAH
// =========================
const formatRupiah = (number) => {
  if (!number) return 'IDR 0';
  const num = Number(number);
  if (isNaN(num)) return 'IDR 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num).replace('Rp', 'IDR');
};

// =========================
// BOOKING PAGE
// =========================
function BookingPage() {

  // STATE
  const [rooms, setRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState(1);
  const [user, setUser] = React.useState(null);

  // HITUNG MALAM
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  // HITUNG TOTAL
  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    return selectedRoom.price * calculateNights();
  };

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ======================
  // BOOK NOW
  // ======================
  const handleBookNow = async () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      alert("Please select room & dates");
      return;
    }

    const token = localStorage.getItem("blueflame_token");
    const userData = JSON.parse(localStorage.getItem("blueflame_user"));

    const payload = {
      user_id: userData.id,
      room_id: selectedRoom.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: calculateTotal(),
      guests: guests
    };

    const res = await fetch("https://fintech-nginepin-production.up.railway.app/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Gagal membuat booking");
      return;
    }

    // SIMPAN DATA BOOKING UNTUK PAYMENT PAGE
    localStorage.setItem("blueflame_booking", JSON.stringify({
      id: data.booking_id,
      roomName: selectedRoom.name,
      checkIn,
      checkOut,
      guests,
      total: calculateTotal(),
      customerName: userData.username,
      email: userData.email,
      phone: userData.phone
    }));

    window.location.href = "payment.html";
  };

  // ======================
  // VERIFY USER
  // ======================
  React.useEffect(() => {
  setLoading(true);

  fetch("https://fintech-nginepin-production.up.railway.app/api/rooms")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load rooms");
      return res.json();
    })
    .then(data => {
      setRooms(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("ERROR FETCH ROOMS:", err);
      setError("Gagal memuat data kamar.");
      setLoading(false);
    });
  }, []);

 
  // === Loading / Error ===
  if (loading) return <p className="text-center text-gray-400">Loading rooms...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen pt-20">
      <BookingNavbar user={user || { username: 'Guest' }} onLogout={handleLogout} />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Find Your Room, Feel the Vibe</h1>
          <p className="text-xl text-gray-400">Pick your vibe.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <div className="card-glow">
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input-field">
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.map(room => (
                  <div key={room.id} className={`card-glow cursor-pointer ${selectedRoom?.id === room.id ? 'border-[var(--accent-color)] shadow-[0_0_30px_rgba(137,207,240,0.4)]' : ''}`} onClick={() => setSelectedRoom(room)}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-48 h-32 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${room.image})` }}></div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                        <p className="text-2xl font-bold text-[var(--accent-color)] mb-2">
                          {formatRupiah(room.price)}<span className="text-sm text-gray-400">/night</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(room.features) && room.features.map((f, i) => (
                            <span key={i} className="text-xs bg-[var(--primary-color)] bg-opacity-30 px-3 py-1 rounded-full">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {selectedRoom?.id === room.id && <div className="icon-check-circle text-3xl text-[var(--accent-color)]"></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="card-glow h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Check-in:</span><span>{checkIn || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Check-out:</span><span>{checkOut || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Nights:</span><span>{calculateNights()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Guests:</span><span>{guests}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Room:</span><span>{selectedRoom?.name || '—'}</span></div>
              <div className="border-t border-gray-600 pt-3 mt-3"></div>
              <div className="flex justify-between text-xl font-bold"><span>Total:</span><span className="text-[var(--accent-color)]">
                {formatRupiah(calculateTotal())} </span>
              </div>
            </div>
            <button onClick={handleBookNow} disabled={!selectedRoom || !checkIn || !checkOut} className="w-full glow-button mt-6">Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BookingPage />);

const formatRupiah = (number) => {
  if (number === undefined || number === null) return 'IDR 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number).replace('Rp', 'IDR');
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Mengatasi format tanggal dari MySQL jika perlu
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
};

function DetailPage() {
  const [booking, setBooking] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    // 1. Ambil ID dari URL
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('bookingId');
    const token = localStorage.getItem("blueflame_token");

    // Jika tidak ada ID di URL, lempar balik ke home
    if (!bookingId) {
        alert("ID Booking tidak ditemukan");
        window.location.href = "index.html";
        return;
    }

    const fetchBooking = async () => {
        try {
            // Mengambil data REAL dari Backend
            const response = await fetch(`https://fintech-nginepin-production.up.railway.app/api/bookings/${bookingId}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Wajib ada jika route diproteksi
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal mengambil data booking");
            }

            // 2. Simpan Data Asli ke State
            setBooking(data); 
            
            // 3. Hitung status berdasarkan tanggal asli
            calculateStatus(data.checkIn, data.checkOut);

        } catch (error) {
            console.error("Error fetching booking:", error);
            alert("Terjadi kesalahan: " + error.message);
            // Opsional: Redirect jika error fatal
            // window.location.href = "index.html"; 
        } finally {
            setLoading(false);
        }
    };

    fetchBooking();
  }, []);

  // Logic Status Check-in/out (Tidak berubah)
  const calculateStatus = (checkIn, checkOut) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (today < inDate) {
        setStatus({ label: "UPCOMING", color: "bg-blue-500", desc: "Menunggu tanggal Check-in" });
    } else if (today >= inDate && today < outDate) {
        setStatus({ label: "CHECKED IN", color: "bg-green-500", desc: "Saat ini Anda sedang menginap" });
    } else {
        setStatus({ label: "CHECKED OUT", color: "bg-gray-500", desc: "Masa inap telah selesai" });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-500 rounded-full mb-4"></div>
            <p>Memuat detail pesanan...</p>
        </div>
    </div>
  );

  if (!booking) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      
      {/* Header / Nav Back */}
      <div className="max-w-3xl mx-auto mb-8">
        <button onClick={() => window.location.href = 'index.html'} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
           ← Kembali ke Beranda
        </button>
        <h1 className="text-4xl font-bold gradient-text">Detail Pemesanan</h1>
      </div>

      <div className="max-w-3xl mx-auto card-glow p-8 relative overflow-hidden">
        
        {/* Status Badge Absolute */}
        <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-xl text-white font-bold text-sm tracking-wider ${status?.color || 'bg-gray-700'}`}>
            {status?.label}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
            {/* Left: Info Utama */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <p className="text-gray-400 text-sm mb-1">Nama Ruangan</p>
                    {/* Mengambil nama ruangan ASLI dari database */}
                    <h2 className="text-2xl font-bold text-white">{booking.roomName}</h2>
                    <p className="text-green-400 text-sm mt-1 capitalize">● Status Pembayaran: {booking.status}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-xs uppercase mb-1">Check-In</p>
                        {/* Tanggal check-in ASLI */}
                        <p className="font-semibold text-lg">{formatDate(booking.checkIn)}</p>
                        <p className="text-sm text-gray-500">Dari jam 14:00</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-xs uppercase mb-1">Check-Out</p>
                        {/* Tanggal check-out ASLI */}
                        <p className="font-semibold text-lg">{formatDate(booking.checkOut)}</p>
                        <p className="text-sm text-gray-500">Sebelum jam 12:00</p>
                    </div>
                </div>

                <div>
                    <p className="text-gray-400 text-sm mb-2">Info Status</p>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 flex items-center gap-3">
                        <span className="text-2xl">ℹ️</span>
                        {status?.desc}
                    </div>
                </div>
            </div>

            {/* Right: Summary Harga & ID */}
            <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-400 text-xs uppercase">Order ID</p>
                        <p className="font-mono text-sm text-gray-300 break-all">{booking.order_id || booking.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase">Tamu</p>
                        <p className="text-white">{booking.guests} Orang</p>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-gray-400 text-xs uppercase mb-1">Total Dibayar</p>
                    <p className="text-2xl font-bold text-[var(--accent-color, #60a5fa)]">
                        {formatRupiah(booking.total)}
                    </p>
                </div>
            </div>

        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
             <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition" onClick={() => window.print()}>
                🖨️ Cetak Bukti Booking
             </button>
        </div>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DetailPage />);
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

function PaymentPage() {
  const [booking, setBooking] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [cardData, setCardData] = React.useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  // Load booking
  React.useEffect(() => {
    const saved = localStorage.getItem("blueflame_booking");
    if (!saved) {
      window.location.href = "booking.html";
      return;
    }
    setBooking(JSON.parse(saved));
  }, []);

  // Load Snap.js
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-xxxxxxxxxxxxxxxx");
    script.onload = () => console.log("Snap loaded");
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleInputChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    if (!booking) return;

    setProcessing(true);
    const orderId = `BOOK-${booking.id}-${Date.now()}`;
    const token = localStorage.getItem("blueflame_token");

    try {
      // Generate Snap token
      const response = await fetch("https://fintech-nginepin-production.up.railway.app/api/create-snap-token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: booking.total,
          order_id: orderId,
          booking
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Gagal generate Snap Token");

      // Open Snap popup
      window.snap.pay(data.snap_token, {
        onSuccess: async (result) => {
          // ✅ PERBAIKAN: Tambah try-catch dan error handling
          try {
            console.log("💳 Payment success from Midtrans:", result);
            
            const response = await fetch(`https://fintech-nginepin-production.up.railway.app/api/bookings/${booking.id}/confirm-payment`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ 
                status: "paid", 
                order_id: result.order_id,
                payment_method: result.payment_type || 'credit_card',
                amount_paid: booking.total
              })
            });

            const confirmData = await response.json();
            
            if (!response.ok) {
              console.error("❌ Payment confirmation failed:", confirmData);
              throw new Error(confirmData.error || "Failed to confirm payment");
            }

            console.log("✅ Payment confirmed:", confirmData);
            localStorage.removeItem("blueflame_booking");
            setShowSuccess(true);
            setProcessing(false);
          } catch (err) {
            console.error("❌ Error confirming payment:", err);
            alert("Payment success but confirmation failed: " + err.message);
            setProcessing(false);
          }
        },
        onPending: (result) => {
          console.log("⏳ Payment pending:", result);
          alert("Pembayaran menunggu konfirmasi");
          setProcessing(false);
        },
        onError: (error) => {
          console.error("❌ Payment error:", error);
          alert("Pembayaran gagal: " + (error.message || "Unknown error"));
          setProcessing(false);
        },
        onClose: () => {
          console.log("❌ Payment popup closed");
          setProcessing(false);
        }
      });

    } catch (err) {
      console.error("❌ Snap token error:", err);
      alert(err.message);
      setProcessing(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-900">
      <BookingNavbar />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Complete Your Payment</h1>
          <p className="text-xl text-gray-400">Pilih metode pembayaran favoritmu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Booking Summary */}
          <div className="card-glow p-8">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between"><span className="text-gray-400">Room</span><span>{booking.roomName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Check-in</span><span>{booking.checkIn}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Check-out</span><span>{booking.checkOut}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Guests</span><span>{booking.guests}</span></div>
              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-[var(--accent-color)]">{formatRupiah(booking.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="card-glow p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center">Pay Securely with Midtrans</h2>
            <p className="text-center text-gray-400 mb-8">
              QRIS • GoPay • ShopeePay • Kartu Kredit • Transfer Bank
            </p>
            <button onClick={handlePay} disabled={processing} className="w-full glow-button">
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Popup Success */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-6">
          <div className="card-glow max-w-md w-full text-center p-12 animate-pulse">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="icon-check text-4xl text-white">✓</div>
            </div>
            <h2 className="text-4xl font-bold mb-4">🔥 You're Booked!</h2>
            <p className="text-xl text-gray-300 mb-8">Get ready for your BlueFlame Stay.</p>
            <p className="text-sm text-gray-400 mb-6">You're locked in. See you soon 👋💙</p>
            <button 
              onClick={() => {
                // Arahkan ke file detail.html dengan membawa parameter id booking
                // Pastikan booking.id tersedia
                window.location.href = `detail.html?bookingId=${booking.id}`; 
              }} className="glow-button">
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PaymentPage />);
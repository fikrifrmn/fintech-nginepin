const { useState, useEffect } = React;

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  function formatDateTime(d) {
    if (!d) return "-";
    const date = new Date(d);
    return date.toISOString().replace("T", " / ").slice(0, 19);
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-500 bg-opacity-20 text-yellow-400";
      case "paid":
        return "bg-green-500 bg-opacity-20 text-green-400";
      case "cancelled":
        return "bg-red-500 bg-opacity-20 text-red-400";
      default:
        return "bg-gray-500 bg-opacity-20 text-gray-400";
    }
  }

  useEffect(() => {
  const token = localStorage.getItem("blueflame_token");

  fetch("https://fintech-nginepin-production.up.railway.app/api/admin/bookings/preview", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Forbidden / Unauthorized");
      return res.json();
    })
    .then((result) => {
      const formattedData = result.data.map((b) => ({
        id: b.booking_id,
        guest: b.user_name,
        room: b.room_name,
        checkIn: formatDateTime(b.check_in_date),
        checkOut: formatDateTime(b.check_out_date),
        totalPrice: b.total_price,
        status: b.payment_status
      }));

      setBookings(formattedData);
    })
    .catch((err) => {
      console.error("Error fetching bookings:", err.message);
    });
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">Booking Management</h1>
      <div className="card-glow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Guest</th>
                <th className="text-left py-3 px-4">Room</th>
                <th className="text-left py-3 px-4">Check-in</th>
                <th className="text-left py-3 px-4">Check-out</th>
                <th className="text-left py-3 px-4">Total Price</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="py-4 px-4">{b.guest}</td>
                  <td className="py-4 px-4">{b.room}</td>
                  <td className="py-4 px-4">{b.checkIn}</td>
                  <td className="py-4 px-4">{b.checkOut}</td>
                  <td className="py-4 px-4">
                    {"IDR " + Number(b.totalPrice).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

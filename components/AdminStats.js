const { useState, useEffect } = React;

function AdminStats() {
  const [totalRooms, setTotalRooms] = useState("Loading...");

  useEffect(() => {
    fetch("https://fintech-nginepin-production.up.railway.app/api/rooms/amount")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTotalRooms(data.total);
        else setTotalRooms("0");
      })
      .catch(() => setTotalRooms("0"));
  }, []);

  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: "Loading...",
    totalRevenue: "Loading...",
    activeUsers: "Loading..."
  });

  useEffect(() => {
    fetch("https://fintech-nginepin-production.up.railway.app/api/bookings/stats/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("blueflame_token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDashboardStats({
            totalBookings: data.totalBookings,
            totalRevenue: `IDR ${Number(data.totalRevenue).toLocaleString("id-ID")}`,
            activeUsers: data.activeUsers
          });
        }
      })
      .catch(err => console.error("Dashboard stats error:", err));
  }, []);



  const stats = [
  { icon: "assets/bed.png", 
    label: "Total Rooms", 
    value: totalRooms,
    change: "+12%", 
    color: "text-green-400",
    isImg: true
  },
  { icon: "assets/booking-online.png", 
    label: "Total Bookings",
    value: dashboardStats.totalBookings, 
    change: "+12%", 
    color: "text-green-400", 
    isImg: true 
  },
  { 
    icon: "assets/revenue.png", 
    label: "Revenue",
    value: dashboardStats.totalRevenue,
    change: "+12%", 
    color: "text-green-400",
    isImg: true
  },
    { icon: "assets/people.png", 
      label: "Active Users", 
      value: dashboardStats.activeUsers, 
      change: "+8%", 
      color: "text-green-400",
      isImg: true
    },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-[var(--accent-color)] bg-opacity-20 rounded-xl flex items-center justify-center">
              {stat.isImg ? (
                <img
                  src={stat.icon}
                  alt={stat.label}
                  className="w-6 h-6"
                />
              ) : (
                <div className={`icon-${stat.icon} text-2xl text-[var(--accent-color)]`}></div>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold mb-2">{stat.value}</p>
            {stat.change && (
              <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

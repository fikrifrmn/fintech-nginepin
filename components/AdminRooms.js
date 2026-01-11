function AdminRooms() {
  const [rooms, setRooms] = React.useState([]);
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    description: "",
    features: ""
  });

  const [imageFile, setImageFile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // ================= FETCH ROOMS =================
  React.useEffect(() => {
    fetchRooms();
  }, []);

  React.useEffect(() => {
  console.log("📦 ROOMS STATE UPDATED:", rooms);
  }, [rooms]);

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log("🔥 DATA DARI BACKEND:", data);
      setRooms(data);
    } catch {
      setError("Gagal memuat data kamar");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      features: ""
    });
    setImageFile(null);
    setEditingRoom(null);
  };

  // ================= ADD ROOM =================
  const handleAddRoom = async () => {
    try {
      const token = localStorage.getItem("blueflame_token");

      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", Number(formData.price.replace(/\./g, "")));
      form.append("description", formData.description);

      form.append(
        "features",
        JSON.stringify(
          formData.features
            .split(",")
            .map(f => f.trim())
            .filter(Boolean)
        )
      );

      form.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/admin/add-room", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!res.ok) throw new Error();

      alert("Room berhasil ditambahkan");
      setIsAdding(false);
      resetForm();
      fetchRooms();

    } catch {
      alert("Gagal menambah room");
    }
  };

  // ================= EDIT =================
  const handleEdit = (room) => {
    setEditingRoom(room.id);
    setFormData({
      name: room.name,
      price: room.price.toString(),
      description: "",
      features: room.features.join(", ")
    });
  };

  // ================= UPDATE =================
  const handleSave = async (roomId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price.replace(/\./g, "")),
          features: formData.features.split(",").map(f => f.trim())
        })
      });

      if (!res.ok) throw new Error();

      alert("Room berhasil diupdate");
      setEditingRoom(null);
      fetchRooms();

    } catch {
      alert("Update gagal");
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    resetForm();
  };

  // ================= UI =================
  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text">Room Management</h1>
          <button 
            onClick={() => {
              if (isAdding) {
                setIsAdding(false);
                handleCancel();
              } else {
                setIsAdding(true);
              }
            }}
            className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2
              ${isAdding 
                ? "bg-gray-600 hover:bg-gray-700" 
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            <span className="text-xl">
              {isAdding ? "×" : "+"}
            </span>
            {isAdding ? "Close" : "Add New Room"}
          </button>
        </div>
        {isAdding && (
          <div className="card-glow mb-8 border-dashed border-2 border-[var(--accent-color)] animate-pulse-slow">
            <h2 className="text-xl font-bold mb-4 text-[var(--accent-color)]">Add New Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Input Nama Kamar */}
              <input 
                type="text"
                placeholder="Room Name (e.g. Deluxe Ocean)" 
                className="px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />

              {/* Input Harga */}
              <input 
                type="text"
                placeholder="Price (e.g. 500000)" 
                className="px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
              />

              {/* Input Features */}
              <input 
                type="text"
                placeholder="Features (Wifi, AC, Bathub)" 
                className="px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })} 
              />
              {/* DESCRIPTION */}
              <textarea
                placeholder="Room Description (e.g. Spacious room with ocean view)"
                className="md:col-span-3 px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {/* IMAGE */}
              <input
                type="file"
                accept="image/*"
                className="md:col-span-3 text-white"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleAddRoom} 
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-bold"
              >
                Save Room
              </button>
              <button 
                onClick={() => { setIsAdding(false); handleCancel(); }} 
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="card-glow">

              <div
                className="h-40 rounded-xl mb-4 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${room.image})`
                }}
              ></div>
              {console.log("🖼 IMAGE URL:", room.image)}



              {editingRoom === room.id ? (
                <div className="space-y-3">

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                  />

                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                  />

                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--primary-color)] text-white"
                    rows="2"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(room.id)}
                      className="flex-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>

                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>

                  <p className="text-2xl font-bold text-[var(--accent-color)] mb-3">
                    IDR {room.price.toLocaleString("id-ID")}
                    <span className="text-sm text-gray-400">/night</span>
                  </p>

                  <div className="space-y-1 mb-4">
                    {room.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleEdit(room)}
                    className="w-full px-4 py-2 bg-[var(--primary-color)] rounded-lg"
                  >
                    Edit Room
                  </button>

                </>
              )}

            </div>
          ))}
        </div>
      </div>
    );
}

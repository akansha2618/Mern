import { useEffect, useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:5000";

function App() {
  const [canteenMenu, setCanteenMenu] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    rollNo: "",
    stream: "",
    item: "",
    qty: 1
  });

  // GET: Fetch available items
  const loadMenu = () => {
    axios
      .get(`${SERVER_URL}/food`)
      .then((res) => {
        setCanteenMenu(res.data);
        if (res.data.length > 0 && !studentDetails.item) {
          setStudentDetails((prev) => ({ ...prev, item: res.data[0].itemName }));
        }
      })
      .catch((err) => console.error("Menu loading error:", err));
  };

  // GET: Fetch orders queue
  const loadOrders = () => {
    axios
      .get(`${SERVER_URL}/orders`)
      .then((res) => setOrderList(res.data))
      .catch((err) => console.error("Orders loading error:", err));
  };

  useEffect(() => {
    loadMenu();
    loadOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prev) => ({ ...prev, [name]: value }));
  };

  // POST: Submit order
  const submitOrder = (e) => {
    e.preventDefault();

    if (!studentDetails.name.trim() || !studentDetails.rollNo.trim() || !studentDetails.stream.trim()) {
      alert("Please fill in all student details.");
      return;
    }

    const matchedItem = canteenMenu.find((food) => food.itemName === studentDetails.item);
    const itemCost = matchedItem ? matchedItem.rate : 0;

    const payload = {
      ...studentDetails,
      price: itemCost
    };

    axios
      .post(`${SERVER_URL}/orders`, payload)
      .then((res) => {
        alert(res.data.message);
        setStudentDetails({
          name: "",
          rollNo: "",
          stream: studentDetails.stream,
          item: canteenMenu[0]?.itemName || "",
          qty: 1
        });
        loadOrders();
      })
      .catch((err) => console.error("Error submitting order:", err));
  };

  return (
    <div style={{ maxWidth: "850px", margin: "25px auto", padding: "10px", fontFamily: "Segoe UI, sans-serif" }}>
      <header style={{ textAlign: "center", borderBottom: "2px solid #ea580c", paddingBottom: "10px", marginBottom: "25px" }}>
        <h1 style={{ color: "#ea580c", margin: 0 }}>Campus Bites — Canteen Portal</h1>
        <p style={{ color: "#555", marginTop: "4px" }}>Quick Pre-Order & Token Generation</p>
      </header>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        {/* Menu Section */}
        <section style={{ flex: "1 1 380px", border: "1px solid #fed7aa", borderRadius: "8px", padding: "16px", backgroundColor: "#fffbeb" }}>
          <h2 style={{ marginTop: 0, color: "#9a3412" }}>Today's Menu</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #fdba74", textAlign: "left" }}>
                <th style={{ padding: "8px" }}>Item</th>
                <th style={{ padding: "8px" }}>Category</th>
                <th style={{ padding: "8px" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {canteenMenu.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #fde68a" }}>
                  <td style={{ padding: "8px" }}>{item.itemName}</td>
                  <td style={{ padding: "8px", color: "#666" }}>{item.type}</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>₹{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Form Section */}
        <section style={{ flex: "1 1 350px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>Order Form</h2>
          <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={studentDetails.name}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={studentDetails.rollNo}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Course / Class</label>
                <input
                  type="text"
                  name="stream"
                  placeholder="e.g. B.Sc IT"
                  value={studentDetails.stream}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Select Food</label>
              <select
                name="item"
                value={studentDetails.item}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                {canteenMenu.map((food) => (
                  <option key={food._id} value={food.itemName}>
                    {food.itemName} (₹{food.rate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Quantity</label>
              <input
                type="number"
                min="1"
                max="5"
                name="qty"
                value={studentDetails.qty}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#ea580c",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Place Order
            </button>
          </form>
        </section>
      </div>

      {/* Orders Table Section */}
      <section style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
        <h2 style={{ marginTop: 0, color: "#1e293b" }}>Confirmed Order Queue</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Student Name</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Roll No</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Class</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Item</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Qty</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Total Cost</th>
              <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {orderList.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "14px" }}>
                  No pre-orders recorded.
                </td>
              </tr>
            ) : (
              orderList.map((ord) => (
                <tr key={ord._id}>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.studentName}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.rollNumber}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.course}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.foodItem}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.quantity}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1", fontWeight: "bold" }}>₹{ord.totalAmount}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{ord.orderedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
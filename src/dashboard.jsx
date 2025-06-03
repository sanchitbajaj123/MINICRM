import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignActions from "./CampaignActions";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [segmentType, setSegmentType] = useState(""); // Renamed for clarity
  const [message, setMessage] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const res = await axios.get(process.env.REACT_APP_BACK);
        console.log("🚀 Data fetched:", res.data);
        setData(res.data);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const totalOrders = data.length;
  const totalRevenue = data.reduce((sum, order) => sum + order.amount, 0);
  const uniqueCustomerIds = new Set(data.map((order) => order.customerId._id));
  const totalCustomers = uniqueCustomerIds.size;

  const getSegmentRules = () => {
    switch (segmentType) {
      case "highSpenders":
        return [{ field: "totalSpend", operator: ">", value: 10000 }];
      case "frequentBuyers":
        return [{ field: "visits", operator: ">=", value: 3 }];
      case "inactive":
        return [{ field: "inactiveDays", operator: ">", value: 60 }];
      default:
        return [];
    }
  };

  const handleSegmentChange = (e) => {
    const seg = e.target.value;
    setSegmentType(seg);
    let filtered = [];
    if (seg === "highSpenders") {
      filtered = data.filter((order) => order.customerId.totalSpend > 10000);
    } else if (seg === "frequentBuyers") {
      filtered = data.filter((order) => order.customerId.visits >= 3);
    } else if (seg === "inactive") {
      const now = new Date();
      filtered = data.filter((order) => {
        const lastOrder = new Date(order.customerId.lastOrderDate);
        const diffDays = (now - lastOrder) / (1000 * 60 * 60 * 24);
        return diffDays > 60;
      });
    }
    const unique = Array.from(
      new Map(filtered.map((order) => [order.customerId._id, order.customerId])).values()
    );
    setFilteredCustomers(unique);
  };

  const saveSegment = () => {
    if (segmentType && message && filteredCustomers.length > 0) {
      const savedSegments = JSON.parse(localStorage.getItem("savedSegments") || "[]");
      const newSegment = {
        id: Date.now(),
        name: segmentType,
        message,
        customers: filteredCustomers,
        createdAt: new Date().toISOString(),
      };
      savedSegments.push(newSegment);
      localStorage.setItem("savedSegments", JSON.stringify(savedSegments));
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Mini CRM</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{totalCustomers}</h2>
            <p>Total Customers</p>
          </div>
          <div className="stat-card">
            <h2>{totalOrders}</h2>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h2>₹{totalRevenue.toLocaleString()}</h2>
            <p>Total Revenue</p>
          </div>
        </div>
        <nav>
          <ul>
            <li><a href="/" className="active">Dashboard</a></li>
            <li><a href="/view-segments">View Segments</a></li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="campaign-section">
          <h2>Start Campaign</h2>
          <select value={segmentType} onChange={handleSegmentChange} className="segment-select">
            <option value="">Select Segment</option>
            <option value="highSpenders">High Spenders (₹10K+)</option>
            <option value="frequentBuyers">Frequent Buyers (3+ Visits)</option>
            <option value="inactive">Inactive (60+ Days)</option>
          </select>
          {segmentType && (
            <>
              <textarea
                style={{ height: "200px" }}
                className="message-box"
                placeholder="Enter your campaign message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={{overflow:"scroll"}} className="customer-preview">
                <h3>Preview: {filteredCustomers.length} customers</h3>
                <ul>
                  {filteredCustomers.map((cus) => (
                    <li key={cus._id}>
                      <strong>{cus.name}</strong> – {cus.email}
                    </li>
                  ))}
                </ul>
              </div>
              <CampaignActions
                message={message}
                setMessage={setMessage}
                customers={filteredCustomers}
                saveSegment={saveSegment}
                segmentRules={getSegmentRules()} // ✅ Now passing array of rules
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

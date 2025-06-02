import React, { useState, useEffect } from "react";

function ViewSegments() {
  const [savedSegments, setSavedSegments] = useState([]);

  useEffect(() => {
   
    const segments = JSON.parse(localStorage.getItem("savedSegments") || "[]");
    setSavedSegments(segments);
  }, []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Mini CRM</h2>
        <nav>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/view-segments" className="active">View Segments</a></li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-container">
        <h1>Saved Segments</h1>
        {savedSegments.length === 0 ? (
          <p>No segments saved yet.</p>
        ) : (
          <div className="segments-list">
            {savedSegments.map((segment) => (
              <div key={segment.id} className="segment-card">
                <h3>Segment: {segment.name}</h3>
                <p><strong>Created:</strong> {new Date(segment.createdAt).toLocaleString()}</p>
                <p><strong>Message:</strong> {segment.message}</p>
                <h4>Customers ({segment.customers.length})</h4>
                <ul>
                  {segment.customers.map((cus) => (
                    <li key={cus._id}>
                      <strong>{cus.name}</strong> – {cus.email}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewSegments;
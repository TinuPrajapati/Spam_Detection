import { useState } from "react";

export default function Spam() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const classifyMessage = async () => {
    setLoading(true);
    setResult(null);
    try {
        const response = await fetch("http://localhost:5000/api/classify", { // Ensure full URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setResult(data.category);
    } catch (error) {
        console.error("Error classifying message:", error);
        setResult("Error connecting to the API.");
    }
    setLoading(false);
};


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f4f4f4", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px", backgroundColor: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "8px", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Spam Detector</h1>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          style={{ width: "100%", height: "100px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "10px" }}
        />
        <button
          onClick={classifyMessage}
          disabled={loading}
          style={{ width: "100%", padding: "10px", backgroundColor: loading ? "#aaa" : "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {loading ? "Checking..." : "Check Message"}
        </button>
        {result && (
          <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#ddd", borderRadius: "5px", fontWeight: "bold" }}>
            Category: {result}
          </div>
        )}
      </div>
    </div>
  );
}

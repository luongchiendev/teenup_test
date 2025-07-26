import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
const { BACKEND_URL } = require('../urlConfig');

export default function ParentManager() {
  const { parents, setParents } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filteredParents, setFilteredParents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Khi parents hoặc search thay đổi, filter lại
    const result = parents.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
    );
    setFilteredParents(result);
  }, [search, parents]);

  const getListParents = async () => {
    try {
     const response = await axios.get(
      `${BACKEND_URL}/parents`,
      // {
      //   name: form.name,
      //   phone: form.phone,
      //   email: form.email,
      // },
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if(response){
      setParents(response.data);
    }
  }
  catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
}

useEffect(() => {
const callApi = async () => {
  await getListParents();
}
callApi();
}, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response = await axios.post(
      `${BACKEND_URL}/parents`,
      {
        name: form.name,
        phone: form.phone,
        email: form.email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if(response){
       setParents((prev) => [...prev, response.data]);
       setForm({ name: "", phone: "", email: "" });
    }

    } catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
        Quản lý Phụ huynh
      </h2>

      {/* Thanh tìm kiếm */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "6px 10px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          + Thêm mới
        </button>
      </div>

      {/* Danh sách Parents */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Tên</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>SĐT</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredParents.map((p) => (
            <tr key={p.id}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {p.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {p.phone}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {p.email}
              </td>
            </tr>
          ))}
          {filteredParents.length === 0 && (
            <tr>
              <td
                colSpan={3}
                style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}
              >
                Không tìm thấy phụ huynh nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form thêm mới */}
      {showForm && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "6px" }}>Thêm phụ huynh</h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <input
              name="name"
              value={form.name}
              placeholder="Tên"
              onChange={handleChange}
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              name="phone"
              value={form.phone}
              placeholder="Số điện thoại"
              onChange={handleChange}
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                style={{
                  padding: "6px",
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "6px",
                  background: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {message && <p style={{ marginTop: "8px" }}>{message}</p>}
    </div>
  );
}

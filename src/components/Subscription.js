import React, { useEffect, useState } from "react";
import axios from "axios";

const { BACKEND_URL } = require("../urlConfig");

export default function SubscriptionManager() {
  const [students, setStudents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [reset, onReset] = useState(true);
  const [form, setForm] = useState({
    studentId: "",
    package_name: "",
    total_sessions: "",
    start_date: "",
    end_date: "",
  });
  const [message, setMessage] = useState("");

  //  Lấy danh sách học viên và subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, subscriptionRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/students`),
          axios.get(`${BACKEND_URL}/subscriptions`),
        ]);
        console.log(studentRes)
        setStudents(studentRes.data);
        setSubscriptions(subscriptionRes.data);
      } catch (err) {
        console.error(" Lỗi:", err);
        setMessage("Không thể tải dữ liệu.");
      }
    };
    fetchData();
  }, [reset]);

  // ✅ Tạo gói học mới
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/subscriptions`, form);
      setMessage(" Tạo gói học thành công!");
      setSubscriptions([...subscriptions, res.data]);
      setForm({
        studentId: "",
        package_name: "",
        total_sessions: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Sử dụng 1 buổi học
  const handleUseSession = async (id) => {
    try {
      const res = await axios.patch(`${BACKEND_URL}/subscriptions/${id}/use`);
      if(res){
    onReset(!reset);
      }
      setMessage(" Đã sử dụng 1 buổi!");
      
    } catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2> Quản lý Gói Học</h2>

      {/* ✅ Form tạo gói học */}
      <form
        onSubmit={handleCreate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        <label>Chọn học viên:</label>
        <select
          name="studentId"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        >
          <option value="">-- Chọn học viên --</option>
          {console.log(students)}
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label>Tên gói học:</label>
        <input
          type="text"
          name="package_name"
          value={form.package_name}
          onChange={(e) => setForm({ ...form, package_name: e.target.value })}
          placeholder="Ví dụ: Gói Toán 10 buổi"
          required
        />

        <label>Tổng số buổi:</label>
        <input
          type="number"
          name="total_sessions"
          value={form.total_sessions}
          onChange={(e) => setForm({ ...form, total_sessions: e.target.value })}
          min="1"
          required
        />

        <label>Ngày bắt đầu:</label>
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          required
        />

        <label>Ngày kết thúc:</label>
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          required
        />

        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "#fff",
            padding: "8px",
            border: "none",
            borderRadius: "4px",
            marginTop: "6px",
          }}
        >
           Tạo Gói Học
        </button>
      </form>

      {/*  Danh sách gói học */}
      <h3>Danh sách gói học hiện tại</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Học viên</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Gói học</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Thời gian</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Đã dùng</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Còn lại</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {sub.Student?.name || "N/A"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {sub.package_name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {sub.start_date} → {sub.end_date}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {sub.used_sessions}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {sub.total_sessions - sub.used_sessions}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                <button
                  onClick={() => handleUseSession(sub.id)}
                  style={{
                    background: "#2196F3",
                    color: "#fff",
                    padding: "4px 6px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  disabled={sub.used_sessions >= sub.total_sessions}
                >
                   Dùng 1 buổi
                </button>
              </td>
            </tr>
          ))}
          {subscriptions.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "6px" }}>
                Chưa có gói học nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
const { BACKEND_URL } = require("../urlConfig");

export default function StudentManager() {
  const { students, setStudents, parents } = useContext(AppContext); 
  // parents được load sẵn từ AppContext để chọn Parent cho Student
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "male",
    current_grade: "",
    parentId: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.current_grade && s.current_grade.includes(search))
    );
    setFilteredStudents(result);
  }, [search, students]);

  const getListStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/students`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        setStudents(response.data);
      }
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const callApi = async () => {
      await getListStudents();
    };
    callApi();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/students`,
        {
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          current_grade: form.current_grade,
          parentId: form.parentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setMessage("✅ Thêm học sinh thành công!");
        setForm({
          name: "",
          dob: "",
          gender: "male",
          current_grade: "",
          parentId: "",
        });
        setShowForm(false);
        getListStudents(); // load lại danh sách
      }
    } catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
        Quản lý Học sinh
      </h2>

      {/* Thanh tìm kiếm */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc lớp..."
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

      {/* Danh sách Students */}
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
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Ngày sinh</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Giới tính</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Lớp</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Phụ huynh</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{s.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{s.dob}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{s.gender}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {s.current_grade || "-"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                {s.Parent?.name || "-"}
              </td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td
                colSpan={5}
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  textAlign: "center",
                }}
              >
                Không tìm thấy học sinh nào
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
          <h3 style={{ fontWeight: "bold", marginBottom: "6px" }}>Thêm học sinh</h3>
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
              style={{
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              style={{
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              style={{
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            <input
              name="current_grade"
              value={form.current_grade}
              placeholder="Lớp (ví dụ: Lớp 5)"
              onChange={handleChange}
              style={{
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <select
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
              required
              style={{
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="">-- Chọn phụ huynh --</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
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

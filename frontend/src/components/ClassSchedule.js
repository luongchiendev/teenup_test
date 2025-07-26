import React, { useEffect, useState } from "react";
import axios from "axios";
const { BACKEND_URL } = require("../urlConfig");

export default function ClassSchedule() {
  const [classesByDay, setClassesByDay] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [showForm, setShowForm] = useState(false); // Thêm state show form tạo lớp
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    day_of_week: "1",
    time_slot: "",
    teacher_name: "",
    max_students: 20,
  });
  const [message, setMessage] = useState("");

  // Lấy danh sách classes & students
  const fetchClasses = async () => {
    try {
      const resClasses = await axios.get(`${BACKEND_URL}/classes`);
      const grouped = {};
      resClasses.data.forEach((cls) => {
        if (!grouped[cls.day_of_week]) grouped[cls.day_of_week] = [];
        grouped[cls.day_of_week].push(cls);
      });
      setClassesByDay(grouped);
    } catch (err) {
      setMessage(" Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchClasses();
      const resStudents = await axios.get(`${BACKEND_URL}/students`);
      setStudents(resStudents.data);
    };
    fetchData();
  }, []);

  // Đăng ký lớp cho học sinh
  const handleRegister = async () => {
    if (!selectedStudent) {
      setMessage(" Vui lòng chọn học sinh.");
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/classes/${selectedClass.id}/register`, {
        classId: selectedClass.id,
        studentId: selectedStudent,
      });
      setMessage("✅ Đăng ký thành công!");
      setSelectedClass(null);
      setSelectedStudent("");
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Tạo lớp mới
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/classes`, newClass);
      setMessage(" Tạo lớp thành công!");
      setShowForm(false);
      await fetchClasses(); // Cập nhật danh sách ngay
      setNewClass({
        name: "",
        subject: "",
        day_of_week: "1",
        time_slot: "",
        teacher_name: "",
        max_students: 20,
      });
    } catch (err) {
      setMessage(" " + (err.response?.data?.message || err.message));
    }
  };

  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>
        Đăng ký lớp học cho học sinh
      </h2>

      {/*  Nút Tạo Lớp */}
      <button
        style={{
          marginBottom: "10px",
          padding: "6px 10px",
          background: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
        onClick={() => setShowForm(true)}
      >
        + Tạo lớp mới
      </button>

      {/* Bảng hiển thị lớp */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "10px" }}>
        {dayNames.map((day, index) => {
          const dayIndex = index + 1;
          const dayClasses = classesByDay[dayIndex] || [];

          return (
            <div
              key={dayIndex}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "8px",
                background: "#f9f9f9",
              }}
            >
              <h4 style={{ textAlign: "center", marginBottom: "6px" }}>{day}</h4>
              {dayClasses.length === 0 ? (
                <p style={{ fontSize: "12px", textAlign: "center" }}>Không có lớp</p>
              ) : (
                dayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    style={{
                      border: "1px solid #ddd",
                      background: "#fff",
                      padding: "6px",
                      borderRadius: "4px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {cls.name} - {cls.subject}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      {cls.time_slot} | GV: {cls.teacher_name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#777" }}>
                      Tối đa: {cls.max_students} HS
                    </div>
                    <button
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        padding: "4px 6px",
                        background: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedClass(cls)}
                    >
                      Đăng ký
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Form đăng ký học sinh */}
      {selectedClass && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#fff",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Đăng ký: {selectedClass.name} ({selectedClass.time_slot})
          </h3>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            <option value="">-- Chọn học sinh --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            style={{
              padding: "6px 10px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              marginRight: "6px",
            }}
            onClick={handleRegister}
          >
            Xác nhận
          </button>
          <button
            style={{
              padding: "6px 10px",
              background: "#ccc",
              border: "none",
              borderRadius: "4px",
            }}
            onClick={() => setSelectedClass(null)}
          >
            Hủy
          </button>
        </div>
      )}

      {/* ✅ Form tạo lớp mới */}
      {showForm && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#f9f9f9",
          }}
        >
          <h3 style={{ fontWeight: "bold", marginBottom: "6px" }}>Tạo lớp mới</h3>
          <form
            onSubmit={handleCreateClass}
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <input
              placeholder="Tên lớp"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              placeholder="Môn học"
              value={newClass.subject}
              onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <select
              value={newClass.day_of_week}
              onChange={(e) =>
                setNewClass({ ...newClass, day_of_week: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              {dayNames.map((d, i) => (
                <option key={i + 1} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>
            <input
              placeholder="Khung giờ (VD: 8h00 - 9h30)"
              value={newClass.time_slot}
              onChange={(e) =>
                setNewClass({ ...newClass, time_slot: e.target.value })
              }
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              placeholder="Tên giáo viên"
              value={newClass.teacher_name}
              onChange={(e) =>
                setNewClass({ ...newClass, teacher_name: e.target.value })
              }
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <input
              type="number"
              placeholder="Số học sinh tối đa"
              value={newClass.max_students}
              onChange={(e) =>
                setNewClass({ ...newClass, max_students: parseInt(e.target.value) })
              }
              required
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                style={{
                  padding: "6px",
                  background: "#2196F3",
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

      {message && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}

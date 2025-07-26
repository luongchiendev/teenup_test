import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Sidebar() {
  const { setSelectedMenu } = useContext(AppContext);

  const menus = [
    { key: "parents", label: "Quản lý Phụ huynh" },
    { key: "students", label: "Quản lý Học sinh" },
    { key: "classes", label: "Danh sách Lớp" },
    { key: "register", label: "Quản lý gói học" },
  ];

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#f0f0f0",
        height: "100vh",
        padding: "10px",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>Menu</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menus.map((m) => (
          <li
            key={m.key}
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "4px",
              backgroundColor: "#fff",
            }}
            onClick={() => setSelectedMenu(m.key)}
          >
            {m.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

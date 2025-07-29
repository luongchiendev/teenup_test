import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Box,
} from "@mui/material";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, subscriptionRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/students`),
          axios.get(`${BACKEND_URL}/subscriptions`),
        ]);
        setStudents(studentRes.data);
        setSubscriptions(subscriptionRes.data);
      } catch (err) {
        console.error("Lỗi:", err);
        setMessage("Không thể tải dữ liệu.");
      }
    };
    fetchData();
  }, [reset]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/subscriptions`, form);
      setMessage("Tạo gói học thành công!");
      onReset(!reset);
      setForm({
        studentId: "",
        package_name: "",
        total_sessions: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUseSession = async (id) => {
    try {
      await axios.patch(`${BACKEND_URL}/subscriptions/${id}/use`);
      onReset(!reset);
      setMessage("Đã sử dụng 1 buổi!");
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Quản lý Gói Học
      </Typography>

      <Box
        component="form"
        onSubmit={handleCreate}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <FormControl fullWidth required>
          <InputLabel>Học viên</InputLabel>
          <Select
            name="studentId"
            value={form.studentId}
            label="Học viên"
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <MenuItem value="">
              <em>-- Chọn học viên --</em>
            </MenuItem>
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Tên gói học"
          name="package_name"
          value={form.package_name}
          onChange={(e) => setForm({ ...form, package_name: e.target.value })}
          placeholder="VD: Gói Toán 10 buổi"
          required
          fullWidth
        />

        <TextField
          label="Tổng số buổi"
          name="total_sessions"
          type="number"
          value={form.total_sessions}
          onChange={(e) => setForm({ ...form, total_sessions: e.target.value })}
          inputProps={{ min: 1 }}
          required
          fullWidth
        />

        <TextField
          label="Ngày bắt đầu"
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          label="Ngày kết thúc"
          name="end_date"
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary">
          Tạo Gói Học
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Danh sách gói học hiện tại
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Học viên</TableCell>
              <TableCell>Gói học</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Đã dùng</TableCell>
              <TableCell>Còn lại</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Chưa có gói học nào
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.Student?.name || "N/A"}</TableCell>
                  <TableCell>{sub.package_name}</TableCell>
                  <TableCell>
                    {sub.start_date} → {sub.end_date}
                  </TableCell>
                  <TableCell>{sub.used_sessions}</TableCell>
                  <TableCell>{sub.total_sessions - sub.used_sessions}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      onClick={() => handleUseSession(sub.id)}
                      disabled={sub.used_sessions >= sub.total_sessions}
                    >
                      Dùng 1 buổi
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
    </Container>
  );
}

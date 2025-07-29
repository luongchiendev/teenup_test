import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const { BACKEND_URL } = require("../urlConfig");

export default function StudentManager() {
  const { students, setStudents, parents } = useContext(AppContext);

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
      const response = await axios.get(`${BACKEND_URL}/students`);
      if (response) {
        setStudents(response.data);
      }
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    getListStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/students`, form);
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
        getListStudents();
      }
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý Học sinh
      </Typography>

      {/* Tìm kiếm + Thêm mới */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          fullWidth
          size="small"
          label="Tìm theo tên hoặc lớp"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => setShowForm(true)}
        >
          + Thêm mới
        </Button>
      </Stack>

      {/* Bảng danh sách học sinh */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>Tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell>Phụ huynh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.dob}</TableCell>
                  <TableCell>{s.gender}</TableCell>
                  <TableCell>{s.current_grade || "-"}</TableCell>
                  <TableCell>{s.Parent?.name || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy học sinh nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Form thêm mới */}
      {showForm && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            bgcolor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Thêm học sinh
          </Typography>

          <Stack spacing={2}>
            <TextField
              name="name"
              label="Tên"
              variant="outlined"
              required
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              type="date"
              name="dob"
              label="Ngày sinh"
              InputLabelProps={{ shrink: true }}
              required
              value={form.dob}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="gender-label">Giới tính</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={form.gender}
                label="Giới tính"
                onChange={handleChange}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="current_grade"
              label="Lớp (ví dụ: Lớp 5)"
              variant="outlined"
              value={form.current_grade}
              onChange={handleChange}
            />
            <FormControl fullWidth required>
              <InputLabel id="parent-label">Phụ huynh</InputLabel>
              <Select
                labelId="parent-label"
                name="parentId"
                value={form.parentId}
                label="Phụ huynh"
                onChange={handleChange}
              >
                <MenuItem value="">-- Chọn phụ huynh --</MenuItem>
                {parents.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.phone})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="success">
                Lưu
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {message && (
        <Typography mt={2} color={message.includes("✅") ? "success.main" : "error"}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

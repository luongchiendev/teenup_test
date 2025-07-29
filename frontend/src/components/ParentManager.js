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
} from "@mui/material";

const { BACKEND_URL } = require("../urlConfig");

export default function ParentManager() {
  const { parents, setParents } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filteredParents, setFilteredParents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const result = parents.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
    );
    setFilteredParents(result);
  }, [search, parents]);

  const getListParents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/parents`);
      if (response) {
        setParents(response.data);
      }
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    getListParents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/parents`, form);
      if (response) {
        setParents((prev) => [...prev, response.data]);
        setForm({ name: "", phone: "", email: "" });
        setShowForm(false);
      }
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý Phụ huynh
      </Typography>

      {/* Tìm kiếm + Thêm mới */}
      <Stack direction="row" spacing={2} mb={2} >
        <TextField
          fullWidth
          size="small"
          label="Tìm theo tên hoặc số điện thoại"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => setShowForm(true)}
          style={{ width: "137px" }}
        >
          Thêm Mới
        </Button>
      </Stack>

      {/* Bảng danh sách */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>Tên</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParents.length > 0 ? (
              filteredParents.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Không tìm thấy phụ huynh nào
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
            Thêm phụ huynh
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
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              required
              value={form.phone}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
            />

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
        <Typography color="error" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

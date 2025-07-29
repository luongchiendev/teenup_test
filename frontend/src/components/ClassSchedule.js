import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
const { BACKEND_URL } = require("../urlConfig");

export default function ClassSchedule() {
  const [classesByDay, setClassesByDay] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    day_of_week: "1",
    time_slot: "",
    teacher_name: "",
    max_students: 20,
  });

  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/classes`);
      const grouped = {};
      res.data.forEach((cls) => {
        if (!grouped[cls.day_of_week]) grouped[cls.day_of_week] = [];
        grouped[cls.day_of_week].push(cls);
      });
      setClassesByDay(grouped);
    } catch (err) {
      showSnackbar("Lỗi tải danh sách lớp", "error");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      showSnackbar("Lỗi tải danh sách học sinh", "error");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRegister = async () => {
    if (!selectedStudent) {
      showSnackbar("Vui lòng chọn học sinh", "warning");
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/classes/${selectedClass.id}/register`, {
        studentId: selectedStudent,
      });
      showSnackbar("✅ Đăng ký thành công");
      setSelectedClass(null);
      setSelectedStudent("");
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi đăng ký", "error");
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/classes`, newClass);
      showSnackbar("Tạo lớp thành công!");
      setShowCreateDialog(false);
      fetchClasses();
      setNewClass({
        name: "",
        subject: "",
        day_of_week: "1",
        time_slot: "",
        teacher_name: "",
        max_students: 20,
      });
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi tạo lớp", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Đăng ký lớp học cho học sinh
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setShowCreateDialog(true)} sx={{ mb: 2 }}>
        + Tạo lớp mới
      </Button>

      <Grid container spacing={2}>
        {dayNames.map((day, i) => {
          const dayIndex = (i + 1).toString();
          const dayClasses = classesByDay[dayIndex] || [];
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dayIndex}>
              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle1" align="center" fontWeight="bold">
                  {day}
                </Typography>
                {dayClasses.length === 0 ? (
                  <Typography variant="body2" align="center">Không có lớp</Typography>
                ) : (
                  dayClasses.map((cls) => (
                    <Card key={cls.id} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {cls.name} - {cls.subject}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {cls.time_slot} | GV: {cls.teacher_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Tối đa: {cls.max_students} HS
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          sx={{ mt: 1 }}
                          onClick={() => setSelectedClass(cls)}
                        >
                          Đăng ký
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog đăng ký */}
      <Dialog open={!!selectedClass} onClose={() => setSelectedClass(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Đăng ký lớp: {selectedClass?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="student-select-label">Chọn học sinh</InputLabel>
            <Select
              labelId="student-select-label"
              value={selectedStudent}
              label="Chọn học sinh"
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedClass(null)}>Hủy</Button>
          <Button onClick={handleRegister} variant="contained" color="success">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo lớp */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo lớp mới</DialogTitle>
        <form onSubmit={handleCreateClass}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Tên lớp"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              required
            />
            <TextField
              label="Môn học"
              value={newClass.subject}
              onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Thứ</InputLabel>
              <Select
                value={newClass.day_of_week}
                label="Thứ"
                onChange={(e) => setNewClass({ ...newClass, day_of_week: e.target.value })}
              >
                {dayNames.map((d, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Khung giờ"
              value={newClass.time_slot}
              onChange={(e) => setNewClass({ ...newClass, time_slot: e.target.value })}
              required
            />
            <TextField
              label="Giáo viên"
              value={newClass.teacher_name}
              onChange={(e) => setNewClass({ ...newClass, teacher_name: e.target.value })}
              required
            />
            <TextField
              label="Số học sinh tối đa"
              type="number"
              value={newClass.max_students}
              onChange={(e) =>
                setNewClass({ ...newClass, max_students: parseInt(e.target.value) })
              }
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained">Lưu</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}

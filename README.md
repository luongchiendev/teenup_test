# 📚 LMS Management System

Hệ thống quản lý học sinh, phụ huynh, lớp học (LMS) sử dụng **Node.js + Express + Sequelize + MySQL**, chạy bằng **Docker**.

---

## 🚀 1. Cách dựng project (build/run với Docker)

### **Yêu cầu**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hoặc Docker Engine + Docker Compose)
- Port **3307** (MySQL) và **5000** (backend) trống

### **Chạy lần đầu**
```bash
git clone <repository-url>
cd <project-folder>

docker compose up -d --build
4.Seed CSDL
docker compose exec lms_backend node seed.js


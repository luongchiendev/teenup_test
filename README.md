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

docker-compose --env-file .env.docker up --build
```

✅ **Kiểm tra**
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **MySQL:**  
  ```
  Host: localhost
  Port: 3307
  User: admin
  Password: admin123
  Database: lmsdb
  ```

---

## 🗄 2. Mô tả sơ lược database schema

### **Bảng chính**

#### `parents`
| Trường       | Kiểu       | Mô tả            |
|--------------|------------|------------------|
| `id`         | UUID (PK)  | ID phụ huynh     |
| `name`       | VARCHAR    | Tên phụ huynh    |
| `phone`      | VARCHAR    | SĐT              |
| `email`      | VARCHAR    | Email            |

#### `students`
| Trường       | Kiểu       | Mô tả            |
|--------------|------------|------------------|
| `id`         | UUID (PK)  | ID học sinh      |
| `name`       | VARCHAR    | Tên học sinh     |
| `age`        | INT        | Tuổi             |
| `parentId`   | UUID (FK)  | Liên kết parents |

#### `classes`
| Trường       | Kiểu       | Mô tả            |
|--------------|------------|------------------|
| `id`         | UUID (PK)  | ID lớp học       |
| `name`       | VARCHAR    | Tên lớp          |
| `schedule`   | VARCHAR    | Lịch học         |

#### `class_registrations`
| Trường         | Kiểu       | Mô tả            |
|----------------|------------|------------------|
| `id`          | UUID (PK)  | ID đăng ký       |
| `studentId`   | UUID (FK)  | Liên kết student |
| `classId`     | UUID (FK)  | Liên kết class   |

---

## 🔗 3. Các endpoint chính & ví dụ truy vấn

### **Parents**
- **GET** `/api/parents`
- **POST** `/api/parents`
  ```json
  {
    "name": "Nguyễn Văn A",
    "phone": "0123456789",
    "email": "a@gmail.com"
  }
  ```

### **Students**
- **GET** `/api/students`
- **POST** `/api/students`
  ```json
  {
    "name": "Nguyễn Văn B",
    "age": 10,
    "parentId": "uuid_parent"
  }
  ```

### **Classes**
- **GET** `/api/classes`
- **POST** `/api/classes`
  ```json
  {
    "name": "Toán nâng cao",
    "schedule": "Mon-Wed"
  }
  ```

### **Class Registration**
- **POST** `/api/classRegistration`
  ```json
  {
    "studentId": "uuid_student",
    "classId": "uuid_class"
  }
  ```

---

## 🌱 4. Seed dữ liệu

Chạy lệnh sau khi container MySQL & backend đã chạy:

```bash
docker compose exec lms_backend node seed.js
```

### **Dữ liệu được seed**
- **Parents:** 2 phụ huynh  
- **Students:** 3 học sinh (liên kết với parents)  
- **Classes:** 3 lớp học  

---

## ✅ 5. Ghi chú
- **Lỗi kết nối DB:** Nếu MySQL lỗi, thử:
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```
- **Backup DB:** Volume dữ liệu nằm trong thư mục `./mysql_data/`.

# 🏫 MERN School Management System

Hệ thống quản lý trường học toàn diện xây dựng bằng **MERN Stack** (MongoDB, Express, React, Node.js) với hỗ trợ 3 vai trò chính: Admin, Teacher, Student.

---

## 📋 Mục Lục

1. [Giới Thiệu](#-giới-thiệu)
2. [Tính Năng Chính](#-tính-năng-chính)
3. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
4. [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
5. [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
6. [Hướng Dẫn Sử Dụng Admin](#-hướng-dẫn-sử-dụng-admin)
7. [Hướng Dẫn Sử Dụng Teacher](#-hướng-dẫn-sử-dụng-teacher)
8. [Hướng Dẫn Sử Dụng Student](#-hướng-dẫn-sử-dụng-student)
9. [API Reference](#-api-reference)
10. [Cấu Trúc Database](#-cấu-trúc-database)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Giới Thiệu

### Mô Tả
MERN School Management System là một ứng dụng quản lý trường học hiện đại, cho phép:
- **Admin** quản lý toàn bộ trường học (lớp, môn, giáo viên, học sinh)
- **Teacher** theo dõi học sinh, điểm danh, nhập điểm
- **Student** xem điểm, chuyên cần, thông báo

### Kiến Trúc
```
┌─────────────────────────────────────────┐
│         Frontend (React.js)             │
│  ├─ Admin Dashboard                     │
│  ├─ Teacher Dashboard                   │
│  └─ Student Dashboard                   │
└──────────────┬──────────────────────────┘
               │ HTTP/REST & JWT
┌──────────────┴──────────────────────────┐
│      Backend (Node.js + Express)        │
│  ├─ Controllers                         │
│  ├─ Middleware (Auth, Authorize)        │
│  ├─ Routes                              │
│  └─ Models                              │
└──────────────┬──────────────────────────┘
               │ MongoDB Driver
┌──────────────┴──────────────────────────┐
│        Database (MongoDB)               │
│  ├─ Admin Collection                    │
│  ├─ Teacher Collection                  │
│  ├─ Student Collection                  │
│  ├─ Subject Collection                  │
│  ├─ Class Collection                    │
│  ├─ Notice Collection                   │
│  └─ Complain Collection                 │
└─────────────────────────────────────────┘
```

---

## ✨ Tính Năng Chính

### 🔐 Xác Thực & Quản Lý Tài Khoản
- ✅ Đăng ký/Đăng nhập cho 3 vai trò
- ✅ JWT Token (8 giờ hết hạn)
- ✅ Bcrypt password hashing
- ✅ Middleware xác thực & phân quyền

### 👨‍💼 Admin - Quản Trị Viên
- ✅ Quản lý lớp học (Tạo, Sửa, Xóa, Xem)
- ✅ Quản lý môn học (Gán giáo viên, Cập nhật)
- ✅ Quản lý giáo viên (Thêm, Sửa, Xóa, Gán môn)
- ✅ Quản lý học sinh (Thêm, Sửa, Xóa, Xem chi tiết)
- ✅ Điểm danh học sinh theo môn
- ✅ Nhập điểm thi (0-100)
- ✅ Tạo/Quản lý thông báo
- ✅ Xem khiếu nại từ giáo viên & học sinh

### 👨‍🏫 Teacher - Giáo Viên
- ✅ Xem danh sách học sinh lớp
- ✅ Điểm danh học sinh (Có mặt/Vắng)
- ✅ Nhập & Cập nhật điểm thi
- ✅ Xem thống kê chuyên cần & điểm
- ✅ Gửi khiếu nại đến Admin
- ✅ Xem thông báo từ trường

### 👨‍🎓 Student - Học Sinh
- ✅ Xem danh sách môn học
- ✅ Xem điểm thi (Bảng & Biểu đồ)
- ✅ Xem chuyên cần chi tiết
- ✅ Gửi khiếu nại đến Admin
- ✅ Xem thông báo từ trường
- ✅ Cập nhật hồ sơ cá nhân

---

## 🖥️ Yêu Cầu Hệ Thống

### Software
- **Node.js**: >= v14.0.0
- **npm**: >= 6.0.0 hoặc **yarn**
- **MongoDB**: 5.0+ (local hoặc Atlas cloud)

### Hardware (Tối Thiểu)
- **RAM**: 2GB
- **Disk**: 500MB
- **CPU**: Quad-core processor

---

## 🚀 Hướng Dẫn Cài Đặt

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd MERN-School-Management-System
```

### Bước 2: Cài Đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb://127.0.0.1:27017/school_db
# Hoặc dùng MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school_db

# Security
SECRET_KEY=your_super_secret_key_here_change_this_in_production

# CORS Configuration
CLIENT_ORIGIN=http://localhost:3000
EOF

# Chạy server
npm run start:dev
# Server chạy tại http://localhost:5000
```

### Bước 3: Cài Đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd ../frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cat > .env << EOF
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000
EOF

# Chạy ứng dụng
npm start
# App chạy tại http://localhost:3000
```

### Bước 4: Truy Cập Ứng Dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📁 Cấu Trúc Dự Án

```
MERN-School-Management-System/
├── README.md
├── backend/
│   ├── .env                          # Cài đặt biến môi trường
│   ├── .gitignore
│   ├── package.json
│   ├── index.js                      # Entry point
│   ├── controllers/
│   │   ├── admin-controller.js
│   │   ├── class-controller.js
│   │   ├── complain-controller.js
│   │   ├── notice-controller.js
│   │   ├── student_controller.js
│   │   ├── subject-controller.js
│   │   └── teacher-controller.js
│   ├── middleware/
│   │   ├── auth.js                   # JWT Verification
│   │   └── authorize.js              # Role-based Access
│   ├── models/
│   │   ├── adminSchema.js
│   │   ├── complainSchema.js
│   │   ├── noticeSchema.js
│   │   ├── sclassSchema.js
│   │   ├── studentSchema.js
│   │   ├── subjectSchema.js
│   │   └── teacherSchema.js
│   ├── routes/
│   │   └── (API routes)
│   ├── scripts/
│   │   └── seed.js                   # Dữ liệu mẫu
│   └── tests/
│       └── (Unit tests)
│
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard
│   │   │   ├── TeacherDashboard
│   │   │   ├── StudentDashboard
│   │   │   ├── AdminPages/
│   │   │   ├── TeacherPages/
│   │   │   └── StudentPages/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── styles/
│   │   └── utils/
│   └── build/
│
└── docker-compose.yml (tuỳ chọn)
```

---

## 👨‍💼 Hướng Dẫn Sử Dụng Admin

### 1️⃣ Đăng Ký & Đăng Nhập Admin

#### Đăng Ký Tài Khoản Admin
```
URL: http://localhost:3000/Adminregister
```

**Các thông tin cần nhập:**
- **Họ tên**: Nguyễn Văn A
- **Email**: admin@school.com (duy nhất, không được trùng)
- **Mật khẩu**: Admin@123 (tối thiểu 6 ký tự)
- **Tên trường**: Trường THPT A (duy nhất)

**Quy trình:**
1. Nhập đầy đủ thông tin
2. Nhấn "Xác nhận Đăng ký"
3. Hệ thống xác thực dữ liệu
4. Redirect sang trang đăng nhập

#### Đăng Nhập
```
URL: http://localhost:3000/Adminlogin
```

**Thông tin đăng nhập:**
- **Email**: admin@school.com
- **Mật khẩu**: Admin@123
- Nhấn "Đăng nhập"

**Kết quả:** Chuyển tới Admin Dashboard

---

### 2️⃣ Quản Lý Lớp Học

#### Tạo Lớp Mới

**Bước:**
1. Dashboard → Menu "Lớp học"
2. Nhấn nút "+ Thêm lớp"
3. Nhập tên lớp: `10A`, `10B`, `11A`, `12C`, ...
4. Nhấn "Tạo lớp"

**Lưu ý:**
- Tên lớp phải duy nhất trong trường
- Tên lớp không được trống
- Có thể tạo nhiều lớp

#### Xem Danh Sách Lớp

**Màn hình:** Dashboard → "Lớp học"

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Tên Lớp | 10A, 10B, ... |
| Số Học Sinh | Tổng HS trong lớp |
| Số Môn | Tổng môn dạy |
| Số Giáo Viên | GV phụ trách |
| Hành Động | Xem, Sửa, Xóa |

#### Xem Chi Tiết Lớp

**Bước:**
1. Danh sách lớp → Nhấn nút "Xem" hoặc tên lớp
2. Hiển thị:
   - Danh sách môn học
   - Danh sách học sinh
   - Danh sách giáo viên
   - Thống kê

#### Sửa Lớp

**Bước:**
1. Danh sách lớp → Nhấn "Sửa"
2. Cập nhật tên lớp
3. Nhấn "Cập nhật"

#### Xóa Lớp

**Bước:**
1. Danh sách lớp → Nhấn "Xóa"
2. Xác nhận xóa (⚠️ Không thể hoàn tác)

**Cảnh báo:** Xóa lớp sẽ xóa toàn bộ:
- Tất cả môn của lớp
- Tất cả học sinh của lớp
- Tất cả giáo viên phụ trách lớp
- Tất cả điểm & chuyên cần

---

### 3️⃣ Quản Lý Môn Học

#### Tạo Môn Học

**Bước:**
1. Dashboard → Lớp học → Chọn lớp (ví dụ 10A)
2. Tab "Môn học" → "+ Thêm môn"
3. Nhập thông tin:
   - **Tên môn**: Toán, Lý, Hóa, Tiếng Anh, ...
   - **Mã môn**: TOAN101, LY101, HOA101 (duy nhất toàn trường)
   - **Số buổi**: 20 (số lần điểm danh tối đa)
4. Nhấn "Tạo môn"

**Validation:**
- Tên môn không được trống
- Mã môn phải duy nhất
- Số buổi phải > 0

#### Xem Danh Sách Môn

**Filter:**
- Tất cả môn của trường
- Môn của lớp cụ thể

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Tên Môn | Toán, Lý, ... |
| Mã Môn | TOAN101, ... |
| Lớp | 10A, 10B, ... |
| Giáo Viên | Tên GV dạy |
| Số Buổi | 20, 30, ... |
| Hành Động | Xem, Sửa, Xóa |

#### Sửa Môn Học

**Bước:**
1. Danh sách môn → "Sửa"
2. Cập nhật:
   - Tên môn
   - Số buổi
3. Nhấn "Cập nhật"

#### Gán Giáo Viên Cho Môn

**Bước:**
1. Danh sách môn → Chọn môn
2. Tab "Giáo viên" → "Gán giáo viên"
3. Chọn giáo viên từ danh sách
4. Nhấn "Gán"

**Lưu ý:**
- 1 môn chỉ có 1 giáo viên
- Có thể thay đổi giáo viên bất kỳ lúc nào

#### Xóa Môn

**Bước:**
1. Danh sách môn → "Xóa"
2. Xác nhận

**Hậu quả:**
- Xóa môn khỏi lớp
- Xóa tất cả điểm & chuyên cần của HS môn đó
- Gỡ liên kết giáo viên

---

### 4️⃣ Quản Lý Giáo Viên

#### Thêm Giáo Viên

**Bước:**
1. Dashboard → "Giáo viên" → "+ Thêm giáo viên"
2. Nhập thông tin:
   - **Họ tên**: Trần Thị B
   - **Email**: teacher1@school.com (duy nhất)
   - **Mật khẩu**: Teacher@123
   - **Lớp phụ trách**: 10A (dropdown)
3. Nhấn "Tạo"

#### Xem Danh Sách Giáo Viên

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Họ Tên | Tên giáo viên |
| Email | Email đăng nhập |
| Lớp Phụ Trách | 10A, 10B, ... |
| Môn Dạy | Toán, Lý, Hóa, ... |
| Hành Động | Xem, Sửa, Xóa |

#### Xem Chi Tiết Giáo Viên

**Tab 1: Thông tin cá nhân**
- Họ tên
- Email
- Lớp phụ trách
- Trường

**Tab 2: Môn học dạy**
- Danh sách môn
- Nút "+ Thêm môn"
- Nút "Xóa môn"

**Tab 3: Thống kê**
- Tổng số học sinh dạy
- Tổng số môn dạy
- Tổng số lớp

#### Sửa Giáo Viên

**Bước:**
1. Giáo viên → "Sửa"
2. Cập nhật:
   - Họ tên
   - Email
   - Lớp phụ trách
3. Nhấn "Cập nhật"

#### Gán/Bỏ Môn Dạy

**Thêm môn:**
1. Chi tiết GV → Tab "Môn học"
2. "+ Thêm môn"
3. Chọn môn từ danh sách
4. Nhấn "Thêm"

**Bỏ môn:**
1. Chi tiết GV → Tab "Môn học"
2. Chọn môn → "Xóa"
3. Xác nhận

#### Xóa Giáo Viên

**Bước:**
1. Danh sách GV → "Xóa"
2. Xác nhận

**Kết quả:**
- Xóa tài khoản GV
- Gỡ liên kết khỏi tất cả môn
- Gỡ liên kết khỏi lớp phụ trách

---

### 5️⃣ Quản Lý Học Sinh

#### Thêm Học Sinh

**Bước:**
1. Dashboard → Lớp học → Chọn lớp (10A)
2. Tab "Học sinh" → "+ Thêm học sinh"
3. Nhập thông tin:
   - **Họ tên**: Nguyễn Văn C
   - **Số báo danh**: 001 (duy nhất trong lớp)
   - **Mật khẩu**: Student@123
4. Lớp học được điền tự động
5. Nhấn "Tạo"

**Validation:**
- Số báo danh duy nhất trong lớp
- Tên không được trống
- Mật khẩu tối thiểu 6 ký tự

#### Xem Danh Sách Học Sinh

**Bước:**
1. Dashboard → Lớp học → Chọn lớp
2. Tab "Học sinh"

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Số Báo Danh | 001, 002, ... |
| Họ Tên | Tên HS |
| Lớp | 10A, 10B, ... |
| Điểm TB | Trung bình toàn bộ |
| Chuyên Cần % | % Có mặt |
| Hành Động | Xem, Sửa, Xóa |

#### Xem Chi Tiết Học Sinh

**Tab 1: Thông tin cá nhân**
- Họ tên
- Số báo danh
- Lớp
- Trường

**Tab 2: Điểm thi**
- Bảng điểm từng môn
- Biểu đồ cột so sánh
- Thống kê trung bình

**Tab 3: Chuyên cần**
- Bảng lịch sử điểm danh
- Biểu đồ tròn (% Có mặt / Vắng)
- Thống kê theo môn

**Tab 4: Hành động**
- Thêm/Sửa điểm danh
- Thêm/Sửa điểm thi
- Xóa chuyên cần / điểm

#### Sửa Học Sinh

**Bước:**
1. Danh sách HS → "Sửa"
2. Cập nhật:
   - Họ tên
   - Số báo danh
3. Nhấn "Cập nhật"

#### Thêm/Sửa Chuyên Cần (Điểm Danh)

**Bước:**
1. Chi tiết HS → Tab "Chuyên cần"
2. "+ Thêm điểm danh" hoặc chọn hàng cũ để sửa
3. Nhập:
   - **Môn học**: Chọn từ dropdown
   - **Trạng thái**: Có mặt / Vắng mặt
   - **Ngày**: DD/MM/YYYY
4. Nhấn "Lưu"

**Validation:**
- Số lần điểm danh ≤ số buổi của môn
- Thông báo: "Đã đạt giới hạn điểm danh"

**Ví dụ:**
```
Môn Toán: Số buổi = 20
Hiện tại: 19 buổi
→ Chỉ thêm được 1 buổi nữa
→ Buổi thứ 21 → Lỗi!
```

#### Thêm/Sửa Điểm Thi

**Bước:**
1. Chi tiết HS → Tab "Điểm"
2. "+ Thêm điểm" hoặc chọn hàng cũ
3. Nhập:
   - **Môn học**: Chọn từ dropdown
   - **Điểm**: 0-100 (số thực)
4. Nhấn "Lưu"

**Validation:**
- Điểm phải nằm trong [0, 100]
- Chỉ nhập số, không chữ

**Ví dụ:** Toán = 8.5, Lý = 7, Hóa = 9.2

#### Xóa Học Sinh

**Bước:**
1. Danh sách HS → "Xóa"
2. Xác nhận (⚠️ không thể hoàn tác)

**Kết quả:**
- Xóa tài khoản HS
- Xóa tất cả điểm & chuyên cần

---

### 6️⃣ Quản Lý Thông Báo

#### Tạo Thông Báo

**Bước:**
1. Dashboard → "Thông báo" → "+ Tạo thông báo"
2. Nhập:
   - **Tiêu đề**: Thông báo kỳ thi
   - **Nội dung**: Kỳ thi sẽ diễn ra vào ngày...
   - **Ngày gửi**: DD/MM/YYYY
3. Nhấn "Tạo"

**Ví dụ:**
```
Tiêu đề: Lịch thi học kỳ I
Nội dung: Kỳ thi sẽ bắt đầu từ ngày 15/12/2024
Ngày: 01/12/2024
```

#### Xem Danh Sách Thông Báo

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Tiêu Đề | Nội dung tiêu đề |
| Ngày Tạo | DD/MM/YYYY |
| Trạng Thái | Mới, Cũ, ... |
| Hành Động | Sửa, Xóa |

#### Sửa Thông Báo

**Bước:**
1. Danh sách TB → "Sửa"
2. Cập nhật tiêu đề & nội dung
3. Nhấn "Cập nhật"

#### Xóa Thông Báo

**Bước:**
1. Danh sách TB → "Xóa"
2. Xác nhận

---

### 7️⃣ Quản Lý Khiếu Nại

#### Xem Danh Sách Khiếu Nại

**Bước:**
1. Dashboard → "Khiếu nại"

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Người Gửi | Tên giáo viên / học sinh |
| Tiêu Đề | Nội dung tiêu đề |
| Ngày Gửi | DD/MM/YYYY |
| Vai Trò | Teacher / Student |
| Hành Động | Xem, Xóa |

#### Xem Chi Tiết Khiếu Nại

**Bước:**
1. Danh sách KN → "Xem"
2. Hiển thị:
   - Người gửi (Email, Vai trò)
   - Tiêu đề
   - Nội dung đầy đủ
   - Ngày gửi
   - Nút "Xóa" sau khi xử lý

#### Xóa Khiếu Nại

**Bước:**
1. Chi tiết KN → "Xóa"
2. Xác nhận (sau khi xử lý)

---

## 👨‍🏫 Hướng Dẫn Sử Dụng Teacher

### 1️⃣ Đăng Nhập Giáo Viên

**Bước:**
1. Truy cập http://localhost:3000
2. Nhấn "Giáo viên"
3. URL: http://localhost:3000/Teacherlogin
4. Nhập:
   - **Email**: teacher1@school.com (do Admin cấp)
   - **Mật khẩu**: Teacher@123
5. Nhấn "Đăng nhập"

**Kết quả:** Chuyển tới Teacher Dashboard

---

### 2️⃣ Dashboard

**Thông tin hiển thị:**

| Thẻ | Nội Dung |
|-----|---------|
| 👥 Tổng Học Sinh | Số HS trong lớp phụ trách |
| 📚 Tổng Buổi | Tổng số buổi môn dạy |
| 📝 Bài Kiểm Tra | Tổng số bài thi nhập |
| ⏱️ Tổng Giờ | Tính từ số buổi |
| 📢 Thông Báo | Danh sách TB mới nhất |

**Ví dụ:**
```
Dashboard Teacher
├─ Tổng Học Sinh: 30
├─ Tổng Buổi: 60 (30 buổi × 2 môn)
├─ Bài Kiểm Tra: 45
├─ Tổng Giờ: 60
└─ Thông Báo Mới: 2
```

---

### 3️⃣ Quản Lý Lớp

#### Xem Chi Tiết Lớp

**Bước:**
1. Dashboard → "Chi tiết lớp"
2. Hoặc từ sidebar → "Lớp của tôi"

**Tab 1: Danh Sách Học Sinh**
- Hiển thị tất cả HS trong lớp
- Cột: Số báo danh, Họ tên, Điểm TB, Chuyên cần %

**Tab 2: Danh Sách Môn** (nếu dạy nhiều)
- Hiển thị tất cả môn GV dạy
- Nút chọn để chuyển đổi

#### Chọn Môn (Nếu Dạy Nhiều)

**Bước:**
1. Chi tiết lớp → Tab "Môn học"
2. Danh sách các môn → Nhấn để chọn
3. Tab "Danh sách HS" sẽ cập nhật theo môn

**Ví dụ:**
```
GV dạy: Toán, Lý, Hóa
→ Danh sách HS là 1 nhóm học Toán
```

---

### 4️⃣ Quản Lý Học Sinh

#### Xem Danh Sách Học Sinh

**Bước:**
1. Chi tiết lớp → Tab "Danh sách HS"

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Số Báo Danh | 001, 002, ... |
| Họ Tên | Tên HS |
| Điểm TB | Trung bình toàn bộ |
| Chuyên Cần | % Có mặt |
| Hành Động | Xem, Điểm danh |

#### Xem Chi Tiết Học Sinh

**Bước:**
1. Danh sách HS → "Xem" hoặc tên HS

**Tab 1: Thông tin cá nhân**
- Số báo danh
- Họ tên
- Lớp
- Trường

**Tab 2: Chuyên cần**
- Bảng lịch sử điểm danh
- Biểu đồ thống kê
- Nút "+ Thêm điểm danh"

**Tab 3: Điểm**
- Danh sách điểm thi
- Biểu đồ cột so sánh
- Nút "+ Thêm điểm"

---

### 5️⃣ Điểm Danh Học Sinh

#### Thêm Điểm Danh

**Bước:**
1. Danh sách HS → Menu "..." → "Điểm danh"
2. Hoặc chi tiết HS → Tab "Chuyên cần" → "+ Thêm"
3. Nhập:
   - **Trạng thái**: Có mặt / Vắng mặt
   - **Ngày**: DD/MM/YYYY
4. Nhấn "Lưu"

**Ví dụ:**
```
Học Sinh: Nguyễn Văn C
Môn: Toán
Trạng thái: Có mặt
Ngày: 15/11/2024
```

#### Sửa Điểm Danh

**Bước:**
1. Chi tiết HS → Tab "Chuyên cần"
2. Bảng → Hàng muốn sửa → Nhấn để chỉnh sửa
3. Cập nhật trạng thái / Ngày
4. Nhấn "Cập nhật"

#### Xem Thống Kê Chuyên Cần

**Xem bảng:**
1. Chi tiết HS → Tab "Chuyên cần"
2. Bảng hiển thị: Ngày, Trạng thái, Môn

**Xem biểu đồ:**
1. Tab "Chuyên cần" → Nút "Biểu đồ"
2. Hiển thị:
   - Biểu đồ tròn (% Có mặt / Vắng)
   - Thống kê số buổi
   - % Chuyên cần = (Buổi có mặt / Tổng buổi) × 100

**Ví dụ:**
```
Môn Toán: 20 buổi
- Có mặt: 19 buổi
- Vắng: 1 buổi
- % Chuyên cần: 19/20 × 100 = 95%
```

#### Xóa Điểm Danh

**Bước:**
1. Chi tiết HS → Tab "Chuyên cần"
2. Chọn hàng → "Xóa"
3. Xác nhận

---

### 6️⃣ Nhập Điểm Thi

#### Thêm Điểm

**Bước:**
1. Danh sách HS → Menu "..." → "Nhập điểm"
2. Hoặc chi tiết HS → Tab "Điểm" → "+ Thêm"
3. Nhập:
   - **Điểm**: 0-100 (số thực)
4. Nhấn "Lưu"

**Validation:**
- Điểm phải trong [0, 100]
- Ví dụ: 8.5, 7, 9.2 ✅
- Ví dụ: 101, -5, "A" ❌

#### Sửa Điểm

**Bước:**
1. Chi tiết HS → Tab "Điểm"
2. Bảng → Hàng muốn sửa
3. Cập nhật điểm
4. Nhấn "Cập nhật"

#### Xem Thống Kê Điểm

**Xem bảng:**
1. Chi tiết HS → Tab "Điểm"
2. Bảng hiển thị: Tên môn, Điểm, Ngày

**Xem biểu đồ:**
1. Tab "Điểm" → Nút "Biểu đồ"
2. Biểu đồ cột so sánh điểm các môn
3. Trục Y: Điểm (0-100)
4. Trục X: Tên môn

**Ví dụ:**
```
Biểu đồ điểm
├─ Toán: 8.5
├─ Lý: 7.0
├─ Hóa: 9.2
└─ Tiếng Anh: 7.5
```

---

### 7️⃣ Gửi Khiếu Nại

#### Tạo Khiếu Nại

**Bước:**
1. Dashboard → "Khiếu nại" hoặc sidebar
2. "+ Tạo khiếu nại"
3. Nhập:
   - **Tiêu đề**: Vấn đề về lịch dạy
   - **Nội dung**: Chi tiết vấn đề
4. Nhấn "Gửi"

**Ví dụ:**
```
Tiêu đề: Lịch dạy trùng
Nội dung: Lịch dạy Toán trùng với lịch chấm công
Gửi đến: Admin
```

#### Xem Khiếu Nại Đã Gửi

**Bước:**
1. Khiếu nại → Bộ lọc "Khiếu nại của tôi"

**Thông tin:**
- Tiêu đề
- Nội dung
- Ngày gửi
- Trạng thái (Chưa xử lý / Đã xử lý)

---

### 8️⃣ Xem Thông Báo

#### Danh Sách Thông Báo

**Bước:**
1. Dashboard → "Thông báo" hoặc sidebar

**Thông tin:**
| Cột | Mô Tả |
|-----|-------|
| Tiêu Đề | Nội dung TB |
| Ngày Tạo | DD/MM/YYYY |
| Hành Động | Xem, Xóa khỏi danh sách |

#### Xem Chi Tiết Thông Báo

**Bước:**
1. Danh sách TB → Nhấn tiêu đề hoặc "Xem"
2. Hiển thị nội dung đầy đủ
3. Nút "Quay lại"

---

## 👨‍🎓 Hướng Dẫn Sử Dụng Student

### 1️⃣ Đăng Ký & Đăng Nhập

#### Đăng Ký (Nếu Cần)

**Bước:**
1. URL: http://localhost:3000/Studentregister
2. Nhập:
   - **Họ tên**: Nguyễn Văn C
   - **Số báo danh**: 001 (duy nhất trong lớp)
   - **Mật khẩu**: Student@123
   - **Lớp**: Chọn từ dropdown
   - **Trường**: Chọn từ dropdown
3. Nhấn "Đăng ký"

**Lưu ý:** Admin thường tạo sẵn HS, nên bước này không cần

#### Đăng Nhập

**Bước:**
1. URL: http://localhost:3000/Studentlogin
2. Nhập:
   - **Số báo danh**: 001
   - **Tên**: Nguyễn Văn C
   - **Mật khẩu**: Student@123
3. Nhấn "Đăng nhập"

**Kết quả:** Chuyển tới Student Dashboard

---

### 2️⃣ Dashboard

**Thông tin hiển thị:**

| Thẻ | Nội Dung |
|-----|---------|
| 📚 Tổng Môn | Số môn học của lớp |
| 📝 Bài Tập | Tổng buổi học |
| 📊 Chuyên Cần | % Có mặt chung |
| 📢 Thông Báo | Danh sách TB mới nhất |

**Ví dụ:**
```
Student Dashboard
├─ Tổng Môn: 6 (Toán, Lý, Hóa, ...)
├─ Bài Tập: 120 buổi
├─ Chuyên Cần: 92.5%
└─ Thông Báo Mới: 3
```

---

### 3️⃣ Hồ Sơ Cá Nhân

#### Xem Hồ Sơ

**Bước:**
1. Dashboard → "Hồ sơ" hoặc "Tài khoản"
2. Sidebar → "Hồ sơ cá nhân"

**Thông tin hiển thị:**
- Họ tên
- Số báo danh
- Email (nếu có)
- Lớp
- Trường
- Ngày đăng ký

#### Cập Nhật Hồ Sơ

**Bước:**
1. Hồ sơ → "Sửa hồ sơ"
2. Cập nhật:
   - Họ tên
   - Mật khẩu (tuỳ chọn)
3. Nhấn "Cập nhật"

**Lưu ý:**
- Không thể sửa số báo danh
- Không thể sửa lớp/trường

---

### 4️⃣ Danh Sách Môn Học

#### Xem Danh Sách Môn

**Bước:**
1. Dashboard → "Môn học" hoặc sidebar

**Thông tin hiển thị:**
| Cột | Mô Tả |
|-----|-------|
| Tên Môn | Toán, Lý, Hóa, ... |
| Mã Môn | TOAN101, LY101, ... |
| Giáo Viên | Tên GV dạy |
| Số Buổi | 20, 30, ... |
| Điểm | Điểm thi (nếu có) |

#### Chọn Lớp (Nếu Học Nhiều)

**Bước:**
1. Danh sách môn → Dropdown "Lớp"
2. Chọn 10A, 10B, ...
3. Danh sách cập nhật

**Lưu ý:**
- Nếu học 1 lớp, dropdown ẩn
- Nếu học nhiều lớp, có thể chuyển đổi

#### Xem Chi Tiết Cả Lớp

**Bước:**
1. Danh sách môn → "Chi tiết lớp"
2. Hiển thị:
   - Tên lớp
   - Danh sách tất cả môn
   - Danh sách tất cả GV
   - Thống kê

---

### 5️⃣ Xem Điểm

#### Danh Sách Điểm (Bảng)

**Bước:**
1. Dashboard → "Điểm số"
2. Hoặc sidebar → "Điểm"

**Thông tin:**
| Cột | Mô Tả |
|-----|-------|
| Tên Môn | Toán, Lý, ... |
| Điểm | 0-100 |
| Ngày | DD/MM/YYYY |

**Ví dụ:**
```
| Toán | 8.5 | 15/10/2024 |
| Lý   | 7.0 | 20/10/2024 |
| Hóa  | 9.2 | 25/10/2024 |
```

#### Biểu Đồ Điểm

**Bước:**
1. Danh sách điểm → Nút "Biểu đồ"
2. Hiển thị biểu đồ cột
3. Trục X: Tên môn
4. Trục Y: Điểm (0-100)

**Tính năng:**
- Hover: Xem giá trị chính xác
- Zoom: Phóng to/thu nhỏ
- Download: Lưu biểu đồ

**Ví dụ biểu đồ:**
```
     |
100  |
 80  |     ██         ██
 60  |     ██    ██   ██
 40  |     ██    ██   ██
 20  |     ██    ██   ██
  0  |_____|____|____|_____
     Toán  Lý   Hóa  Anh
```

#### Thống Kê Điểm

**Thông tin:**
- Điểm cao nhất
- Điểm thấp nhất
- Điểm trung bình
- Số môn có điểm

**Ví dụ:**
```
┌─────────────────────┐
│ Thống Kê Điểm       │
├─────────────────────┤
│ Cao nhất: 9.2       │
│ Thấp nhất: 7.0      │
│ Trung bình: 8.2     │
│ Số môn có điểm: 3/6 │
└─────────────────────┘
```

---

### 6️⃣ Xem Chuyên Cần

#### Danh Sách Chuyên Cần (Bảng)

**Bước:**
1. Dashboard → "Chuyên cần"
2. Hoặc sidebar → "Chuyên cần"

**Thông tin:**
| Cột | Mô Tả |
|-----|-------|
| Ngày | DD/MM/YYYY |
| Trạng Thái | Có mặt / Vắng |
| Môn | Tên môn |

**Ví dụ:**
```
| 15/10/2024 | Có mặt | Toán |
| 16/10/2024 | Vắng   | Lý   |
| 17/10/2024 | Có mặt | Hóa  |
```

#### Biểu Đồ Chuyên Cần (Tròn)

**Bước:**
1. Chuyên cần → Nút "Biểu đồ tròn"

**Thông tin:**
- **Có mặt**: % màu xanh
- **Vắng**: % màu đỏ
- Tổng buổi
- Tổng vắng

**Ví dụ:**
```
        Chuyên Cần
    ╱─────────────╲
   ╱   Có mặt     ╲
  │      92.5%     │
  │   36 buổi      │
   ╲    3 vắng    ╱
    ╲─────────────╱
```

#### Tổng Hợp Chuyên Cần

**Bước:**
1. Chuyên cần → Tab "Tổng hợp"

**Thông tin:**
- % Chuyên cần chung
- % Chuyên cần từng môn
- Bảng so sánh
- Biểu đồ cột từng môn

**Ví dụ:**
```
Tổng chuyên cần: 92.5%

| Môn | Có Mặt | Vắng | % |
|-----|--------|------|-----|
| Toán | 19 | 1 | 95% |
| Lý | 18 | 2 | 90% |
| Hóa | 20 | 0 | 100% |
```

#### Chi Tiết Theo Môn

**Bước:**
1. Chuyên cần → Chọn môn từ dropdown
2. Hiển thị:
   - Danh sách điểm danh môn đó
   - Biểu đồ chuyên cần môn
   - Thống kê chi tiết

**Lưu ý:**
- Mỗi môn tính chuyên cần riêng
- % Chuyên cần ≠ Điểm thi

---

### 7️⃣ Gửi Khiếu Nại

#### Tạo Khiếu Nại

**Bước:**
1. Dashboard → "Khiếu nại" hoặc sidebar
2. "+ Tạo khiếu nại"
3. Nhập:
   - **Tiêu đề**: Vấn đề về điểm
   - **Nội dung**: Chi tiết khiếu nại
4. Nhấn "Gửi"

**Ví dụ:**
```
Tiêu đề: Khiếu nại điểm thi Toán
Nội dung: Tôi cho rằng điểm thi Toán 
không chính xác, tôi muốn được kiểm tra lại.
Gửi đến: Admin
```

#### Xem Khiếu Nại Đã Gửi

**Bước:**
1. Khiếu nại → Tab "Khiếu nại của tôi"

**Thông tin:**
- Tiêu đề
- Nội dung
- Ngày gửi
- Trạng thái (Đang xử lý / Đã xử lý)

---

### 8️⃣ Xem Thông Báo

#### Danh Sách Thông Báo

**Bước:**
1. Dashboard → "Thông báo"
2. Hoặc sidebar → "Thông báo"

**Thông tin:**
| Cột | Mô Tả |
|-----|-------|
| Tiêu Đề | Nội dung TB |
| Ngày Tạo | DD/MM/YYYY |
| Hành Động | Xem, Xóa khỏi danh sách |

#### Xem Chi Tiết Thông Báo

**Bước:**
1. Danh sách TB → Nhấn tiêu đề
2. Hiển thị:
   - Tiêu đề đầy đủ
   - Nội dung đầy đủ
   - Ngày tạo
   - Người tạo (Admin)

---

## 🔗 API Reference

### 🔐 Authentication APIs

#### 1. Admin Register
```http
POST /AdminReg
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "admin@school.com",
  "password": "Admin@123",
  "schoolName": "Trường THPT A"
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Nguyễn Văn A",
  "email": "admin@school.com",
  "schoolName": "Trường THPT A",
  "role": "Admin"
}
```

#### 2. Admin Login
```http
POST /AdminLogin
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "Admin@123"
}

Response (200):
{
  "admin": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "admin@school.com",
    "role": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Teacher Login
```http
POST /TeacherLogin
Content-Type: application/json

{
  "email": "teacher@school.com",
  "password": "Teacher@123"
}

Response (200):
{
  "teacher": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. Student Login
```http
POST /StudentLogin
Content-Type: application/json

{
  "rollNum": "001",
  "studentName": "Nguyễn Văn C",
  "password": "Student@123"
}

Response (200):
{
  "student": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 5. Logout
```http
POST /Logout
Content-Type: application/json

Response (200):
{ "message": "Logged out successfully" }
```

#### 6. Get Current User
```http
GET /Me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "user": { ... },
  "role": "Admin|Teacher|Student"
}
```

---

### 📚 Class APIs

#### Get All Classes
```http
GET /SclassList/{adminID}

Response (200):
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "sclassName": "10A",
    "school": "65a1b2c3d4e5f6g7h8i9j0k1"
  },
  { ... }
]
```

#### Create Class
```http
POST /SclassCreate
Content-Type: application/json
Authorization: Bearer <token>

{
  "sclassName": "10A",
  "adminID": "65a1b2c3d4e5f6g7h8i9j0k1"
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "sclassName": "10A",
  "school": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### Get Class Details
```http
GET /Sclass/{classID}

Response (200):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "sclassName": "10A",
  "subjects": [ ... ],
  "students": [ ... ],
  "teachers": [ ... ]
}
```

#### Update Class
```http
PUT /Sclass/{classID}
Content-Type: application/json
Authorization: Bearer <token>

{
  "sclassName": "10A - Mới"
}

Response (200):
{ "message": "Class updated successfully" }
```

#### Delete Class
```http
DELETE /Sclass/{classID}
Authorization: Bearer <token>

Response (200):
{ "message": "Class deleted successfully" }
```

---

### 📖 Subject APIs

#### Create Subject
```http
POST /SubjectCreate
Content-Type: application/json
Authorization: Bearer <token>

{
  "subjects": [
    {
      "subName": "Toán",
      "subCode": "TOAN101",
      "sessions": 20
    }
  ],
  "sclassName": "65a1b2c3d4e5f6g7h8i9j0k2",
  "adminID": "65a1b2c3d4e5f6g7h8i9j0k1"
}

Response (201):
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "subName": "Toán",
    "subCode": "TOAN101",
    "sessions": 20,
    "sclassName": "65a1b2c3d4e5f6g7h8i9j0k2"
  }
]
```

#### Get Class Subjects
```http
GET /ClassSubjects/{classID}

Response (200):
[
  { "subName": "Toán", "subCode": "TOAN101", ... },
  { "subName": "Lý", "subCode": "LY101", ... }
]
```

#### Get All Subjects
```http
GET /AllSubjects/{adminID}

Response (200):
[
  { ... },
  { ... }
]
```

#### Update Subject
```http
PUT /Subject/{subjectID}
Content-Type: application/json
Authorization: Bearer <token>

{
  "subName": "Toán Nâng Cao",
  "sessions": 25
}

Response (200):
{ "message": "Subject updated successfully" }
```

#### Delete Subject
```http
DELETE /Subject/{subjectID}
Authorization: Bearer <token>

Response (200):
{ "message": "Subject deleted successfully" }
```

---

### 👨‍🏫 Teacher APIs

#### Get All Teachers
```http
GET /Teachers/{adminID}

Response (200):
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "name": "Trần Thị B",
    "email": "teacher@school.com",
    "teachSclass": "65a1b2c3d4e5f6g7h8i9j0k2",
    "teachSubject": [ "65a1b2c3d4e5f6g7h8i9j0k3" ]
  },
  { ... }
]
```

#### Create Teacher
```http
POST /TeacherReg
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Trần Thị B",
  "email": "teacher@school.com",
  "password": "Teacher@123",
  "school": "65a1b2c3d4e5f6g7h8i9j0k1",
  "teachSclass": "65a1b2c3d4e5f6g7h8i9j0k2",
  "teachSubject": [ "65a1b2c3d4e5f6g7h8i9j0k3" ]
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
  "name": "Trần Thị B",
  "email": "teacher@school.com",
  "role": "Teacher"
}
```

#### Get Teacher Details
```http
GET /Teacher/{teacherID}

Response (200):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
  "name": "Trần Thị B",
  "email": "teacher@school.com",
  "teachSclass": { ... },
  "teachSubject": [ ... ]
}
```

#### Update Teacher
```http
PUT /Teacher/{teacherID}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Trần Thị B - Mới",
  "email": "teacher_new@school.com",
  "teachSclass": "65a1b2c3d4e5f6g7h8i9j0k2"
}

Response (200):
{ "message": "Teacher updated successfully" }
```

#### Update Subject (Môn dạy)
```http
PUT /TeacherSubject
Content-Type: application/json
Authorization: Bearer <token>

{
  "teacherID": "65a1b2c3d4e5f6g7h8i9j0k4",
  "teachSubject": [
    "65a1b2c3d4e5f6g7h8i9j0k3",
    "65a1b2c3d4e5f6g7h8i9j0k5"
  ]
}

Response (200):
{ "message": "Subjects updated successfully" }
```

#### Delete Teacher
```http
DELETE /Teacher/{teacherID}
Authorization: Bearer <token>

Response (200):
{ "message": "Teacher deleted successfully" }
```

---

### 👨‍🎓 Student APIs

#### Get All Students
```http
GET /Students/{adminID}

Response (200):
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
    "name": "Nguyễn Văn C",
    "rollNum": 1,
    "sclassName": "65a1b2c3d4e5f6g7h8i9j0k2"
  },
  { ... }
]
```

#### Create Student
```http
POST /StudentReg
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Nguyễn Văn C",
  "rollNum": 1,
  "password": "Student@123",
  "sclassName": "65a1b2c3d4e5f6g7h8i9j0k2",
  "adminID": "65a1b2c3d4e5f6g7h8i9j0k1"
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
  "name": "Nguyễn Văn C",
  "rollNum": 1,
  "role": "Student"
}
```

#### Get Student Details
```http
GET /Student/{studentID}

Response (200):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
  "name": "Nguyễn Văn C",
  "rollNum": 1,
  "sclassName": { ... },
  "examResult": [ ... ],
  "attendance": [ ... ]
}
```

#### Update Student
```http
PUT /Student/{studentID}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Nguyễn Văn C - Mới"
}

Response (200):
{ "message": "Student updated successfully" }
```

#### Add Attendance
```http
PUT /StudentAttendance/{studentID}
Content-Type: application/json

{
  "subName": "65a1b2c3d4e5f6g7h8i9j0k3",
  "status": "Present",
  "date": "2024-11-15"
}

Response (200):
{
  "message": "Attendance added successfully",
  "attendance": [ ... ]
}

Errors:
- "Attendance limit exceeded for this subject"
```

#### Add Exam Result
```http
PUT /UpdateExamResult/{studentID}
Content-Type: application/json

{
  "subName": "65a1b2c3d4e5f6g7h8i9j0k3",
  "marksObtained": 8.5
}

Response (200):
{ "message": "Marks updated successfully" }
```

#### Delete Student
```http
DELETE /Student/{studentID}
Authorization: Bearer <token>

Response (200):
{ "message": "Student deleted successfully" }
```

---

### 📢 Notice APIs

#### Create Notice
```http
POST /NoticeCreate
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Thông báo kỳ thi",
  "details": "Kỳ thi sẽ diễn ra vào ngày 15/12/2024",
  "date": "2024-11-20",
  "adminID": "65a1b2c3d4e5f6g7h8i9j0k1"
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
  "title": "Thông báo kỳ thi",
  "details": "...",
  "date": "2024-11-20"
}
```

#### Get All Notices
```http
GET /NoticeList/{adminID}

Response (200):
[
  { "_id": "...", "title": "...", "date": "..." },
  { ... }
]
```

#### Update Notice
```http
PUT /Notice/{noticeID}
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Thông báo kỳ thi - Điều chỉnh",
  "details": "..."
}

Response (200):
{ "message": "Notice updated successfully" }
```

#### Delete Notice
```http
DELETE /Notice/{noticeID}
Authorization: Bearer <token>

Response (200):
{ "message": "Notice deleted successfully" }
```

---

### 💬 Complain APIs

#### Create Complain
```http
POST /ComplainCreate
Content-Type: application/json

{
  "title": "Vấn đề về điểm số",
  "details": "Tôi muốn khiếu nại...",
  "user": "65a1b2c3d4e5f6g7h8i9j0k6",
  "school": "65a1b2c3d4e5f6g7h8i9j0k1"
}

Response (201):
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
  "title": "Vấn đề về điểm số",
  "user": { ... }
}
```

#### Get All Complains
```http
GET /ComplainList/{adminID}

Response (200):
[
  {
    "_id": "...",
    "title": "...",
    "user": { "name": "...", "role": "..." },
    "date": "..."
  },
  { ... }
]
```

---

## 💾 Cấu Trúc Database

### Admin Schema
```javascript
{
  _id: ObjectId,
  name: String,                    // Họ tên
  email: String (unique),          // Email duy nhất
  password: String (bcrypt),       // Mật khẩu mã hóa
  role: "Admin",
  schoolName: String (unique),     // Tên trường duy nhất
  createdAt: Date,
  updatedAt: Date
}
```

### Class Schema
```javascript
{
  _id: ObjectId,
  sclassName: String (e.g., "10A"),
  school: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Schema
```javascript
{
  _id: ObjectId,
  subName: String,                 // Tên môn
  subCode: String (unique),        // Mã môn
  sessions: Number,                // Số buổi tối đa
  sclassName: ObjectId (ref: Class),
  school: ObjectId (ref: Admin),
  teacher: ObjectId (ref: Teacher),
  createdAt: Date,
  updatedAt: Date
}
```

### Teacher Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt),
  role: "Teacher",
  school: ObjectId (ref: Admin),
  teachSclass: ObjectId (ref: Class),
  teachSubject: [ObjectId (ref: Subject)],
  attendance: [{
    date: Date,
    status: "Present" | "Absent"
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema
```javascript
{
  _id: ObjectId,
  name: String,
  rollNum: Number,                 // Số báo danh
  password: String (bcrypt),
  role: "Student",
  sclassName: ObjectId (ref: Class),
  sclassNames: [ObjectId],         // Nếu học nhiều lớp
  school: ObjectId (ref: Admin),
  examResult: [{
    subName: ObjectId (ref: Subject),
    marksObtained: Number          // 0-100
  }],
  attendance: [{
    date: Date,
    status: "Present" | "Absent",
    subName: ObjectId (ref: Subject)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Notice Schema
```javascript
{
  _id: ObjectId,
  title: String,
  details: String,
  date: Date,
  school: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Complain Schema
```javascript
{
  _id: ObjectId,
  title: String,
  details: String,
  date: Date,
  user: ObjectId (ref: Teacher | Student),
  userRole: "Teacher" | "Student",
  school: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Bảo Mật

### Mật Khẩu
- ✅ Mã hóa bằng **bcrypt** (10 rounds)
- ✅ Không bao giờ lưu plain-text
- ✅ Minimum 6 ký tự

### Token JWT
- ✅ Expires: 8 giờ
- ✅ Secret key: `process.env.SECRET_KEY`
- ✅ Header: `Authorization: Bearer <token>`

### Middleware
- ✅ `auth.js`: Xác thực JWT
- ✅ `authorize.js`: Kiểm tra role người dùng

### CORS
- ✅ Chỉ cho phép từ `http://localhost:3000`
- ✅ Có thể cấu hình trong `.env`

---

## ✅ Validation Rules

| Trường | Quy Tắc |
|--------|---------|
| Email | Unique, valid format |
| Mật khẩu | Min 6 ký tự |
| Số báo danh | Unique trong lớp |
| Mã môn | Unique toàn trường |
| Điểm | 0 ≤ điểm ≤ 100 |
| Chuyên cần | ≤ số buổi môn |

---

## ❌ Lỗi Thường Gặp

### 1. Port Đang Sử Dụng
**Lỗi:** `EADDRINUSE: address already in use :::5000`

**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### 2. MongoDB Connection Failed
**Lỗi:** `Cannot connect to MongoDB`

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi chạy MongoDB
mongod

# Hoặc dùng MongoDB Atlas
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/school_db
```

### 3. Vượt Quá Giới Hạn Điểm Danh
**Lỗi:** `Attendance limit exceeded`

**Giải pháp:**
- Tăng số buổi (`sessions`) của môn
- Hoặc xóa một số điểm danh cũ

### 4. Mã Môn Trùng
**Lỗi:** `Subject code already exists`

**Giải pháp:**
- Sử dụng mã môn khác (unique)
- Ví dụ: `TOAN101`, `TOAN102`, ...

### 5. Số Báo Danh Trùng
**Lỗi:** `Roll number already exists in this class`

**Giải pháp:**
- Sử dụng số báo danh khác trong lớp
- Hoặc thay đổi lớp cho học sinh

### 6. Token Hết Hạn
**Lỗi:** `JWT token expired`

**Giải pháp:**
- Đăng nhập lại
- Token sẽ được cấp mới (8 giờ)

---

## 📊 Ví Dụ Kịch Bản Sử Dụng

### Kịch Bản 1: Admin Tạo Một Lớp Hoàn Chỉnh

```
1. Admin đăng nhập
2. Tạo lớp 10A
3. Tạo 3 môn: Toán, Lý, Hóa
4. Tạo 3 giáo viên: A, B, C
5. Gán giáo viên cho môn (A→Toán, B→Lý, C→Hóa)
6. Thêm 30 học sinh vào lớp
7. Tạo thông báo về lịch học
8. Học sinh & GV xem thông báo
```

### Kịch Bản 2: Giáo Viên Quản Lý Lớp

```
1. GV đăng nhập
2. Xem danh sách 30 HS
3. Mỗi buổi: Điểm danh HS (20 buổi)
4. Nhập điểm thi sau kỳ
5. HS xem điểm & chuyên cần
6. GV gửi khiếu nại nếu có vấn đề
```

### Kịch Bản 3: Học Sinh Xem Kết Quả

```
1. HS đăng nhập
2. Xem danh sách 6 môn
3. Xem điểm: Toán 8.5, Lý 7.0, ...
4. Xem chuyên cần: 92.5%
5. Gửi khiếu nại nếu không hài lòng
6. Xem thông báo từ trường
```

---

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
# 1. Cài đặt Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Tạo app
heroku create <app-name>

# 4. Set biến môi trường
heroku config:set MONGO_URL=<mongodb_url>
heroku config:set SECRET_KEY=<secret_key>

# 5. Deploy
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
# 1. Cài đặt Vercel CLI
npm install -g vercel

# 2. Deploy
vercel
```

---

## 📞 Support & FAQ

### Q: Làm thế nào để reset mật khẩu?
**A:** Hiện tại không có chức năng reset. Admin phải tạo tài khoản mới.

### Q: Có thể học nhiều lớp không?
**A:** Có, field `sclassNames` hỗ trợ nhiều lớp.

### Q: Xóa lớp có xóa dữ liệu học sinh không?
**A:** Có, xóa lớp sẽ xóa cascade tất cả dữ liệu liên quan.

### Q: Token hết hạn sau bao lâu?
**A:** 8 giờ. Sau đó cần đăng nhập lại.

### Q: Có thể nhập điểm âm được không?
**A:** Không, điểm phải trong [0, 100].

---

## 📝 License & Author

**License:** MIT  
**Author:** Your Team  
**Phiên bản:** 1.0.0  
**Cập nhật:** 2024

---

**Cảm ơn bạn đã sử dụng MERN School Management System!** 🎉

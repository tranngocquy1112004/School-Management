## 🧾 **Chi tiết chức năng (Théo rộng)**

**1. Admin (Quản trị)** ✅
- Đăng ký / đăng nhập. (POST `/AdminReg`, POST `/AdminLogin`)
- Quản lý trường: tạo / xem / xóa / cập nhật Admin (GET/PUT/DELETE `/Admin/:id`).
- Quản lý lớp: tạo / liệt kê / xem chi tiết / xóa (POST `/SclassCreate`, GET `/SclassList/:id`, GET `/Sclass/:id`, DELETE `/Sclass/:id`).
- Quản lý môn học: tạo nhiều môn cho 1 lớp, liệt kê theo trường/lớp, xem/ xóa (POST `/SubjectCreate`, GET `/AllSubjects/:id`, GET `/ClassSubjects/:id`, GET `/Subject/:id`, DELETE `/Subject/:id`).
- Quản lý học sinh: đăng ký (StudentReg), danh sách, cập nhật, xóa (GET/PUT/DELETE `/Student(s)`).
- Quản lý giáo viên: đăng ký (TeacherReg), danh sách, cập nhật môn dạy, xóa (GET/PUT/DELETE `/Teacher(s)`, PUT `/TeacherSubject`).
- Thông báo: tạo/sửa/xóa/liệt kê (POST `/NoticeCreate`, GET `/NoticeList/:id`, PUT/DELETE `/Notice(s|:id)`).
- Khi xóa admin sẽ xóa cascade dữ liệu liên quan (lớp, học sinh, giáo viên, môn, thông báo, khiếu nại).

**2. Teacher (Giáo viên)** ✅
- Đăng ký / đăng nhập (POST `/TeacherReg`, POST `/TeacherLogin`).
- Được gán môn/lớp; có thể cập nhật môn dạy (PUT `/TeacherSubject`).
- Điểm danh giáo viên (POST `/TeacherAttendance/:id`).
- Xem chi tiết giáo viên, danh sách theo trường.

**3. Student (Học sinh)** ✅
- Đăng ký / đăng nhập (POST `/StudentReg`, POST `/StudentLogin`).
- Xem thông tin cá nhân, lớp, môn học.
- Xem / cập nhật điểm thi (PUT `/UpdateExamResult/:id`).
- Điểm danh cá nhân theo môn (PUT `/StudentAttendance/:id`).
- Các thao tác xóa / reset điểm danh cho toàn trường hoặc theo môn có sẵn endpoints (ví dụ PUT `/RemoveAllStudentsAtten/:id`).

**4. Khiếu nại & Thông báo**
- Tạo / liệt kê khiếu nại (POST `/ComplainCreate`, GET `/ComplainList/:id`).
- Tạo / liệt kê / chỉnh sửa thông báo (Notice routes như trên).


## 🔌 **Tổng quan API — một số endpoint tiêu biểu**

- POST `/AdminReg` — Tạo Admin. body: `{ name, email, schoolName, password }`.
- POST `/AdminLogin` — Đăng nhập Admin. body: `{ email, password }`.
- POST `/StudentReg` — Đăng ký học sinh. body: `{ name, rollNum, password, sclassName, adminID, ... }`.
- POST `/StudentLogin` — Đăng nhập học sinh. body: `{ rollNum, studentName, password }`.
- POST `/SubjectCreate` — Tạo môn cho lớp. body: `{ subjects: [{ subName, subCode, sessions }], sclassName, adminID }`.
- PUT `/StudentAttendance/:id` — Thêm/cập nhật điểm danh cho 1 học sinh. body: `{ subName, status, date }`.
- PUT `/UpdateExamResult/:id` — Thêm/cập nhật điểm thi cho học sinh. body: `{ subName, marksObtained }`.

> Lưu ý: nhiều endpoint trả về message khi không tìm thấy hoặc khi lỗi (ví dụ "Không tìm thấy học sinh").


## 🧭 **Hướng dẫn sử dụng nhanh (Frontend)**

1. Cài đặt & chạy backend:
   - cd `backend` → `npm install` → tạo `.env` với `MONGO_URL` và `SECRET_KEY` → `npm start`.
2. Cài đặt & chạy frontend:
   - cd `frontend` → `npm install` → (nếu cần) tạo `.env` với `REACT_APP_BASE_URL=http://localhost:5000` → `npm start`.
3. Các màn hình chính trên Frontend (theo vai trò):
   - Admin Dashboard: quản lý Lớp / Môn / Học sinh / Giáo viên / Thông báo / Khiếu nại.
   - Teacher Dashboard: xem lớp/môn, điểm danh giáo viên, xem/sửa điểm cho học sinh khi có quyền.
   - Student Dashboard: xem profile, bảng/biểu đồ điểm (`/Student/subjects`), xem điểm danh (`/Student/attendance`), gửi khiếu nại.
4. Các thao tác điển hình: thêm học sinh (Admin), thêm môn cho lớp (Admin), giáo viên chấm điểm (PUT `/UpdateExamResult/:id`), giáo viên điểm danh (POST `/TeacherAttendance/:id`).


### 🔧 Frontend scripts (Create React App)
- `npm start` — Runs the app in development mode (open http://localhost:3000). The page reloads on code changes.
- `npm test` — Launches the test runner in interactive watch mode.
- `npm run build` — Builds the app for production to the `build` folder (minified, hashed filenames).
- `npm run eject` — Ejects the create-react-app configuration (one-way operation; use with caution).

See the official Create React App docs for more details: https://facebook.github.io/create-react-app/docs/getting-started

> Note: After running `npm run build` you can deploy the `build` folder to Netlify, Vercel, or any static hosting. For Netlify set the publish directory to `build` and build command `npm run build`.


## 📌 **Ví dụ nhanh (curl)**

- Đăng nhập học sinh:

```bash
curl -X POST http://localhost:5000/StudentLogin -H "Content-Type: application/json" -d '{"rollNum":"123","studentName":"An","password":"pass"}'
```

- Thêm môn cho lớp (Admin):

```bash
curl -X POST http://localhost:5000/SubjectCreate -H "Content-Type: application/json" -d '{"subjects":[{"subName":"Toán","subCode":"MTH101","sessions":20}],"sclassName":"<classId>","adminID":"<adminId>"}'
```

- Cập nhật điểm học sinh:

```bash
curl -X PUT http://localhost:5000/UpdateExamResult/<studentId> -H "Content-Type: application/json" -d '{"subName":"<subjectId>","marksObtained":85}'
```


## 🛠️ **Ghi chú cho developer**
- Bảo mật: hiện **Teacher/Student** dùng bcrypt cho password; **Admin** hiện lưu password plaintext trong code (cần hash bằng bcrypt trước khi lưu). Đây là việc nên sửa ngay khi deploy.
- Cải tiến: thêm middleware xác thực (JWT), thêm kiểm tra quyền (role-based access control), thêm tests và Postman/OpenAPI spec.

---

## 📚 API Reference — Endpoints (Chi tiết)

Dưới đây là danh sách endpoint chi tiết theo nhóm tài nguyên. Mỗi mục gồm: METHOD, PATH, Mô tả, Body mẫu và Ghi chú/Response mẫu.

---

### ✅ Admin

- POST `/AdminReg`
  - Mô tả: Tạo tài khoản Admin.
  - Body (JSON):
    ```json
    { "name": "Tên", "email": "a@x.com", "schoolName": "Trường A", "password": "pass" }
    ```
  - Response thành công: đối tượng Admin (password được loại bỏ trong response).
  - Lỗi: `{ message: 'Email đã tồn tại' }` (email trùng), status 500 cho lỗi server.

- POST `/AdminLogin`
  - Mô tả: Đăng nhập Admin.
  - Body (JSON): `{ "email": "a@x.com", "password": "pass" }`
  - Response thành công: đối tượng Admin (password không trả về).
  - Lỗi: `{ message: "Cần email và mật khẩu" }` hoặc `{ message: "Mật khẩu không đúng" }` / `{ message: "Không tìm thấy người dùng" }`.

- GET `/Admin/:id`
  - Mô tả: Lấy chi tiết Admin theo id.
  - Response: đối tượng Admin (không chứa password) hoặc `{ message: "Không tìm thấy quản trị" }`.

- PUT `/Admin/:id`
  - Mô tả: Cập nhật thông tin Admin.
  - Body: các trường cần cập nhật (ví dụ `schoolName`, `name`).
  - Response: admin đã cập nhật hoặc message lỗi.

- DELETE `/Admin/:id`
  - Mô tả: Xóa admin và cascade xóa dữ liệu liên quan (lớp, học sinh, giáo viên, môn, thông báo, khiếu nại).

---

### ✅ Student (Học sinh)

- POST `/StudentReg`
  - Mô tả: Đăng ký học sinh.
  - Body (JSON): ví dụ
    ```json
    {
      "name": "Nguyễn A",
      "rollNum": "01234",
      "password": "pass",
      "sclassName": "<classId>",
      "adminID": "<adminId>",
      "otherFields": "..."
    }
    ```
  - Ghi chú: Password được hash trước khi lưu.

- POST `/StudentLogin`
  - Body: `{ "rollNum": "01234", "studentName": "Nguyễn A", "password": "pass" }`
  - Response: đối tượng student (không trả password, có populate `school` và `sclassName`).

- GET `/Students/:id` (id = schoolId)
  - Mô tả: Lấy danh sách học sinh theo trường.

- GET `/Student/:id`
  - Mô tả: Lấy chi tiết 1 học sinh (populate `examResult`, `attendance`, `sclassName`, `school`).

- PUT `/Student/:id`
  - Mô tả: Cập nhật thông tin học sinh (nếu cập nhật password sẽ hash mới).
  - Body: các trường cần cập nhật.

- PUT `/UpdateExamResult/:id`
  - Mô tả: Thêm hoặc cập nhật điểm cho học sinh.
  - Body: `{ "subName": "<subjectId>", "marksObtained": 85 }`
  - Response: student đã cập nhật (tùy vào kết quả save).

- PUT `/StudentAttendance/:id`
  - Mô tả: Thêm/cập nhật bản ghi điểm danh cho học sinh.
  - Body: `{ "subName": "<subjectId>", "status": "Present|Absent", "date": "YYYY-MM-DD" }`
  - Ghi chú: Controller kiểm tra giới hạn sessions của môn; nếu quá giới hạn trả `{ message: 'Đã đạt giới hạn điểm danh' }`.

- PUT `/RemoveAllStudentsSubAtten/:id` (id = subjectId)
  - Mô tả: Xóa tất cả bản ghi điểm danh của mọi học sinh cho 1 môn.

- PUT `/RemoveAllStudentsAtten/:id` (id = schoolId)
  - Mô tả: Xóa toàn bộ attendance cho tất cả học sinh của 1 trường.

- PUT `/RemoveStudentSubAtten/:id` (id = studentId)
  - Mô tả: Xóa attendance của 1 học sinh cho môn cụ thể. Body: `{ "subId": "<subjectId>" }`.

- PUT `/RemoveStudentAtten/:id` (id = studentId)
  - Mô tả: Xóa toàn bộ attendance của 1 học sinh.

- DELETE `/Students/:id` (id = schoolId)
  - Mô tả: Xóa tất cả học sinh trong 1 trường.

- DELETE `/StudentsClass/:id` (id = classId)
  - Mô tả: Xóa tất cả học sinh trong 1 lớp.

- DELETE `/Student/:id` (id = studentId)
  - Mô tả: Xóa 1 học sinh.

---

### ✅ Teacher (Giáo viên)

- POST `/TeacherReg`
  - Body (JSON):
    ```json
    { "name":"GV A", "email":"a@x.com", "password":"pass", "role":"teacher", "school":"<adminId>", "teachSubject":"<subjectId>", "teachSclass":"<classId>" }
    ```
  - Ghi chú: password được hash trước khi lưu.

- POST `/TeacherLogin`
  - Body: `{ "email":"a@x.com", "password":"pass" }`
  - Response: đối tượng teacher (populate `teachSubject`, `teachSclass`, `school`).

- GET `/Teachers/:id` (id = schoolId)
  - Mô tả: Danh sách giáo viên theo trường.

- GET `/Teacher/:id`
  - Mô tả: Chi tiết giáo viên.

- PUT `/TeacherSubject`
  - Body: `{ "teacherId": "<teacherId>", "teachSubject": "<subjectId>" }`
  - Mô tả: Gán môn mới cho giáo viên và cập nhật tài liệu Subject.

- POST `/TeacherAttendance/:id` (id = teacherId)
  - Body: `{ "status": "Present|Absent", "date": "YYYY-MM-DD" }`
  - Mô tả: Thêm/cập nhật attendance cho giáo viên.

- DELETE `/Teachers/:id` (id = schoolId) — Xóa tất cả giáo viên trường.
- DELETE `/TeachersClass/:id` (id = classId) — Xóa tất cả giáo viên theo lớp.
- DELETE `/Teacher/:id` — Xóa 1 giáo viên (và unset trường `teacher` ở subject nếu cần).

---

### ✅ Notice (Thông báo)

- POST `/NoticeCreate`
  - Body: `{ "title": "...", "details": "...", "date": "YYYY-MM-DD", "adminID": "<adminId>" }`
  - Mô tả: Tạo thông báo cho trường.

- GET `/NoticeList/:id` (id = schoolId)
  - Mô tả: Danh sách thông báo theo trường.

- PUT `/Notice/:id` — Cập nhật thông báo.
- DELETE `/Notice/:id` — Xóa 1 thông báo.
- DELETE `/Notices/:id` — Xóa tất cả thông báo của 1 trường.

---

### ✅ Complain (Khiếu nại)

- POST `/ComplainCreate`
  - Body: `{ "title": "...", "details": "...", "user": "<userId>", "school": "<schoolId>" }` (controller nhận `req.body`).

- GET `/ComplainList/:id` (id = schoolId)
  - Mô tả: Danh sách khiếu nại theo trường (populate `user` name).

---

### ✅ Sclass (Lớp)

- POST `/SclassCreate`
  - Body: `{ "sclassName": "10A", "adminID": "<adminId>" }`
  - Response: sclass mới.

- GET `/SclassList/:id` (id = schoolId)
  - Mô tả: Danh sách lớp theo trường.

- GET `/Sclass/:id` — Lấy chi tiết lớp (populate `school`).
- GET `/Sclass/Students/:id` — Lấy danh sách học sinh của lớp.
- DELETE `/Sclass/:id` — Xóa lớp (và xóa students/subjects/teachers liên quan).
- DELETE `/Sclasses/:id` — Xóa tất cả lớp của 1 trường.

---

### ✅ Subject (Môn học)

- POST `/SubjectCreate`
  - Body (JSON):
    ```json
    {
      "subjects": [{ "subName": "Toán", "subCode": "MTH101", "sessions": 20 }],
      "sclassName": "<classId>",
      "adminID": "<adminId>"
    }
    ```
  - Mô tả: Tạo nhiều môn cho một lớp.
  - Lỗi: trả `{ message: 'Mã môn đã tồn tại, vui lòng chọn mã khác' }` nếu subCode trùng.

- GET `/AllSubjects/:id` (id = schoolId) — Danh sách tất cả môn của trường.
- GET `/ClassSubjects/:id` (id = classId) — Danh sách môn của lớp.
- GET `/FreeSubjectList/:id` (id = classId) — Danh sách môn chưa có giáo viên.
- GET `/Subject/:id` — Chi tiết môn (populate `sclassName`, `teacher`).

- DELETE `/Subject/:id` — Xóa 1 môn (unset `teachSubject` trong Teacher, remove examResult & attendance objects from Student docs).
- DELETE `/Subjects/:id` (id = schoolId) — Xóa tất cả môn của trường (cập nhật teachers & students liên quan).
- DELETE `/SubjectsClass/:id` (id = classId) — Xóa tất cả môn của lớp.

---

## 📝 Response & lỗi chung
- Thông thường các API trả về đối tượng JSON (đối tượng mới/tài nguyên) khi thành công. Khi lỗi logic (ví dụ không tìm thấy) API thường trả `{ message: "Không tìm thấy ..." }`.
- Lỗi server trả status 500 cùng body lỗi chi tiết.

---

Nếu bạn muốn, mình có thể:
- Xuất phần này thành `API.md` chi tiết hoặc tạo **Postman collection** / **OpenAPI spec** tự động. Chọn 1 trong các định dạng: `API.md`, `Postman`, `OpenAPI (YAML/JSON)` và mình sẽ tạo ngay cùng ví dụ request/response.  

---


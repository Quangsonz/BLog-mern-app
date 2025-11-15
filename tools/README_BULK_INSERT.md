# HƯỚNG DẪN SỬ DỤNG BULK INSERT POSTS

## 📋 Các bước thực hiện

### Bước 1: Tạo demo users (nếu cần)
Chạy lệnh sau để tạo 10 demo users:

```bash
cd "d:\ngon ngu kich ban\blog-mern-app\tools"
node createDemoUsers.js
```

**Kết quả:** 10 users với email:
- an@demo.vn
- binh@demo.vn
- cuong@demo.vn
- dung@demo.vn
- em@demo.vn
- phuong@demo.vn
- giang@demo.vn
- ha@demo.vn
- hung@demo.vn
- lan@demo.vn

**Mật khẩu:** `123456` (cho tất cả demo users)

---

### Bước 2: Thay đổi email trong bulkInsertPosts.js
Mở file `bulkInsertPosts.js` và sửa dòng 13:

```javascript
const CURRENT_USER_EMAIL = 'son@gmail.vn'; // Thay bằng email của bạn
```

---

### Bước 3: Chạy script tạo 200 bài viết
```bash
cd "d:\ngon ngu kich ban\blog-mern-app\tools"
node bulkInsertPosts.js
```

**Script sẽ:**
- Tạo 200 bài viết cho user có email `CURRENT_USER_EMAIL`
- Mỗi bài viết có:
  - **0-30 likes ngẫu nhiên** từ users khác
  - **0-15 comments ngẫu nhiên** từ users khác
  - **Category ngẫu nhiên:** Technology, Design, Business, Lifestyle, Other
  - **Ảnh ngẫu nhiên** từ Unsplash
  - **Thời gian ngẫu nhiên** trong 60 ngày qua

---

## 🎯 Kết quả mong đợi

```
🔄 Đang kết nối tới MongoDB...
✅ Kết nối thành công!
🔍 Đang tìm user với email: son@gmail.vn...
✅ Tìm thấy user: Son Nguyen (ID: 673...)
🔍 Đang lấy danh sách tất cả users...
✅ Tìm thấy 11 users trong database
📝 Đang tạo 200 bài viết với likes và comments ngẫu nhiên...
⏳ Đang thêm 200 bài viết vào database...
✅ Đã thêm thành công: 200 bài viết cho user Son Nguyen
📊 Phân loại theo category:
   - Business: 42 bài
   - Design: 38 bài
   - Lifestyle: 41 bài
   - Other: 39 bài
   - Technology: 40 bài

📈 Thống kê tương tác:
   - Tổng likes: 3024 (Trung bình: 15.1 likes/bài)
   - Tổng comments: 1458 (Trung bình: 7.3 comments/bài)

🎉 Hoàn tất! Bạn có thể kiểm tra các bài viết trong ứng dụng.
```

---

## ⚠️ Lưu ý

1. **Cần ít nhất 2 users** trong database để tạo likes/comments
2. Nếu chỉ có 1 user, script vẫn chạy nhưng bài viết không có likes/comments
3. Script sử dụng `insertMany` nên rất nhanh (~5 giây cho 200 posts)
4. Chạy nhiều lần sẽ tạo thêm 200 posts mỗi lần (không ghi đè)

---

## 🔧 Troubleshooting

**Lỗi: "Không tìm thấy user với email"**
- Kiểm tra email trong `CURRENT_USER_EMAIL` có đúng không
- Đăng ký tài khoản trên website hoặc chạy `createDemoUsers.js`

**Lỗi: "Cannot find module 'bcryptjs'"**
```bash
cd "d:\ngon ngu kich ban\blog-mern-app\backend"
npm install bcryptjs
```

**Lỗi: "MongoDB connection error"**
- Kiểm tra `DATABASE` trong file `.env` có đúng không
- Kiểm tra kết nối internet

# 📝 Fullstack Blog - MERN Stack

> Ứng dụng blog full-stack toàn diện được xây dựng với **React**, **Material-UI**, **Node.js**, **Express**, và **MongoDB**. Bao gồm thông báo theo thời gian thực, tìm kiếm nâng cao, bảng điều khiển quản trị và UI/UX hiện đại.

![Trang chủ](frontend/src/images/home.png)
![Chi tiết bài viết](frontend/src/images/post.png)

---

## 🚀 Tính năng

### Tính năng cốt lõi
- ✅ **Xác thực & Phân quyền** - Đăng nhập/đăng ký bảo mật dựa trên JWT với kiểm soát truy cập theo vai trò (Admin/User)
- ✅ **Thông báo thời gian thực** - Thông báo trực tiếp được hỗ trợ bởi Socket.io cho lượt thích, bình luận và tương tác
- ✅ **Tìm kiếm nâng cao** - Tìm kiếm thông minh với khớp mờ, tính điểm liên quan và nhiều tùy chọn sắp xếp
- ✅ **Bảng điều khiển Admin** - Phân tích toàn diện, quản lý người dùng, quản lý bài viết và quản lý liên hệ
- ✅ **Trình soạn thảo văn bản phong phú** - Tích hợp ReactQuill để tạo bài viết blog đẹp mắt
- ✅ **Tải lên hình ảnh** - Tích hợp Cloudinary để lưu trữ và tối ưu hóa hình ảnh
- ✅ **Thiết kế responsive** - Giao diện responsive ưu tiên mobile với các component Material-UI
- ✅ **Xác thực form** - Formik & Yup cho xác thực phía client mạnh mẽ
- ✅ **Phân trang & DataGrid** - Hiển thị dữ liệu hiệu quả với @mui/x-data-grid
- ✅ **Danh mục & Thẻ** - Tổ chức bài viết theo danh mục với chủ đề thịnh hành
- ✅ **Hệ thống Like & Comment** - Tương tác thời gian thực với socket.io
- ✅ **Hồ sơ người dùng** - Hồ sơ cá nhân với tải lên avatar và theo dõi hoạt động
- ✅ **Form liên hệ** - Hệ thống quản lý liên hệ tích hợp với theo dõi trạng thái
- ✅ **Bảo mật** - Helmet, giới hạn tốc độ, bảo vệ XSS và làm sạch đầu vào

### Tính năng nâng cao
- 🔥 **Chủ đề thịnh hành** - Chủ đề thịnh hành động dựa trên mức độ tương tác bài viết
- 👥 **Người dùng được đề xuất** - Đề xuất người dùng dựa trên thuật toán
- 🎯 **Bộ lọc thông minh** - Bộ lọc danh mục và sắp xếp trên trang chủ
- 📊 **Bảng phân tích** - Thống kê chi tiết cho quản trị viên
- 🔔 **Cập nhật thời gian thực** - Lượt thích, bình luận và thông báo trực tiếp
- 🎨 **UI/UX hiện đại** - Thiết kế gradient, hiệu ứng mượt mà và điều hướng trực quan

---

## 📁 Cấu trúc dự án

```
BLog-mern-app/
│
├── 📂 backend/                          # Backend Node.js/Express server
│   ├── 📂 controllers/                  # Xử lý yêu cầu và logic nghiệp vụ
│   │   ├── authController.js           # Xác thực (đăng nhập, đăng ký, hồ sơ, đăng xuất)
│   │   ├── postController.js           # CRUD bài viết, like/unlike, bình luận, tìm kiếm, thịnh hành
│   │   ├── notificationController.js   # CRUD thông báo và các hàm hỗ trợ
│   │   └── contactController.js        # Quản lý form liên hệ
│   │
│   ├── 📂 models/                       # Mongoose schemas (Mô hình dữ liệu)
│   │   ├── userModel.js                # Schema người dùng (tên, email, mật khẩu, avatar, vai trò, phương thức JWT)
│   │   ├── postModel.js                # Schema bài viết (danh mục, nội dung, hình ảnh, lượt thích, bình luận)
│   │   ├── categoryModel.js            # Schema danh mục
│   │   ├── notificationModel.js        # Schema thông báo (người gửi, người nhận, bài viết, loại, tin nhắn)
│   │   └── contactModel.js             # Schema liên hệ (tên, email, chủ đề, tin nhắn, trạng thái)
│   │
│   ├── 📂 middleware/                   # Express middleware
│   │   ├── auth.js                     # Xác thực JWT & phân quyền admin
│   │   └── error.js                    # Middleware xử lý lỗi toàn cục
│   │
│   ├── 📂 routes/                       # Các route API
│   │   ├── authRoutes.js               # /api/signup, /api/signin, /api/logout, /api/me, /api/users
│   │   ├── postRoute.js                # /api/posts/*, /api/post/*, thịnh hành, người dùng được đề xuất
│   │   ├── notificationRoutes.js       # /api/notifications/*
│   │   └── contactRoutes.js            # /api/contacts/*, /api/contact/*
│   │
│   ├── 📂 utils/                        # Các hàm tiện ích
│   │   ├── cloudinary.js               # Cấu hình Cloudinary cho tải lên hình ảnh
│   │   └── errorResponse.js            # Class phản hồi lỗi tùy chỉnh
│   │
│   ├── app.js                           # Ứng dụng Express chính (middleware, routes, socket.io, xử lý lỗi)
│   └── .env                             # Biến môi trường (DB, JWT, Cloudinary, PORT)
│
├── 📂 frontend/                         # Ứng dụng React Frontend
│   ├── 📂 public/                       # Các file tĩnh
│   │   ├── index.html                  # Template HTML gốc
│   │   ├── manifest.json               # PWA manifest
│   │   └── robots.txt                  # File robots cho SEO
│   │
│   ├── 📂 src/                          # Mã nguồn React
│   │   │
│   │   ├── 📂 admin/                    # Trang dành cho Admin (yêu cầu vai trò admin)
│   │   │   ├── AdminDashboard.js       # Bảng phân tích (thống kê, biểu đồ, bài viết/người dùng hàng đầu)
│   │   │   ├── CreatePost.js           # Form tạo bài viết blog mới (ReactQuill, Dropzone)
│   │   │   ├── EditPost.js             # Form chỉnh sửa bài viết hiện có
│   │   │   ├── ManagePosts.js          # DataGrid quản lý tất cả bài viết (sửa, xóa, tìm kiếm)
│   │   │   ├── ManageUsers.js          # DataGrid quản lý người dùng (đổi vai trò, xóa)
│   │   │   ├── ManageContacts.js       # Quản lý tin nhắn liên hệ (trả lời, đổi trạng thái)
│   │   │   │
│   │   │   └── 📂 global/               # Các component layout Admin
│   │   │       ├── Layout.js            # HOC wrapper cho trang admin (Sidebar + HeaderTop)
│   │   │       ├── HeaderTop.js         # Header admin với nút toggle sidebar
│   │   │       └── Sidebar.js           # Sidebar điều hướng admin (ProSidebar)
│   │   │
│   │   ├── 📂 components/               # Các component React có thể tái sử dụng
│   │   │   ├── Navbar.js                # Thanh điều hướng chính (tìm kiếm, thông báo, menu người dùng)
│   │   │   ├── Footer.js                # Footer với liên kết và mạng xã hội
│   │   │   ├── PostCard.js              # Card bài viết kiểu Instagram (like, comment, edit/delete)
│   │   │   ├── CommentList.js           # Component hiển thị một bình luận
│   │   │   ├── NotificationMenu.js      # Menu dropdown thông báo với cập nhật thời gian thực
│   │   │   ├── SmartSearch.jsx          # Component tìm kiếm nâng cao với tự động hoàn thành
│   │   │   ├── Loader.js                # Component vòng xoay loading
│   │   │   ├── AdminRoute.js            # Wrapper (lớp bọc) route bảo vệ cho trang admin
│   │   │   ├── UserRoute.js             # Wrapper route bảo vệ cho người dùng đã xác thực
│   │   │   └── moduleToolbar.js         # Cấu hình thanh công cụ ReactQuill
│   │   │
│   │   ├── 📂 pages/                    # Các trang chính của ứng dụng
│   │   │   ├── Home.js                  # Trang chủ (nguồn cấp bài viết, sidebar thịnh hành, bộ lọc, tạo bài viết)
│   │   │   ├── SinglePost.js            # Trang chi tiết bài viết (nội dung đầy đủ, bình luận, edit/delete)
│   │   │   ├── SearchResults.js         # Trang kết quả tìm kiếm với bộ lọc nâng cao
│   │   │   ├── Profile.js               # Trang hồ sơ người dùng (sửa thông tin, tải avatar, đổi mật khẩu)
│   │   │   ├── AuthPage.js              # Trang Đăng nhập/Đăng ký với chuyển đổi (xác thực Formik)
│   │   │   ├── EditPostUser.js          # Trang chỉnh sửa bài viết của người dùng
│   │   │   ├── About.js                 # Trang Giới thiệu
│   │   │   ├── Contact.js               # Trang form liên hệ
│   │   │   ├── Privacy.js               # Trang Chính sách bảo mật
│   │   │   ├── NotFound.js              # Trang lỗi 404
│   │   │   └── 📂 LayoutPage/
│   │   │       └── Layout.js            # Wrapper layout chung
│   │   │
│   │   ├── 📂 redux/                    # Quản lý state Redux
│   │   │   ├── store.js                 # Cấu hình Redux store (reducers, middleware, devtools)
│   │   │   │
│   │   │   ├── 📂 actions/              # Redux action creators
│   │   │   │   ├── userAction.js        # Actions người dùng (login, register, logout, profile)
│   │   │   │   └── notificationActions.js # Actions thông báo (load, đánh dấu đã đọc, thêm mới)
│   │   │   │
│   │   │   ├── 📂 constants/            # Các hằng số kiểu action Redux
│   │   │   │   └── userConstant.js      # Các kiểu action người dùng (SIGNIN, SIGNUP, LOGOUT, LOAD)
│   │   │   │
│   │   │   └── 📂 reducers/             # Redux reducers
│   │   │       ├── userReducer.js       # Reducers người dùng (signIn, signUp, profile, logout)
│   │   │       └── notificationReducer.js # Reducer thông báo (load, đánh dấu đã đọc, thêm mới)
│   │   │
│   │   ├── 📂 user/                     # Bảng điều khiển người dùng
│   │   │   └── UserDashboard.js         # Trang bảng điều khiển người dùng (tóm tắt hồ sơ)
│   │   │
│   │   ├── App.js                       # Ứng dụng React chính (routes, providers)
│   │   ├── App.css                      # Styles toàn cục của app
│   │   ├── index.js                     # Điểm vào React (render App)
│   │   ├── index.css                    # Styles CSS toàn cục
│   │   └── setupTests.js                # Cấu hình testing Jest
│   │
│   ├── package.json                     # Các phụ thuộc Frontend
│   └── .env                             # Biến môi trường Frontend (cấu hình proxy)
│
├── 📄 package.json                      # package.json gốc (scripts)
├── 📄 README.md                         # Tài liệu dự án (file này)
├── 📄 FILTER_FEATURE_DOCUMENTATION.md   # Tài liệu tính năng lọc & sắp xếp
├── 📄 MIGRATION_NOTES.md                # Ghi chú di chuyển cho socket.io và tính năng
└── 📄 SEARCH_ALGORITHMS_ANALYSIS.md     # Chi tiết triển khai thuật toán tìm kiếm
```

---

## 🔗 Mối quan hệ giữa các File & Luồng dữ liệu

### Kiến trúc Backend

#### **1. Điểm vào: `app.js`**
```
app.js → Khởi tạo Express server
    ↓
    ├── Kết nối MongoDB
    ├── Thiết lập middleware (helmet, cors, rate limiting, mongoSanitize)
    ├── Cấu hình Socket.io cho tính năng thời gian thực
    ├── Gắn các API routes
    └── Khởi động trình xử lý lỗi toàn cục
```

#### **2. Luồng Route**
```
Yêu cầu Client → Routes → Middleware (auth.js) → Controllers → Models → Database
                                    ↓
                                Phản hồi
```

**Ví dụ: Tạo một bài viết**
```
POST /api/post/create
    ↓
postRoute.js → isAuthenticated middleware (auth.js)
    ↓
postController.js → createPost()
    ↓
postModel.js → Xác thực schema Mongoose
    ↓
MongoDB → Lưu bài viết
    ↓
cloudinary.js → Tải lên hình ảnh (nếu có)
    ↓
Socket.io → Phát thông báo đến người theo dõi
    ↓
Phản hồi → { success: true, post: {...} }
```

#### **3. Luồng xác thực**
```
authRoutes.js:
    ├── POST /api/signup → authController.signup() → userModel.create()
    ├── POST /api/signin → authController.signin() → userModel.findOne() → JWT token
    ├── GET /api/logout → authController.logout() → Xóa cookie
    └── GET /api/me → isAuthenticated → authController.userProfile()
```

#### **4. Tính năng thời gian thực (Socket.io)**
```
app.js → Khởi tạo Socket.io
    ↓
Controllers phát ra sự kiện:
    ├── postController.js → socket.emit('add-like', updatedPost)
    ├── postController.js → socket.emit('remove-like', updatedPost)
    ├── postController.js → socket.emit('new-comment', updatedComments)
    └── notificationController.js → socket.emit('new-notification', notification)
    ↓
Frontend lắng nghe (Navbar.js, Home.js, SinglePost.js) nhận cập nhật
```

### Kiến trúc Frontend

#### **1. Điểm vào: `index.js` → `App.js`**
```
index.js → Render <App />
    ↓
App.js:
    ├── Provider (Redux store)
    ├── ProSidebarProvider (Admin sidebar)
    ├── BrowserRouter (React Router)
    └── ToastContainer (Thông báo)
```

#### **2. Quản lý State Redux**
```
store.js → Kết hợp reducers
    ↓
    ├── userReducer.js (signIn, signUp, profile, logout)
    └── notificationReducer.js (notifications, unreadCount)
    ↓
Actions (userAction.js, notificationActions.js):
    ├── Gọi API với axios
    ├── Dispatch actions đến reducers
    └── Cập nhật state toàn cục
    ↓
Components kết nối qua useSelector/useDispatch
```

**Ví dụ: Luồng đăng nhập người dùng**
```
AuthPage.js (Form đăng nhập)
    ↓
userAction.js → userSignInAction()
    ↓
API: POST /api/signin
    ↓
authController.js → Xác thực thông tin → Tạo JWT
    ↓
Redux: USER_SIGNIN_SUCCESS → Cập nhật store
    ↓
localStorage.setItem('userInfo', data)
    ↓
Điều hướng đến Home → Navbar hiển thị người dùng đã đăng nhập
```

#### **3. Hệ thống phân cấp Component**

**Trang công khai:**
```
App.js
    └── Routes
        ├── Home.js (Nguồn cấp chính)
        │   ├── Navbar.js (Điều hướng, tìm kiếm, thông báo)
        │   ├── PostCard.js (Hiển thị bài viết riêng lẻ)
        │   ├── SmartSearch.jsx (Thanh tìm kiếm)
        │   └── Footer.js (Liên kết footer)
        │
        ├── SinglePost.js (Chi tiết bài viết)
        │   ├── Navbar.js
        │   ├── CommentList.js (Các mục bình luận)
        │   └── Footer.js
        │
        ├── SearchResults.js (Kết quả tìm kiếm)
        │   ├── Navbar.js
        │   ├── SmartSearch.jsx
        │   ├── PostCard.js (Kết quả)
        │   └── Footer.js
        │
        └── AuthPage.js (Đăng nhập/Đăng ký)
```

**Trang người dùng được bảo vệ:**
```
UserRoute.js (Wrapper bảo vệ)
    └── Profile.js (Chỉnh sửa hồ sơ người dùng)
        └── Navbar.js + Footer.js
```

**Trang Admin:**
```
AdminRoute.js (Wrapper chỉ dành cho admin)
    └── Layout.js (Admin HOC)
        ├── Sidebar.js (Điều hướng)
        ├── HeaderTop.js (Header)
        └── Trang Admin:
            ├── AdminDashboard.js (Phân tích)
            ├── ManagePosts.js (Quản lý bài viết)
            ├── ManageUsers.js (Quản lý người dùng)
            ├── ManageContacts.js (Quản lý liên hệ)
            ├── CreatePost.js (Tạo bài viết)
            └── EditPost.js (Sửa bài viết)
```

#### **4. Luồng cập nhật thời gian thực**
```
Kết nối Socket.io (Navbar.js, Home.js):
    ↓
Backend phát ra sự kiện → Frontend lắng nghe
    ↓
Cập nhật state local → Render lại component
    ↓
Ví dụ: Thông báo Like
        Backend: postController → socket.emit('new-notification')
        Frontend: NotificationMenu.js → Nhận → Tăng số đếm badge
```

---

## 🔧 Giải thích chi tiết các File quan trọng

### Các File cốt lõi Backend

#### **`app.js`** - Cấu hình Server chính
- Khởi tạo ứng dụng Express
- Kết nối MongoDB sử dụng Mongoose
- Thiết lập middleware: helmet (bảo mật), cors, body-parser, cookie-parser, rate limiting
- Cấu hình Socket.io cho tính năng thời gian thực
- Gắn các API routes (`/api/*`)
- Triển khai xử lý lỗi toàn cục
- Khởi động HTTP server trên cổng đã cấu hình

#### **`controllers/authController.js`** - Logic xác thực
- **signup()**: Đăng ký người dùng mới, mã hóa mật khẩu với bcrypt
- **signin()**: Xác thực thông tin đăng nhập, tạo JWT token, đặt HTTP-only cookie
- **logout()**: Xóa cookie xác thực
- **userProfile()**: Lấy thông tin chi tiết người dùng đã đăng nhập
- **updateUserProfile()**: Cập nhật thông tin người dùng và mật khẩu
- **uploadAvatar()**: Tải avatar người dùng lên Cloudinary
- **getAllUsers()**: Admin - lấy tất cả người dùng
- **updateUserRole()**: Admin - thay đổi vai trò người dùng
- **deleteUser()**: Admin - xóa tài khoản người dùng

#### **`controllers/postController.js`** - Quản lý bài viết
- **createPost()**: Tạo bài viết mới với tải hình ảnh lên Cloudinary
- **singlePost()**: Lấy bài viết đơn theo ID với thông tin tác giả đầy đủ
- **showPosts()**: Lấy tất cả bài viết với phân trang
- **userPosts()**: Lấy bài viết của người dùng cụ thể
- **deletePost()**: Xóa bài viết và hình ảnh liên quan
- **updatePost()**: Cập nhật nội dung/hình ảnh bài viết
- **addLike()**: Thêm lượt thích cho bài viết (thời gian thực qua socket.io)
- **removeLike()**: Xóa lượt thích khỏi bài viết
- **addComment()**: Thêm bình luận cho bài viết (thời gian thực qua socket.io)
- **searchPosts()**: Tìm kiếm nâng cao với khớp mờ và tính điểm liên quan
- **getTrendingTopics()**: Lấy danh mục thịnh hành dựa trên mức độ tương tác
- **getSuggestedUsers()**: Lấy người dùng được đề xuất dựa trên hoạt động

#### **`models/userModel.js`** - Schema người dùng
- Các trường: name, email, password (đã mã hóa), avatar (Cloudinary), role (user/admin)
- Pre-save hook: Mã hóa mật khẩu với bcrypt trước khi lưu
- Các phương thức:
  - `comparePassword()`: So sánh mật khẩu đăng nhập với mật khẩu đã mã hóa
  - `getJwtToken()`: Tạo JWT token với ID người dùng
  - `posts` virtual: Điền các bài viết của người dùng

#### **`models/postModel.js`** - Schema bài viết
- Các trường: category, content (HTML), image (Cloudinary), likes[], comments[], postedBy (ref: User)
- Timestamps: createdAt, updatedAt
- Các trường được điền: postedBy với thông tin chi tiết người dùng
- Virtual: Tính toán điểm tương tác

#### **`middleware/auth.js`** - Middleware xác thực
- **isAuthenticated()**: Xác minh JWT token từ cookie, gắn user vào req
- **isAdmin()**: Kiểm tra xem người dùng đã xác thực có vai trò admin không
- Được sử dụng để bảo vệ các route yêu cầu đăng nhập hoặc quyền truy cập admin

### Các File cốt lõi Frontend

#### **`App.js`** - Router ứng dụng chính
- Bọc ứng dụng với Redux Provider, ProSidebarProvider, BrowserRouter
- Định nghĩa tất cả các routes của ứng dụng (công khai, người dùng được bảo vệ, admin được bảo vệ)
- Sử dụng mẫu HOC cho các trang admin (Layout wrapper)
- Tích hợp ToastContainer cho thông báo toàn cục

#### **`redux/store.js`** - Cấu hình Redux Store
- Kết hợp các reducers: signIn, signUp, logOut, userProfile, notifications
- Khởi tạo state từ localStorage (duy trì đăng nhập người dùng)
- Áp dụng thunk middleware cho các action bất đồng bộ
- Tích hợp Redux DevTools để debug

#### **`redux/actions/userAction.js`** - Actions người dùng
- **userSignInAction()**: POST /api/signin, lưu vào localStorage, dispatch success
- **userSignUpAction()**: POST /api/signup, hiển thị thông báo thành công
- **userLogoutAction()**: GET /api/logout, xóa khỏi localStorage
- **userProfileAction()**: GET /api/me, tải dữ liệu hồ sơ người dùng

#### **`redux/actions/notificationActions.js`** - Actions thông báo
- **notificationsLoadAction()**: GET /api/notifications, tải tất cả thông báo
- **markNotificationReadAction()**: PUT /api/notifications/:id/read
- **markAllNotificationsReadAction()**: PUT /api/notifications/read-all
- **addNewNotification()**: Thêm thông báo mới từ socket.io

#### **`components/Navbar.js`** - Điều hướng chính
- Thanh điều hướng responsive với logo, liên kết menu
- Tích hợp component SmartSearch
- NotificationMenu với số đếm badge thời gian thực
- Menu người dùng với hồ sơ, bảng điều khiển admin (nếu là admin), đăng xuất
- Lắng nghe Socket.io cho thông báo mới
- Tải hồ sơ người dùng và thông báo khi mount

#### **`components/PostCard.js`** - Card bài viết kiểu Instagram
- Hiển thị bài viết với avatar tác giả, tên, danh mục, thời gian
- Nội dung với "Đọc thêm" mở rộng/thu gọn
- Hiển thị hình ảnh (nếu có)
- Nút thích/bỏ thích với biểu tượng trái tim (màu đỏ khi đã thích)
- Số lượng bình luận và liên kết đến chi tiết bài viết
- Menu Sửa/Xóa cho chủ bài viết hoặc admin
- Xử lý socket.io cho cập nhật lượt thích thời gian thực

#### **`components/NotificationMenu.js`** - Menu dropdown thông báo
- Badge với số lượng chưa đọc
- Menu dropdown với danh sách thông báo
- Click thông báo → đánh dấu đã đọc → điều hướng đến bài viết
- Nút "Đánh dấu tất cả đã đọc"
- Cập nhật thời gian thực qua socket.io
- Thời gian với định dạng "cách đây"

#### **`pages/Home.js`** - Nguồn cấp trang chủ
- Bố cục ba cột: Sidebar bộ lọc | Nguồn cấp bài viết | Sidebar thịnh hành
- **Sidebar trái**: Bộ lọc danh mục, tùy chọn sắp xếp (Mới nhất, Phổ biến nhất, Nhiều bình luận nhất)
- **Trung tâm**: Nguồn cấp bài viết (một bài viết mỗi hàng), nút tạo bài viết, hiển thị bộ lọc đang hoạt động
- **Sidebar phải**: Chủ đề thịnh hành (dữ liệu thực), người dùng được đề xuất (dữ liệu thực)
- Lắng nghe Socket.io cho cập nhật lượt thích thời gian thực
- Bảo vệ giới hạn tốc độ với xử lý lỗi
- Responsive: Ẩn sidebar trên mobile

#### **`pages/SinglePost.js`** - Trang chi tiết bài viết
- Nội dung bài viết đầy đủ với render HTML
- Thông tin tác giả và thời gian
- Menu Sửa/Xóa cho chủ sở hữu hoặc admin
- Phần bình luận với form (chỉ người dùng đã xác thực)
- Cập nhật bình luận thời gian thực qua socket.io
- Cập nhật UI lạc quan cho bình luận
- Sidebar phải với thống kê bài viết

#### **`pages/SearchResults.js`** - Kết quả tìm kiếm
- Tích hợp thanh tìm kiếm thông minh
- Banner thông tin tìm kiếm với số lượng kết quả
- Chuyển đổi sắp xếp: Liên quan, Gần đây nhất, Phổ biến nhất
- Phân trang cho kết quả
- Huy hiệu "Khớp tốt nhất" cho điểm liên quan cao
- Trạng thái rỗng với gợi ý

#### **`pages/Profile.js`** - Hồ sơ người dùng
- Bố cục hai cột: Card hồ sơ | Form chỉnh sửa
- Tải lên avatar với xem trước (Cloudinary)
- Chuyển đổi chế độ chỉnh sửa cho thông tin hồ sơ
- Phần đổi mật khẩu (tùy chọn)
- Huy hiệu vai trò (Admin/User)
- Ngày tham gia

#### **`admin/AdminDashboard.js`** - Bảng phân tích
- Các card thống kê: Tổng bài viết, người dùng, liên hệ, lượt thích, bình luận
- Chỉ số tăng trưởng (xu hướng tăng/giảm)
- Danh mục hàng đầu với thanh tiến trình
- Bài viết có hiệu suất tốt nhất
- Người đóng góp tích cực nhất
- Dữ liệu thời gian thực từ API
- Bố cục lưới responsive

#### **`admin/ManagePosts.js`** - Quản lý bài viết
- Bảng DataGrid với tất cả bài viết
- Thanh tìm kiếm để lọc
- Các cột: Hình ảnh, Tiêu đề, Danh mục, Tác giả, Lượt thích, Bình luận, Ngày
- Hành động: Sửa, Xóa
- Nút "Tạo bài viết mới"
- Lựa chọn checkbox cho hành động hàng loạt

#### **`admin/ManageUsers.js`** - Quản lý người dùng
- Bảng DataGrid với tất cả người dùng
- Thanh tìm kiếm để lọc
- Các cột: Người dùng (avatar + tên + email), Vai trò, Bài viết, Lượt thích, Bình luận, Ngày tham gia, Trạng thái
- Hành động: Đổi vai trò, Xóa
- Dialog đổi vai trò (User ↔ Admin)
- Trạng thái Hoạt động/Không hoạt động dựa trên hoạt động cuối cùng

#### **`admin/ManageContacts.js`** - Quản lý liên hệ
- Các card thống kê: Tổng, Đang chờ, Đã trả lời, Đã đóng
- Bảng DataGrid với tất cả tin nhắn liên hệ
- Thanh tìm kiếm và bộ lọc trạng thái
- Hành động: Xem chi tiết, Trả lời/Cập nhật trạng thái, Xóa
- Dialog xem với chi tiết tin nhắn đầy đủ
- Dialog trả lời với thay đổi trạng thái và tin nhắn

---

## 🔄 Các API Endpoints

### Routes xác thực (`/api`)
```javascript
POST   /api/signup              // Đăng ký người dùng mới
POST   /api/signin              // Đăng nhập người dùng (trả về JWT cookie)
GET    /api/logout              // Đăng xuất người dùng (xóa cookie)
GET    /api/me                  // Lấy hồ sơ người dùng hiện tại (được bảo vệ)
PUT    /api/user/update         // Cập nhật hồ sơ người dùng (được bảo vệ)
PUT    /api/update/avatar       // Tải lên/cập nhật avatar (được bảo vệ)
GET    /api/users               // Lấy tất cả người dùng (chỉ admin)
PUT    /api/user/role/:id       // Cập nhật vai trò người dùng (chỉ admin)
DELETE /api/user/delete/:id     // Xóa người dùng (chỉ admin)
```

### Routes bài viết (`/api`)
```javascript
GET    /api/posts/show          // Lấy tất cả bài viết (có phân trang)
GET    /api/post/:id            // Lấy bài viết đơn theo ID
POST   /api/post/create         // Tạo bài viết mới (được bảo vệ)
PUT    /api/post/update/:id     // Cập nhật bài viết (được bảo vệ, chủ sở hữu/admin)
DELETE /api/post/delete/:id     // Xóa bài viết (được bảo vệ, chủ sở hữu/admin)
DELETE /api/delete/post/:id     // Xóa bài viết (chỉ admin)
PUT    /api/addlike/post/:id    // Thêm lượt thích cho bài viết (được bảo vệ)
PUT    /api/removelike/post/:id // Xóa lượt thích khỏi bài viết (được bảo vệ)
PUT    /api/comment/post/:id    // Thêm bình luận cho bài viết (được bảo vệ)
GET    /api/posts/user/:id      // Lấy bài viết theo người dùng
GET    /api/posts/search        // Tìm kiếm bài viết (query params: query, sortBy, page, limit)
GET    /api/posts/trending-topics // Lấy danh mục thịnh hành
GET    /api/posts/suggested-users // Lấy người dùng được đề xuất
```

### Routes thông báo (`/api`)
```javascript
GET    /api/notifications       // Lấy tất cả thông báo (được bảo vệ)
PUT    /api/notifications/:id/read // Đánh dấu thông báo đã đọc (được bảo vệ)
PUT    /api/notifications/read-all // Đánh dấu tất cả đã đọc (được bảo vệ)
POST   /api/notification/create // Tạo thông báo (sử dụng nội bộ)
```

### Routes liên hệ (`/api`)
```javascript
GET    /api/contacts            // Lấy tất cả liên hệ (chỉ admin)
POST   /api/contact/create      // Tạo tin nhắn liên hệ (công khai)
PUT    /api/contact/status/:id  // Cập nhật trạng thái liên hệ (chỉ admin)
DELETE /api/contact/delete/:id  // Xóa liên hệ (chỉ admin)
```

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Môi trường chạy JavaScript
- **Express.js** - Framework web
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Mongoose** - ODM cho MongoDB
- **Socket.io** - Giao tiếp hai chiều thời gian thực
- **JWT** - JSON Web Tokens cho xác thực
- **bcryptjs** - Mã hóa mật khẩu
- **Cloudinary** - Tải lên và lưu trữ hình ảnh
- **helmet** - Middleware bảo mật
- **express-rate-limit** - Giới hạn tốc độ request
- **express-mongo-sanitize** - Ngăn chặn NoSQL injection
- **hpp** - Bảo vệ chống ô nhiễm tham số HTTP
- **cors** - Chia sẻ tài nguyên giữa các nguồn
- **cookie-parser** - Phân tích cookie
- **dotenv** - Biến môi trường

### Frontend
- **React 18** - Thư viện UI
- **Material-UI (MUI)** - Thư viện component
- **Redux** - Quản lý trạng thái
- **Redux Thunk** - Middleware xử lý action bất đồng bộ
- **React Router v6** - Định tuyến
- **Socket.io-client** - Client thời gian thực
- **Axios** - HTTP client
- **Formik** - Xử lý form
- **Yup** - Validation form
- **ReactQuill** - Trình soạn thảo văn bản phong phú
- **react-dropzone** - Tải lên file
- **react-toastify** - Thông báo toast
- **react-pro-sidebar** - Sidebar admin
- **@mui/x-data-grid** - Bảng dữ liệu
- **moment** - Định dạng ngày tháng

---


🔍 Thuật toán tìm kiếm
Dự án sử dụng tính năng tìm kiếm thông minh cho bài viết dựa trên text search và aggregation pipeline của MongoDB. Khi người dùng nhập từ khóa, backend sử dụng toán tử $text của MongoDB để tìm kiếm trên các trường liên quan (ví dụ: tiêu đề, nội dung) và sắp xếp kết quả theo độ phù hợp. Để lọc nâng cao và sắp xếp, aggregation pipeline được dùng để kết hợp tìm kiếm, lọc theo danh mục và phân trang hiệu quả.

Kỹ thuật chính:

Nhận yêu cầu tìm kiếm/tổng hợp từ frontend
Người dùng nhập từ khóa, chọn bộ lọc, hoặc yêu cầu thống kê (ví dụ: tìm bài viết, xem top danh mục).

Backend nhận request và xây dựng pipeline
Controller (ví dụ: postController.js) tạo một mảng các stage cho pipeline, gồm các bước như:

$match: Lọc dữ liệu theo điều kiện (từ khóa, danh mục, trạng thái…)
$sort: Sắp xếp kết quả (theo thời gian, độ phù hợp…)
$skip và $limit: Phân trang kết quả.
$group: Nhóm dữ liệu để thống kê (ví dụ: đếm số bài theo user hoặc danh mục).
$project: Chọn trường cần trả về.
Gửi pipeline cho MongoDB xử lý
Sử dụng phương thức .aggregate(pipeline) của Mongoose Model để thực thi pipeline.

Nhận kết quả và trả về cho frontend
Backend nhận kết quả đã tổng hợp/tìm kiếm, trả về cho frontend để hiển thị cho người dùng.

Frontend hiển thị dữ liệu
Giao diện nhận dữ liệu đã được xử lý, hiển thị kết quả tìm kiếm, thống kê, hoặc danh sách bài viết.
## 🚦 Bắt đầu

### Yêu cầu
- Node.js (v14 hoặc cao hơn)
- MongoDB (cục bộ hoặc MongoDB Atlas)
- Tài khoản Cloudinary (để tải lên hình ảnh)

### Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/Quangsonz/BLog-mern-app.git
   cd BLog-mern-app
   ```

2. **Cài đặt Backend**
   ```bash
   cd backend
   npm install
   ```

   Tạo file `.env` trong thư mục `backend/`:
   ```env
   PORT=9000
   DATABASE=mongodb://localhost:27017/blog-mern
   # Hoặc MongoDB Atlas:
   # DATABASE=mongodb+srv://username:password@cluster.mongodb.net/blog-mern
   
   JWT_SECRET=your_jwt_secret_key_here
   EXPIRE_TOKEN=7d
   
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   
   NODE_ENV=development
   ```

3. **Cài đặt Frontend**
   ```bash
   cd frontend
   npm install
   ```

   Tạo file `.env` trong thư mục `frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:9000
   ```

   Cập nhật proxy trong `package.json` (nếu cần):
   ```json
   "proxy": "http://localhost:9000"
   ```

4. **Chạy ứng dụng**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   # Hoặc dùng nodemon cho môi trường phát triển:
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

5. **Truy cập ứng dụng**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:9000`

### Tài khoản Admin mặc định
Sau khi chạy lần đầu, tạo tài khoản admin thủ công hoặc đăng ký và cập nhật trong MongoDB:
```javascript
// Trong MongoDB, cập nhật vai trò người dùng:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📝 Hướng dẫn sử dụng

### Dành cho người dùng
1. **Đăng ký** - Tạo tài khoản trên trang đăng ký
2. **Đăng nhập** - Đăng nhập với thông tin xác thực của bạn
3. **Xem bài viết** - Xem bài viết trên trang chủ, lọc theo danh mục, sắp xếp theo mới nhất/phổ biến
4. **Tạo bài viết** - Nhấp vào nút "Tạo bài viết", điền danh mục, nội dung và hình ảnh tùy chọn
5. **Thích & Bình luận** - Tương tác với bài viết bằng cách thích và bình luận
6. **Tìm kiếm** - Sử dụng thanh tìm kiếm thông minh để tìm bài viết
7. **Hồ sơ** - Cập nhật hồ sơ, đổi mật khẩu, tải lên avatar
8. **Thông báo** - Nhận thông báo thời gian thực cho lượt thích và bình luận

### Dành cho quản trị viên
1. **Truy cập bảng điều khiển Admin** - Nhấp vào "Bảng điều khiển Admin" trong menu người dùng
2. **Xem phân tích** - Xem số liệu thống kê toàn diện trên bảng điều khiển
3. **Quản lý bài viết** - Xem, chỉnh sửa, xóa bất kỳ bài viết nào
4. **Quản lý người dùng** - Xem tất cả người dùng, thay đổi vai trò, xóa tài khoản
5. **Quản lý liên hệ** - Xem tin nhắn liên hệ, trả lời, thay đổi trạng thái
6. **Tạo nội dung** - Tạo và chỉnh sửa bài viết thông qua bảng điều khiển admin

---

## 🔐 Tính năng bảo mật

1. **Xác thực**
   - Token JWT được lưu trong HTTP-only cookies
   - Mã hóa mật khẩu bằng bcrypt (10 salt rounds)
   - Đăng xuất an toàn với xóa cookie

2. **Phân quyền**
   - Kiểm soát truy cập dựa trên vai trò (User/Admin)
   - Routes được bảo vệ bằng middleware
   - Route guards ở frontend (AdminRoute, UserRoute)

3. **Validation đầu vào**
   - Validation Formik + Yup ở frontend
   - Validation schema Mongoose
   - Express-validator cho API inputs

4. **Middleware bảo mật**
   - Helmet.js cho HTTP headers
   - Cấu hình CORS
   - Giới hạn tốc độ (100 requests mỗi 15 phút)
   - Ngăn chặn MongoDB injection
   - Bảo vệ XSS
   - Bảo vệ chống ô nhiễm tham số HTTP

5. **Bảo vệ dữ liệu**
   - Mật khẩu không bao giờ được gửi trong response
   - Làm sạch dữ liệu người dùng
   - Tải lên hình ảnh an toàn lên Cloudinary

---

## 🧪 Kiểm thử

```bash
# Chạy test frontend
cd frontend
npm test

# Chạy test backend (nếu đã cấu hình)
cd backend
npm test
```

---

## 📦 Triển khai

### Triển khai Backend (Heroku/Railway/Render)
1. Thiết lập biến môi trường trên nền tảng
2. Đảm bảo chuỗi kết nối MongoDB Atlas
3. Đặt `NODE_ENV=production`
4. Triển khai backend

### Triển khai Frontend (Vercel/Netlify)
1. Build production: `npm run build`
2. Thiết lập biến môi trường
3. Cấu hình redirects cho React Router
4. Triển khai frontend











// Script: createDemoUsers.js
// Tác dụng: Tạo 30 demo users để test likes và comments

const mongoose = require('mongoose');
const User = require('../backend/models/userModel');
require('dotenv').config({ path: '../backend/.env' });

// Lấy URI từ .env
const MONGO_URI = process.env.DATABASE || 'mongodb+srv://np21062004_db_user:datphung84@blogweb.cmqkouu.mongodb.net/blog-mern-app?retryWrites=true&w=majority&appName=blogweb';

// Danh sách demo users
const demoUsers = [
  { name: 'Nguyễn Văn An', email: 'an@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=11', public_id: 'demo_avatar_11' } },
  { name: 'Trần Thị Bình', email: 'binh@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=5', public_id: 'demo_avatar_5' } },
  { name: 'Lê Văn Cường', email: 'cuong@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=13', public_id: 'demo_avatar_13' } },
  { name: 'Phạm Thị Dung', email: 'dung@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=9', public_id: 'demo_avatar_9' } },
  { name: 'Hoàng Văn Em', email: 'em@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=12', public_id: 'demo_avatar_12' } },
  { name: 'Võ Thị Phương', email: 'phuong@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=10', public_id: 'demo_avatar_10' } },
  { name: 'Đặng Văn Giang', email: 'giang@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=15', public_id: 'demo_avatar_15' } },
  { name: 'Bùi Thị Hà', email: 'ha@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=20', public_id: 'demo_avatar_20' } },
  { name: 'Ngô Văn Hùng', email: 'hung@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=14', public_id: 'demo_avatar_14' } },
  { name: 'Đinh Thị Lan', email: 'lan@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=16', public_id: 'demo_avatar_16' } },
  { name: 'Trần Văn Minh', email: 'minh@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=17', public_id: 'demo_avatar_17' } },
  { name: 'Nguyễn Thị Nga', email: 'nga@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=18', public_id: 'demo_avatar_18' } },
  { name: 'Lý Văn Oanh', email: 'oanh@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=19', public_id: 'demo_avatar_19' } },
  { name: 'Phan Văn Phúc', email: 'phuc@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=21', public_id: 'demo_avatar_21' } },
  { name: 'Vũ Thị Quỳnh', email: 'quynh@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=22', public_id: 'demo_avatar_22' } },
  { name: 'Đỗ Văn Rồng', email: 'rong@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=23', public_id: 'demo_avatar_23' } },
  { name: 'Cao Thị Sen', email: 'sen@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=24', public_id: 'demo_avatar_24' } },
  { name: 'Mai Văn Tài', email: 'tai@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=25', public_id: 'demo_avatar_25' } },
  { name: 'Hồ Thị Uyên', email: 'uyen@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=26', public_id: 'demo_avatar_26' } },
  { name: 'Tô Văn Việt', email: 'viet@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=27', public_id: 'demo_avatar_27' } },
  { name: 'Lưu Thị Xuân', email: 'xuan@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=28', public_id: 'demo_avatar_28' } },
  { name: 'Dương Văn Yên', email: 'yen@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=29', public_id: 'demo_avatar_29' } },
  { name: 'Chu Thị Ánh', email: 'anh@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=30', public_id: 'demo_avatar_30' } },
  { name: 'Hà Văn Bảo', email: 'bao@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=31', public_id: 'demo_avatar_31' } },
  { name: 'Kim Thị Chi', email: 'chi@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=32', public_id: 'demo_avatar_32' } },
  { name: 'Sơn Văn Duy', email: 'duy@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=33', public_id: 'demo_avatar_33' } },
  { name: 'Triệu Thị Nga', email: 'nga2@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=34', public_id: 'demo_avatar_34' } },
  { name: 'Lâm Văn Phong', email: 'phong@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=35', public_id: 'demo_avatar_35' } },
  { name: 'Tống Thị Quế', email: 'que@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=36', public_id: 'demo_avatar_36' } },
  { name: 'Đoàn Văn Sáng', email: 'sang@demo.vn', password: 'password123', avatar: { url: 'https://i.pravatar.cc/150?img=37', public_id: 'demo_avatar_37' } }
];

async function createUsers() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối thành công!\n');

    console.log('📝 Đang tạo 30 demo users...');
    let created = 0;
    let skipped = 0;

    for (const userData of demoUsers) {
      // Kiểm tra user đã tồn tại chưa
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} đã tồn tại, bỏ qua...`);
        skipped++;
        continue;
      }

      // Tạo user mới (KHÔNG hash password vì model có pre-save hook tự động hash)
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Truyền password gốc, model sẽ tự hash
        role: 0, // User thường
        avatar: userData.avatar // Sửa từ 'image' thành 'avatar'
      });

      console.log(`✅ Đã tạo user: ${newUser.name} (${newUser.email})`);
      created++;
    }

    console.log('\n📊 Kết quả:');
    console.log(`   - Đã tạo mới: ${created} users`);
    console.log(`   - Đã tồn tại: ${skipped} users`);
    console.log(`   - Tổng cộng: ${created + skipped} users`);
    
    console.log('\n🎉 Hoàn tất! Bây giờ bạn có thể chạy bulkInsertPosts.js');
    console.log('💡 Mật khẩu mặc định cho tất cả demo users: password123');

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Đã ngắt kết nối MongoDB');
  }
}

createUsers();

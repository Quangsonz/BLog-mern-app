// Script: updateUserAvatars.js
// Tác dụng: Update avatar cho các users chưa có avatar

const mongoose = require('mongoose');
const User = require('../backend/models/userModel');
require('dotenv').config({ path: '../backend/.env' });

const MONGO_URI = process.env.DATABASE || 'mongodb+srv://np21062004_db_user:datphung84@blogweb.cmqkouu.mongodb.net/blog-mern-app?retryWrites=true&w=majority&appName=blogweb';

async function updateAvatars() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối thành công!\n');

    // Tìm tất cả users chưa có avatar
    console.log('🔍 Đang tìm users chưa có avatar...');
    const usersWithoutAvatar = await User.find({
      $or: [
        { avatar: { $exists: false } },
        { 'avatar.url': { $exists: false } },
        { 'avatar.url': null },
        { 'avatar.url': '' }
      ]
    });

    console.log(`📊 Tìm thấy ${usersWithoutAvatar.length} users chưa có avatar\n`);

    if (usersWithoutAvatar.length === 0) {
      console.log('✅ Tất cả users đã có avatar!');
      return;
    }

    let updated = 0;
    for (let i = 0; i < usersWithoutAvatar.length; i++) {
      const user = usersWithoutAvatar[i];
      const imgNum = 40 + i; // Bắt đầu từ img=40
      
      user.avatar = {
        url: `https://i.pravatar.cc/150?img=${imgNum}`,
        public_id: `avatar_${user.email}_${Date.now()}`
      };

      await user.save();
      console.log(`✅ Đã update avatar cho: ${user.name} (${user.email}) - img=${imgNum}`);
      updated++;
    }

    console.log(`\n🎉 Hoàn thành! Đã update avatar cho ${updated} users`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
}

updateAvatars();

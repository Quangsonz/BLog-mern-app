// Script: bulkInsertPosts.js
// Tác dụng: Đẩy 100 bài viết với user, likes và comments ngẫu nhiên lên MongoDB

const mongoose = require('mongoose');
const Post = require('../backend/models/postModel');
const User = require('../backend/models/userModel');
require('dotenv').config({ path: '../backend/.env' });

// Lấy URI từ .env hoặc dùng mặc định
const MONGO_URI = process.env.DATABASE || 'mongodb+srv://np21062004_db_user:datphung84@blogweb.cmqkouu.mongodb.net/blog-mern-app?retryWrites=true&w=majority&appName=blogweb';

// Số lượng bài viết cần tạo
const POST_COUNT = 300;

// Các category theo model
const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Other'];

// Mảng ảnh từ Unsplash
const images = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d',
  'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3',
  'https://images.unsplash.com/photo-1558403194-611308249627',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984',
  'https://images.unsplash.com/photo-1511376777868-611b54f68947',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  'https://images.unsplash.com/photo-1573164574230-db1d5e960238'
];

// Mảng nội dung mẫu
const contentTemplates = [
  '<h2>Giới thiệu</h2><p>Đây là một bài viết thú vị về chủ đề này. Chúng ta sẽ khám phá nhiều khía cạnh khác nhau.</p><h3>Nội dung chính</h3><p>Trong thời đại công nghệ số, việc cập nhật kiến thức là vô cùng quan trọng. Hãy cùng tìm hiểu sâu hơn về những xu hướng mới nhất.</p><ul><li>Điểm thứ nhất: Tầm quan trọng của việc học tập liên tục</li><li>Điểm thứ hai: Ứng dụng thực tế trong công việc</li><li>Điểm thứ ba: Những kỹ năng cần thiết</li></ul><p>Kết luận: Đây là một chủ đề rất đáng để chúng ta quan tâm và nghiên cứu sâu hơn.</p>',
  '<h2>Xu hướng mới</h2><p>Trong năm nay, chúng ta chứng kiến nhiều thay đổi đáng kể. Các công nghệ mới đang dần thay đổi cách chúng ta làm việc và sinh hoạt.</p><h3>Phân tích</h3><p>Theo các chuyên gia, đây là thời điểm vàng để đầu tư và phát triển kỹ năng mới. Những người biết nắm bắt cơ hội sẽ có lợi thế cạnh tranh lớn.</p><blockquote>Thành công không phải là điểm đến, mà là hành trình không ngừng nghỉ.</blockquote><p>Hãy cùng nhau xây dựng tương lai tốt đẹp hơn!</p>',
  '<h2>Hướng dẫn chi tiết</h2><p>Bài viết này sẽ cung cấp cho bạn những thông tin hữu ích và thiết thực nhất. Chúng ta sẽ đi sâu vào từng bước cụ thể.</p><h3>Các bước thực hiện</h3><ol><li><strong>Bước 1:</strong> Chuẩn bị các công cụ và tài liệu cần thiết</li><li><strong>Bước 2:</strong> Lập kế hoạch chi tiết và phân chia công việc</li><li><strong>Bước 3:</strong> Thực hiện và theo dõi tiến độ</li><li><strong>Bước 4:</strong> Đánh giá kết quả và rút kinh nghiệm</li></ol><p>Với phương pháp này, bạn sẽ đạt được kết quả tốt nhất trong thời gian ngắn nhất.</p>',
  '<h2>Kinh nghiệm thực tế</h2><p>Sau nhiều năm làm việc trong lĩnh vực này, tôi muốn chia sẻ những kinh nghiệm quý báu đã tích lũy được.</p><h3>Bài học quan trọng</h3><p>Một trong những điều quan trọng nhất là phải luôn giữ thái độ học hỏi và khiêm tốn. Không ai là hoàn hảo và chúng ta luôn có thể học hỏi từ người khác.</p><p>Hãy tập trung vào việc phát triển bản thân mỗi ngày. Những thay đổi nhỏ hàng ngày sẽ tạo nên sự khác biệt lớn theo thời gian.</p><p><em>Đừng bao giờ ngừng học hỏi và phát triển!</em></p>',
  '<h2>Phân tích chuyên sâu</h2><p>Chủ đề này đang được rất nhiều người quan tâm trong thời gian gần đây. Hãy cùng nhau tìm hiểu kỹ hơn về các khía cạnh khác nhau.</p><h3>Góc nhìn đa chiều</h3><p>Từ góc độ thực tiễn, chúng ta có thể thấy rõ những ưu điểm và hạn chế. Điều quan trọng là biết cách tận dụng điểm mạnh và khắc phục điểm yếu.</p><ul><li>Lợi ích: Tăng hiệu suất và năng suất</li><li>Thách thức: Cần thời gian để làm quen</li><li>Giải pháp: Học tập và thực hành liên tục</li></ul><p>Tóm lại, đây là một chủ đề đáng để chúng ta đầu tư thời gian nghiên cứu.</p>'
];

// Mảng nội dung comment mẫu
const commentTemplates = [
  'Bài viết rất hay và bổ ích! 👍',
  'Cảm ơn bạn đã chia sẻ kiến thức này!',
  'Mình đã học được nhiều điều từ bài viết này 💡',
  'Nội dung rất chất lượng, mong có thêm bài tương tự!',
  'Thật tuyệt vời! Đúng những gì mình đang tìm kiếm 🎯',
  'Bài viết rất chi tiết và dễ hiểu 📚',
  'Cảm ơn bạn! Bài viết giúp mình giải quyết được vấn đề',
  'Nội dung rất thú vị, mình đã save lại để đọc lại 🔖',
  'Góc nhìn của bạn rất hay, mình hoàn toàn đồng ý!',
  'Bài viết chất lượng cao! Chúc bạn viết nhiều bài hay hơn nữa ✨'
];

// Hàm random
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Hàm random số trong khoảng
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm random subset từ array
function randomSubset(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Tạo bài viết với user, likes và comments ngẫu nhiên
function createPosts(allUsers) {
  const posts = [];
  
  for (let i = 1; i <= POST_COUNT; i++) {
    const category = randomItem(categories);
    const imageUrl = randomItem(images);
    const content = randomItem(contentTemplates);
    
    // Random user làm tác giả
    const author = randomItem(allUsers);
    
    // Lọc ra các user khác (không phải tác giả)
    const otherUsers = allUsers.filter(u => u._id.toString() !== author._id.toString());
    
    // Random số lượng likes (10-35, tối đa = số users có sẵn)
    const maxPossibleLikes = Math.min(35, otherUsers.length);
    const likeCount = randomInt(10, maxPossibleLikes);
    const likedUsers = randomSubset(otherUsers, likeCount);
    const likes = likedUsers.map(u => u._id);
    
    // Random số lượng comments (20-50, cho phép 1 user comment nhiều lần)
    const commentCount = randomInt(20, 50);
    const comments = [];
    
    for (let j = 0; j < commentCount; j++) {
      const commenter = randomItem(otherUsers);
      comments.push({
        text: randomItem(commentTemplates),
        postedBy: commenter._id,
        createdAt: new Date(Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000)) // Random trong 30 ngày qua
      });
    }
    
    posts.push({
      category: category,
      content: `<h1>${category} - Bài viết số ${i}</h1>${content}`,
      postedBy: author._id,
      image: {
        url: imageUrl,
        public_id: `post_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`
      },
      likes: likes,
      comments: comments,
      createdAt: new Date(Date.now() - randomInt(0, 60 * 24 * 60 * 60 * 1000)) // Random trong 60 ngày qua
    });
  }
  return posts;
}

async function run() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối thành công!');
    
    // Xóa tất cả bài viết hiện có
    console.log('🗑️  Đang xóa tất cả bài viết cũ...');
    const deleteResult = await Post.deleteMany({});
    console.log(`✅ Đã xóa ${deleteResult.deletedCount} bài viết cũ\n`);
    
    // Lấy tất cả users
    console.log('🔍 Đang lấy danh sách tất cả users...');
    const allUsers = await User.find({}).select('_id name email');
    console.log(`✅ Tìm thấy ${allUsers.length} users trong database`);
    
    if (allUsers.length < 2) {
      console.error('❌ Cần ít nhất 2 users để tạo bài viết với likes và comments!');
      console.log('💡 Hãy chạy: node createDemoUsers.js để tạo demo users');
      return;
    }
    
    console.log(`📝 Đang tạo ${POST_COUNT} bài viết với user, likes và comments ngẫu nhiên...`);
    
    // Tạo posts với user, likes và comments ngẫu nhiên
    const posts = createPosts(allUsers);
    
    console.log(`⏳ Đang thêm ${POST_COUNT} bài viết vào database...`);
    const result = await Post.insertMany(posts);
    console.log(`✅ Đã thêm thành công: ${result.length} bài viết`);
    console.log('📊 Phân loại theo category:');
    
    // Thống kê theo category
    const stats = {};
    result.forEach(post => {
      stats[post.category] = (stats[post.category] || 0) + 1;
    });
    
    Object.keys(stats).sort().forEach(cat => {
      console.log(`   - ${cat}: ${stats[cat]} bài`);
    });
    
    // Thống kê likes và comments
    const totalLikes = result.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = result.reduce((sum, post) => sum + post.comments.length, 0);
    const avgLikes = (totalLikes / result.length).toFixed(1);
    const avgComments = (totalComments / result.length).toFixed(1);
    
    console.log('\n📈 Thống kê tương tác:');
    console.log(`   - Tổng likes: ${totalLikes} (Trung bình: ${avgLikes} likes/bài)`);
    console.log(`   - Tổng comments: ${totalComments} (Trung bình: ${avgComments} comments/bài)`);
    
    console.log('\n🎉 Hoàn tất! Bạn có thể kiểm tra các bài viết trong ứng dụng.');
    
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB');
  }
}

run();

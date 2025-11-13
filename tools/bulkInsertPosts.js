// Script: bulkInsertPosts.js
// Tác dụng: Đẩy 100 bài viết lên MongoDB (sử dụng Node.js + Mongoose)

const mongoose = require('mongoose');
const Post = require('../backend/models/postModel');

// Thay đổi chuỗi kết nối cho phù hợp
const MONGO_URI = 'mongodb+srv://np21062004_db_user:datphung84@blogweb.cmqkouu.mongodb.net/blog-mern-app?retryWrites=true&w=majority&appName=blogweb';

// ID user của bạn
const USER_ID = '6914972ebd1b3f5128a33724';

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

// Hàm random
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Tạo 100 bài viết
const posts = [];
for (let i = 1; i <= 100; i++) {
  const category = randomItem(categories);
  const imageUrl = randomItem(images);
  const content = randomItem(contentTemplates);
  
  posts.push({
    category: category,
    content: `<h1>${category} - Bài viết số ${i}</h1>${content}`,
    postedBy: mongoose.Types.ObjectId(USER_ID),
    image: {
      url: imageUrl,
      public_id: `post_${i}_${Date.now()}`
    },
    likes: [],
    comments: []
  });
}

async function run() {
  try {
    console.log('Đang kết nối tới MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Kết nối thành công!');
    
    console.log('Đang thêm 100 bài viết...');
    const result = await Post.insertMany(posts);
    console.log('✅ Đã thêm thành công:', result.length, 'bài viết');
    console.log('📊 Phân loại:');
    
    // Thống kê theo category
    const stats = {};
    result.forEach(post => {
      stats[post.category] = (stats[post.category] || 0) + 1;
    });
    
    Object.keys(stats).forEach(cat => {
      console.log(`   - ${cat}: ${stats[cat]} bài`);
    });
    
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB');
  }
}

run();

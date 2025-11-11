# 🔍 PHÂN TÍCH CÁC THUẬT TOÁN TÌM KIẾM TRONG BLOG-MERN-APP

## 📋 Mục lục
1. [Tổng quan về hệ thống tìm kiếm](#tổng-quan)
2. [Thuật toán tìm kiếm chính](#thuật-toán-chính)
3. [Thuật toán gợi ý tìm kiếm](#thuật-toán-gợi-ý)
4. [Thuật toán chấm điểm và xếp hạng](#thuật-toán-chấm-điểm)
5. [Thuật toán tính độ tương đồng](#thuật-toán-độ-tương-đồng)
6. [Phân trang và sắp xếp](#phân-trang-sắp-xếp)

---

## 1. Tổng quan về hệ thống tìm kiếm {#tổng-quan}

Project **blog-mern-app** sử dụng một hệ thống tìm kiếm thông minh với nhiều tính năng:

### 🎯 Các tính năng chính:
- ✅ Tìm kiếm theo nội dung bài viết
- ✅ Tìm kiếm theo danh mục
- ✅ Tìm kiếm theo tên tác giả
- ✅ Chấm điểm độ liên quan (Relevance Scoring)
- ✅ Gợi ý tìm kiếm thông minh
- ✅ Lịch sử tìm kiếm
- ✅ Sắp xếp đa chiều
- ✅ Phân trang kết quả

### 📁 Cấu trúc code:
```
backend/
├── controllers/
│   └── postController.js         // Chứa logic tìm kiếm
├── routes/
│   └── postRoute.js              // Định nghĩa API endpoints
frontend/
├── components/
│   └── SmartSearch.jsx           // Component tìm kiếm
└── pages/
    └── SearchResults.js          // Trang hiển thị kết quả
```

---

## 2. Thuật toán tìm kiếm chính {#thuật-toán-chính}

### 📍 Vị trí code:
**File:** `backend/controllers/postController.js`  
**Function:** `exports.searchPosts`  
**Dòng:** 289-415

### 🔬 Mô tả thuật toán:

Đây là thuật toán **tìm kiếm văn bản đơn giản với Regular Expression** kết hợp **chấm điểm thông minh**.

#### **Bước 1: Xử lý Input**
```javascript
const { query, sortBy = 'relevance', page = 1, limit = 10 } = req.query;
const searchQuery = query.trim();
const skip = (parseInt(page) - 1) * parseInt(limit);
```
- Nhận từ khóa tìm kiếm, kiểu sắp xếp, trang hiện tại
- Tính toán số bản ghi cần bỏ qua cho phân trang

#### **Bước 2: Tìm kiếm bằng Regex (Case-insensitive)**
```javascript
const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive

// Lấy tất cả posts kèm thông tin user
const allPosts = await Post.find()
    .populate('postedBy', 'name avatar')
    .lean();

// Lọc posts khớp với query
const filteredPosts = allPosts.filter(post => {
    const category = (post.category || '').toLowerCase();
    const content = (post.content || '').toLowerCase();
    const username = (post.postedBy?.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return category.includes(query) || 
           content.includes(query) || 
           username.includes(query);
});
```

**Giải thích:**
- Sử dụng `RegExp` với flag `'i'` để tìm kiếm không phân biệt hoa thường
- Tìm kiếm trong 3 trường: `category`, `content`, `username`
- Method `.includes()` kiểm tra chuỗi con

#### **Độ phức tạp:**
- **Time Complexity:** O(n × m) 
  - n = số lượng posts
  - m = độ dài trung bình của content
- **Space Complexity:** O(n)

### 📊 Ví dụ minh họa:

**Input:**
```javascript
Query: "technology"
Posts trong DB:
[
  {
    _id: "1",
    category: "Technology",
    content: "Latest tech trends in 2025",
    postedBy: { name: "John Doe" }
  },
  {
    _id: "2", 
    category: "Design",
    content: "UX design principles",
    postedBy: { name: "Jane Smith" }
  },
  {
    _id: "3",
    category: "Business", 
    content: "Technology in business",
    postedBy: { name: "Tech Guru" }
  }
]
```

**Quá trình tìm kiếm:**
```javascript
// Post 1: Match ✅
category.includes("technology") → true (Technology chứa technology)

// Post 2: No Match ❌
category.includes("technology") → false
content.includes("technology") → false
username.includes("technology") → false

// Post 3: Match ✅
content.includes("technology") → true
```

**Output:**
```javascript
filteredPosts = [
  { _id: "1", category: "Technology", ... },
  { _id: "3", category: "Business", ... }
]
```

### 🎯 Ưu điểm:
- ✅ Đơn giản, dễ hiểu, dễ maintain
- ✅ Tìm kiếm chính xác với từ khóa
- ✅ Hỗ trợ tìm kiếm đa trường (multi-field)
- ✅ Không phân biệt hoa thường

### ⚠️ Nhược điểm:
- ❌ Không hỗ trợ tìm kiếm mờ (fuzzy search)
- ❌ Không tìm được từ có lỗi chính tả
- ❌ Hiệu năng thấp với database lớn (phải load toàn bộ posts)
- ❌ Không hỗ trợ tìm kiếm với stop words

---

## 3. Thuật toán chấm điểm và xếp hạng {#thuật-toán-chấm-điểm}

### 📍 Vị trí code:
**File:** `backend/controllers/postController.js`  
**Dòng:** 330-383

### 🔬 Mô tả thuật toán:

Đây là thuật toán **Weighted Scoring** - chấm điểm có trọng số dựa trên nhiều yếu tố.

### 📐 Công thức tính điểm:

```
Score = CategoryScore + UsernameScore + ContentScore + SocialScore + FreshnessScore
```

#### **1. Category Score (50-100 điểm)**
```javascript
// Khớp chính xác = 100 điểm
if (categoryLower === queryLower) {
    score += 100;
}
// Chứa query = 50 điểm
else if (categoryLower.includes(queryLower)) {
    score += 50;
}
```

#### **2. Username Score (40-80 điểm)**
```javascript
// Khớp chính xác = 80 điểm
if (usernameLower === queryLower) {
    score += 80;
}
// Chứa query = 40 điểm
else if (usernameLower.includes(queryLower)) {
    score += 40;
}
```

#### **3. Content Score (20 điểm)**
```javascript
// Chứa query = 20 điểm
if (contentLower.includes(queryLower)) {
    score += 20;
}
```

#### **4. Social Score (Điểm tương tác xã hội)**
```javascript
// Điểm từ likes (mỗi like = 1 điểm)
score += (post.likes?.length || 0) * 1;

// Điểm từ comments (mỗi comment = 0.5 điểm)
score += (post.comments?.length || 0) * 0.5;
```

#### **5. Freshness Score (Điểm độ mới)**
```javascript
const daysOld = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);

if (daysOld < 7) {
    score += 10; // Bài mới (<7 ngày)
} else if (daysOld < 30) {
    score += 5;  // Bài gần đây (<30 ngày)
}
```

### 📊 Ví dụ chi tiết:

**Post cần chấm điểm:**
```javascript
{
  category: "Technology",
  content: "AI and Machine Learning trends in 2025",
  postedBy: { name: "Tech Expert" },
  likes: [userId1, userId2, userId3],  // 3 likes
  comments: [comment1, comment2],      // 2 comments
  createdAt: "2025-10-25"              // 6 ngày trước
}

Query: "technology"
```

**Tính điểm:**
```javascript
// 1. Category Score
"technology" === "technology" → 100 điểm ✅

// 2. Username Score  
"tech expert".includes("technology") → 0 điểm ❌

// 3. Content Score
"ai and machine...".includes("technology") → 0 điểm ❌

// 4. Social Score
Likes: 3 × 1 = 3 điểm
Comments: 2 × 0.5 = 1 điểm
Total: 4 điểm

// 5. Freshness Score
6 ngày < 7 ngày → 10 điểm ✅

// TỔNG ĐIỂM
Score = 100 + 0 + 0 + 4 + 10 = 114 điểm
```

### 🎯 Bảng trọng số ưu tiên:

| Yếu tố | Điểm tối đa | Ý nghĩa |
|--------|-------------|---------|
| 🏷️ Category (Exact Match) | 100 | Khớp hoàn toàn với danh mục |
| 👤 Username (Exact Match) | 80 | Tìm tác giả chính xác |
| 🏷️ Category (Contains) | 50 | Chứa từ khóa trong danh mục |
| 👤 Username (Contains) | 40 | Chứa từ khóa trong tên |
| 📝 Content (Contains) | 20 | Chứa từ khóa trong nội dung |
| 📆 Freshness (<7 days) | 10 | Bài viết mới |
| ❤️ Likes | Không giới hạn | Mỗi like = 1 điểm |
| 💬 Comments | Không giới hạn | Mỗi comment = 0.5 điểm |

### 🔄 Thuật toán sắp xếp:

```javascript
if (sortBy === 'relevance') {
    scoredPosts.sort((a, b) => b.relevanceScore - a.relevanceScore);
} else if (sortBy === 'likes') {
    scoredPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
} else if (sortBy === 'recent') {
    scoredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
```

**3 chế độ sắp xếp:**
- ⭐ **Relevance:** Sắp xếp theo điểm số (mặc định)
- ❤️ **Likes:** Sắp xếp theo số lượt thích
- 🕐 **Recent:** Sắp xếp theo thời gian mới nhất

---

## 4. Thuật toán gợi ý tìm kiếm {#thuật-toán-gợi-ý}

### 📍 Vị trí code:
**File:** `backend/controllers/postController.js`  
**Function:** `exports.getSearchSuggestions`  
**Dòng:** 419-525

### 🔬 Mô tả thuật toán:

Đây là thuật toán **Smart Suggestions** với:
- **Fuzzy Matching** (khớp mờ)
- **Levenshtein Distance** (khoảng cách chỉnh sửa)
- **Multi-source Suggestions** (gợi ý đa nguồn)

### 🎯 Luồng hoạt động:

```
Input Query (≥ 2 ký tự)
    ↓
Lấy tất cả posts từ DB
    ↓
Tính độ tương đồng (Similarity Score)
    ├── Category Similarity
    ├── Content Similarity  
    └── Username Similarity
    ↓
Lọc suggestions (score > ngưỡng)
    ├── Categories (score > 0.3)
    ├── Users (score > 0.3)
    └── Keywords (score > 0.2)
    ↓
Sắp xếp theo điểm số
    ↓
Lấy top 8 suggestions
```

### 📐 Chi tiết thuật toán:

#### **Bước 1: Kiểm tra input**
```javascript
if (!query || query.trim().length < 2) {
    // Trả về trending topics nếu không có query
    const trendingPosts = await Post.find()
        .sort({ likes: -1, createdAt: -1 })
        .limit(5)
        .populate('postedBy', 'name')
        .select('category content postedBy')
        .lean();
    
    return trendingSuggestions;
}
```

#### **Bước 2: Tính similarity score**
```javascript
allPosts.forEach(post => {
    const categoryScore = calculateSimilarity(searchQuery, category);
    const contentScore = calculateSimilarity(searchQuery, content);
    const usernameScore = calculateSimilarity(searchQuery, username);
    
    // Thêm suggestion từ category
    if (categoryScore > 0.3 && post.category) {
        suggestions.set(`category:${post.category}`, {
            text: post.category,
            type: 'category',
            score: categoryScore * 100,
            subtitle: `${post.likes?.length || 0} likes`
        });
    }
    
    // Thêm suggestion từ username
    if (usernameScore > 0.3 && post.postedBy?.name) {
        suggestions.set(`user:${post.postedBy.name}`, {
            text: post.postedBy.name,
            type: 'user',
            score: usernameScore * 100,
            subtitle: 'Author'
        });
    }
    
    // Thêm suggestion từ keywords
    if (contentScore > 0.2) {
        const words = post.content.split(/\s+/).filter(w => w.length > 3);
        words.forEach(word => {
            if (wordLower.includes(searchQuery) || searchQuery.includes(wordLower)) {
                suggestions.set(`keyword:${word}`, {
                    text: word,
                    type: 'keyword',
                    score: contentScore * 50,
                    subtitle: 'Keyword'
                });
            }
        });
    }
});
```

#### **Bước 3: Sắp xếp và lấy top suggestions**
```javascript
const sortedSuggestions = Array.from(suggestions.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
```

### 📊 Ví dụ:

**Input:**
```javascript
Query: "tech"
```

**Quá trình tính toán:**

```javascript
Post 1: { category: "Technology", ... }
→ calculateSimilarity("tech", "technology") = 0.8
→ 0.8 > 0.3 ✅ → Add suggestion "Technology"

Post 2: { category: "Design", ... }
→ calculateSimilarity("tech", "design") = 0.0
→ 0.0 < 0.3 ❌ → Skip

Post 3: { postedBy: { name: "TechGuru" } }
→ calculateSimilarity("tech", "techguru") = 0.75
→ 0.75 > 0.3 ✅ → Add suggestion "TechGuru"
```

**Output:**
```javascript
[
  { text: "Technology", type: "category", score: 80, subtitle: "15 likes" },
  { text: "TechGuru", type: "user", score: 75, subtitle: "Author" },
  { text: "technical", type: "keyword", score: 40, subtitle: "Keyword" }
]
```

### 🎯 Ngưỡng điểm (Threshold):
- **Category/Username:** score > 0.3 (30%)
- **Keywords:** score > 0.2 (20%)

---

## 5. Thuật toán tính độ tương đồng (Levenshtein Distance) {#thuật-toán-độ-tương-đồng}

### 📍 Vị trí code:
**File:** `backend/controllers/postController.js`  
**Function:** `calculateSimilarity`  
**Dòng:** 528-582

### 🔬 Mô tả thuật toán:

Đây là thuật toán **Levenshtein Distance** (khoảng cách chỉnh sửa) - một thuật toán nổi tiếng trong xử lý văn bản.

### 📐 Định nghĩa:

**Levenshtein Distance** là số bước biến đổi tối thiểu để chuyển chuỗi A thành chuỗi B, sử dụng 3 thao tác:
1. **Insert** (Chèn ký tự)
2. **Delete** (Xóa ký tự)  
3. **Substitute** (Thay thế ký tự)

### 🎯 Công thức:

```
Similarity = 1 - (distance / maxLength)
```

Trong đó:
- `distance` = số bước biến đổi tối thiểu
- `maxLength` = độ dài chuỗi dài hơn

### 💻 Code chi tiết:

```javascript
function calculateSimilarity(str1, str2) {
    // Case 1: Hai chuỗi giống hệt nhau
    if (str1 === str2) return 1.0;
    
    // Case 2: Một trong hai chuỗi rỗng
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    // Case 3: str2 chứa str1 (substring)
    if (str2.includes(str1)) {
        return 0.8 + (str1.length / str2.length) * 0.2;
    }
    
    // Case 4: str1 chứa str2
    if (str1.includes(str2)) {
        return 0.8 + (str2.length / str1.length) * 0.2;
    }
    
    // Case 5: Tính Levenshtein distance
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Khởi tạo ma trận
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];  // Cột đầu tiên
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;  // Hàng đầu tiên
    }

    // Điền ma trận bằng Dynamic Programming
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];  // Ký tự giống nhau
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Thay thế
                    matrix[i][j - 1] + 1,     // Chèn
                    matrix[i - 1][j] + 1      // Xóa
                );
            }
        }
    }

    // Tính similarity từ distance
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}
```

### 📊 Ví dụ chi tiết:

#### **Ví dụ 1: Tính similarity giữa "tech" và "technology"**

**Bước 1:** Kiểm tra contains
```javascript
"technology".includes("tech") → true ✅
similarity = 0.8 + (4 / 10) * 0.2 = 0.88
```

**Kết quả:** `0.88` (88% tương đồng)

---

#### **Ví dụ 2: Tính similarity giữa "cat" và "hat"**

**Bước 1:** Không contains → Tính Levenshtein Distance

**Bước 2:** Xây dựng ma trận DP

|   | ε | c | a | t |
|---|---|---|---|---|
| **ε** | 0 | 1 | 2 | 3 |
| **h** | 1 | 1 | 2 | 3 |
| **a** | 2 | 2 | 1 | 2 |
| **t** | 3 | 3 | 2 | 1 |

**Giải thích từng bước:**

```
matrix[1][1]: "h" vs "c"
→ Khác nhau → min(0+1, 1+1, 1+1) = 1

matrix[2][2]: "ha" vs "ca"
→ 'a' == 'a' → matrix[1][1] = 1

matrix[3][3]: "hat" vs "cat"  
→ 't' == 't' → matrix[2][2] = 1
```

**Bước 3:** Tính similarity
```javascript
distance = 1 (chỉ cần thay 'c' → 'h')
maxLen = 3
similarity = 1 - (1/3) = 0.67
```

**Kết quả:** `0.67` (67% tương đồng)

---

#### **Ví dụ 3: Tính similarity giữa "kitten" và "sitting"**

**Ma trận DP:**

|   | ε | k | i | t | t | e | n |
|---|---|---|---|---|---|---|---|
| **ε** | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| **s** | 1 | 1 | 2 | 3 | 4 | 5 | 6 |
| **i** | 2 | 2 | 1 | 2 | 3 | 4 | 5 |
| **t** | 3 | 3 | 2 | 1 | 2 | 3 | 4 |
| **t** | 4 | 4 | 3 | 2 | 1 | 2 | 3 |
| **i** | 5 | 5 | 4 | 3 | 2 | 2 | 3 |
| **n** | 6 | 6 | 5 | 4 | 3 | 3 | 2 |
| **g** | 7 | 7 | 6 | 5 | 4 | 4 | 3 |

**Các bước biến đổi:**
1. kitten → sitten (thay k → s)
2. sitten → sittin (thay e → i)  
3. sittin → sitting (chèn g)

```javascript
distance = 3
maxLen = max(6, 7) = 7
similarity = 1 - (3/7) = 0.57
```

**Kết quả:** `0.57` (57% tương đồng)

### ⚙️ Độ phức tạp:

- **Time Complexity:** O(m × n)
  - m = độ dài str1
  - n = độ dài str2
- **Space Complexity:** O(m × n) cho ma trận

### 🎯 Ứng dụng thực tế:

| str1 | str2 | Similarity | Ý nghĩa |
|------|------|-----------|---------|
| tech | technology | 0.88 | Rất tương đồng ✅ |
| design | designer | 0.86 | Rất tương đồng ✅ |
| cat | hat | 0.67 | Khá tương đồng 🟡 |
| hello | world | 0.20 | Ít tương đồng ❌ |

---

## 6. Phân trang và hiển thị kết quả {#phân-trang-sắp-xếp}

### 📍 Vị trí code:
**Backend:** `backend/controllers/postController.js` (dòng 399-415)  
**Frontend:** `frontend/src/pages/SearchResults.js`

### 🔬 Thuật toán phân trang:

```javascript
// Backend
const skip = (parseInt(page) - 1) * parseInt(limit);
const totalResults = scoredPosts.length;
const posts = scoredPosts.slice(skip, skip + parseInt(limit));

res.status(200).json({
    success: true,
    posts,
    totalResults,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalResults / parseInt(limit))
});
```

### 📊 Ví dụ phân trang:

```javascript
// Có 45 bài viết tìm thấy, mỗi trang 12 bài

Page 1: posts[0...11]   (12 bài)
Page 2: posts[12...23]  (12 bài)
Page 3: posts[24...35]  (12 bài)
Page 4: posts[36...44]  (9 bài)

totalPages = Math.ceil(45 / 12) = 4 trang
```

### 🎯 Frontend - Component SmartSearch:

**File:** `frontend/src/components/SmartSearch.jsx`

**Tính năng:**
1. **Debouncing:** Chờ 300ms sau khi user dừng gõ
2. **Auto-suggestions:** Tự động gợi ý khi gõ ≥2 ký tự
3. **Search History:** Lưu lịch sử tìm kiếm trong localStorage
4. **Real-time updates:** Cập nhật gợi ý theo thời gian thực

```javascript
// Debouncing
debounceTimer.current = setTimeout(async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/posts/suggestions?query=${searchQuery}`);
    setSuggestions(data.suggestions || []);
    setShowSuggestions(true);
    setLoading(false);
}, 300);
```

---

## 📈 So sánh các thuật toán

| Thuật toán | Time Complexity | Space Complexity | Use Case |
|------------|-----------------|------------------|----------|
| **Regex Search** | O(n × m) | O(n) | Tìm kiếm chính xác |
| **Weighted Scoring** | O(n) | O(n) | Xếp hạng kết quả |
| **Levenshtein Distance** | O(m × n) | O(m × n) | Tìm kiếm mờ, gợi ý |
| **Trending Topics** | O(n log n) | O(n) | Gợi ý phổ biến |

---

## 🎯 Tổng kết

### ✅ Điểm mạnh của hệ thống:
1. **Đơn giản và hiệu quả** cho database nhỏ-trung bình
2. **Multi-field search** tìm kiếm đa chiều
3. **Smart scoring** chấm điểm thông minh với nhiều yếu tố
4. **Fuzzy matching** hỗ trợ tìm kiếm mờ
5. **User-friendly** giao diện thân thiện với gợi ý

### ⚠️ Hạn chế:
1. Hiệu năng giảm với database lớn (>10,000 posts)
2. Không hỗ trợ tìm kiếm toàn văn (Full-text search)
3. Không có index tối ưu
4. Không hỗ trợ đa ngôn ngữ nâng cao

### 🚀 Đề xuất cải tiến:
1. Sử dụng **MongoDB Text Index** cho full-text search
2. Tích hợp **Elasticsearch** cho tìm kiếm quy mô lớn
3. Thêm **caching** với Redis
4. Implement **TF-IDF** hoặc **BM25** cho relevance scoring
5. Sử dụng **Trie data structure** cho auto-complete nhanh hơn

---

## 📚 Tài liệu tham khảo

1. **Levenshtein Distance Algorithm:**
   - https://en.wikipedia.org/wiki/Levenshtein_distance

2. **MongoDB Text Search:**
   - https://docs.mongodb.com/manual/text-search/

3. **TF-IDF Algorithm:**
   - https://en.wikipedia.org/wiki/Tf%E2%80%93idf

4. **Elasticsearch:**
   - https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html

---

**Tạo bởi:** Phân tích code blog-mern-app  
**Ngày:** 31/10/2025  
**Version:** 1.0

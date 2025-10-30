# Migration Notes: Title → Category

## ✅ Changes Completed

### Backend
1. ✅ Created `categoryModel.js` - New collection to store categories
2. ✅ Updated `postModel.js` - Changed `title` to `category` field (enum)
3. ✅ Updated `postController.js`:
   - `createPost` - Save category to Categories collection
   - `updatePost` - Use category instead of title
   - `showPost` - Populate user info (name, email)
   - `searchPost` - Search by category instead of title

### Frontend
1. ✅ Updated `Home.js` - Category dropdown instead of title input
2. ✅ Updated `PostCard.js` - Display username + category chip
3. ✅ Updated `SinglePost.js` - Use category, show username
4. ✅ Updated `EditPost.js` (Admin) - Category dropdown
5. ✅ Updated `EditPostUser.js` - Category dropdown
6. ✅ Updated `CreatePost.js` (Admin) - Category dropdown
7. ✅ Updated `SearchResults.js` - Pass category to PostCard

## ⚠️ Known Issues & Solutions

### 1. 401 Unauthorized Error when creating post
**Problem:** User is not logged in

**Solution:**
- You must be logged in to create a post
- Go to `/login` and sign in
- If you don't have an account, go to `/register`

### 2. Existing posts in database
**Problem:** Old posts have `title` field, new schema requires `category`

**Solutions:**

#### Option A: Update existing posts via MongoDB
```javascript
// Run this in MongoDB shell or use MongoDB Compass
db.posts.updateMany(
  { title: { $exists: true } },
  { 
    $set: { category: "Other" },
    $unset: { title: "" }
  }
)
```

#### Option B: Create migration script
Create `backend/scripts/migrate-posts.js`:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB connected'));

const Post = require('../models/postModel');

async function migrate() {
  const posts = await Post.find({ title: { $exists: true } });
  
  for (let post of posts) {
    // Map old titles to categories (example logic)
    let category = 'Other';
    if (post.title.toLowerCase().includes('tech')) category = 'Technology';
    else if (post.title.toLowerCase().includes('design')) category = 'Design';
    else if (post.title.toLowerCase().includes('business')) category = 'Business';
    
    post.category = category;
    delete post.title;
    await post.save();
  }
  
  console.log(`Migrated ${posts.length} posts`);
  process.exit(0);
}

migrate();
```

Run: `node backend/scripts/migrate-posts.js`

## 🔄 How to Test

1. **Start Backend:**
   ```bash
   cd "d:\ngon ngu kich ban\blog-mern-app"
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Flow:**
   - Register new account at `/register`
   - Login at `/login`
   - Create post with category dropdown
   - View post on homepage - should show username + category
   - Click on post to view details
   - Edit post to change category

## 📋 Database Schema Changes

### Before:
```javascript
{
  title: String,
  content: String,
  postedBy: ObjectId,
  image: { url, public_id },
  likes: [ObjectId],
  comments: [...]
}
```

### After:
```javascript
{
  category: String (enum: Technology, Design, Business, Lifestyle, Other),
  content: String,
  postedBy: ObjectId,
  image: { url, public_id },
  likes: [ObjectId],
  comments: [...]
}
```

### New Collection - Categories:
```javascript
{
  name: String (enum: Technology, Design, Business, Lifestyle, Other),
  postedBy: ObjectId,
  postId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Features

- **Create Post**: Select category from dropdown (Technology, Design, Business, Lifestyle, Other)
- **View Posts**: Shows username + category chip for each post
- **Single Post**: Displays category chip instead of title
- **Edit Post**: Change category from dropdown
- **Search**: Now searches by category and content (not title)
- **Admin Dashboard**: Create/Edit posts with category dropdown

## 🔐 Authentication Required

All post creation/editing requires authentication:
- User must be logged in
- JWT token sent via cookies
- Backend validates `req.user._id`

If you get 401 error, check:
1. You are logged in
2. Cookie is being sent
3. JWT token is valid

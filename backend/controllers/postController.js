const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorResponse');
const { createNotification } = require('./notificationController');

//create post
exports.createPost = async (req, res, next) => {
    const { category, content, postedBy, image, likes, comments } = req.body;

    try {
        let postData = {
            category,
            content,
            postedBy: req.user._id,
        };

        // Only upload image if provided
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "posts",
                width: 1200,
                crop: "scale"
            });
            postData.image = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const post = await Post.create(postData);

        // Save category to Category collection
        await Category.create({
            name: category,
            postedBy: req.user._id,
            postId: post._id
        });

        res.status(201).json({
            success: true,
            post
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


// Hiển thị danh sách bài viết với phân trang, lọc và sắp xếp
exports.showPost = async (req, res, next) => {
    try {
        // Tham số phân trang: lấy số trang và số lượng bài viết mỗi trang từ query
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 10; // Số bài viết mỗi trang, mặc định là 10
        const skip = (page - 1) * limit; // Tính số bài viết cần bỏ qua để hiển thị đúng trang

        // Xây dựng điều kiện lọc
        const filter = {};
        
        // Lọc theo danh mục (category)
        if (req.query.category && req.query.category !== 'All Posts') {
            filter.category = req.query.category; // Chỉ lấy bài viết thuộc danh mục được chọn
        }

        // Xây dựng điều kiện sắp xếp
        let sortQuery = { createdAt: -1 }; // Mặc định: Sắp xếp theo ngày tạo mới nhất
        
        if (req.query.sort) {
            switch (req.query.sort) {
                case '-likes':
                    // Sắp xếp theo số lượng like (giảm dần)
                    sortQuery = { likes: -1, createdAt: -1 };
                    break;
                case '-comments':
                    // Sắp xếp theo số lượng comment (giảm dần)
                    sortQuery = { comments: -1, createdAt: -1 };
                    break;
                case '-createdAt':
                default:
                    // Sắp xếp theo ngày tạo mới nhất
                    sortQuery = { createdAt: -1 };
                    break;
            }
        }

        // Đếm tổng số bài viết sau khi áp dụng bộ lọc (để tính tổng số trang)
        const totalPosts = await Post.countDocuments(filter);

        // Tạo query để lấy bài viết với phân trang, lọc, sắp xếp và tối ưu hóa
        let query = Post.find(filter) // Tìm bài viết theo điều kiện lọc
            .skip(skip) // Bỏ qua số bài viết đã tính toán
            .limit(limit) // Giới hạn số lượng bài viết trả về
            .populate('postedBy', 'name email avatar') // Lấy thông tin người đăng (tên, email, avatar)
            .select('-__v') // Loại bỏ trường version không cần thiết
            .lean(); // Chuyển đổi sang đối tượng JavaScript thuần để tăng hiệu suất

        // Xử lý đặc biệt cho sắp xếp theo likes hoặc comments
        // Vì likes và comments là mảng, cần tính độ dài trong bộ nhớ
        if (req.query.sort === '-likes' || req.query.sort === '-comments') {
            const posts = await Post.find(filter)
                .skip(skip)
                .limit(limit)
                .populate('postedBy', 'name email avatar')
                .select('-__v')
                .lean();

            // Sắp xếp theo độ dài mảng trong bộ nhớ
            posts.sort((a, b) => {
                if (req.query.sort === '-likes') {
                    // So sánh số lượng like giữa 2 bài viết
                    return (b.likes?.length || 0) - (a.likes?.length || 0);
                } else {
                    // So sánh số lượng comment giữa 2 bài viết
                    return (b.comments?.length || 0) - (a.comments?.length || 0);
                }
            });

            // Trả về kết quả với thông tin phân trang
            return res.status(200).json({
                success: true,
                posts,
                pagination: {
                    currentPage: page, // Trang hiện tại
                    totalPages: Math.ceil(totalPosts / limit), // Tổng số trang
                    totalPosts, // Tổng số bài viết
                    postsPerPage: limit, // Số bài viết mỗi trang
                }
            });
        }

        // Thực thi query với sắp xếp theo ngày tạo
        const posts = await query.sort(sortQuery);

        // Trả về kết quả với đầy đủ thông tin phân trang
        res.status(200).json({
            success: true,
            posts, // Danh sách bài viết
            pagination: {
                currentPage: page, // Trang hiện tại
                totalPages: Math.ceil(totalPosts / limit), // Tổng số trang
                totalPosts, // Tổng số bài viết
                postsPerPage: limit, // Số bài viết mỗi trang
                hasNextPage: page < Math.ceil(totalPosts / limit), // Có trang tiếp theo không?
                hasPrevPage: page > 1 // Có trang trước đó không?
            }
        });
    } catch (error) {
        next(error); // Chuyển lỗi sang middleware xử lý lỗi
    }
}


//show single post
exports.showSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('postedBy', 'name email avatar')
            .populate('comments.postedBy', 'name avatar');
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        next(error);
    }

}


//delete post
exports.deletePost = async (req, res, next) => {
    try {
        const currentPost = await Post.findById(req.params.id);
        
        if (!currentPost) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is owner or admin
        if (currentPost.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('You are not authorized to delete this post', 403));
        }

        //delete post image in cloudinary       
        const ImgId = currentPost.image.public_id;
        if (ImgId) {
            await cloudinary.uploader.destroy(ImgId);
        }

        const post = await Post.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "post deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update post
exports.updatePost = async (req, res, next) => {
    try {
        const { category, content, image } = req.body;
        const currentPost = await Post.findById(req.params.id);

        if (!currentPost) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is owner or admin
        if (currentPost.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return next(new ErrorResponse('You are not authorized to update this post', 403));
        }

        //build the object data
        const data = {
            category: category || currentPost.category,
            content: content || currentPost.content,
        }

        //modify post image conditionally
        if (req.body.image !== '' && req.body.image !== undefined && req.body.image !== null) {
            // Delete old image if exists
            const ImgId = currentPost.image?.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'posts',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        } else if (currentPost.image) {
            // giữ hình ảnh hiện tại nếu không có hình ảnh mới được cung cấp
            data.image = currentPost.image;
        }

        const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            postUpdate
        })

    } catch (error) {
        next(error);
    }

}

//add comment
exports.addComment = async (req, res, next) => {
    const { comment } = req.body;
    try {
        const postComment = await Post.findByIdAndUpdate(req.params.id, { // thêm bình luận vào mảng comments
            $push: { comments: { text: comment, postedBy: req.user._id } } // push thêm phần tử vào mảng
        },
            { new: true }
        );
        // Lấy post cùng với thông tin người bình luận
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email avatar');
        
        // Create notification for post owner
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            const notification = await createNotification({
                recipient: post.postedBy._id,
                sender: req.user._id,
                post: post._id,
                type: 'comment',
                message: `${req.user.name} commented on your post`
            });
            
            if (notification && global.io) {
                // Emit socket event for real-time notification
                const populatedNotification = await notification.populate('sender', 'name avatar');
                global.io.to(`user-${post.postedBy._id}`).emit('new-notification', {
                    ...populatedNotification.toObject(),
                    unreadCount: true
                });
            }
        }
        
        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }

}


//add like
exports.addLike = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        },
            { new: true }
        ).populate('postedBy', '_id name avatar');
        
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name avatar');
        if (global.io) { // gửi sự kiện real-time cho tất cả kết nối khi có like mới
            global.io.emit('add-like', posts); 
        }
        
        // Create notification for post owner
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            const notification = await createNotification({
                recipient: post.postedBy._id,
                sender: req.user._id,
                post: post._id,
                type: 'like',
                message: `${req.user.name} liked your post`
            });
            
            if (notification && global.io) {
                
                // khi có like thì gửi thông báo real-time qua socket.io   
                const populatedNotification = await notification.populate('sender', 'name avatar');
                global.io.to(`user-${post.postedBy._id}`).emit('new-notification', {
                    ...populatedNotification.toObject(),
                    unreadCount: true
                });
            }
        }

        res.status(200).json({
            success: true,
            post,
            posts
        })

    } catch (error) {
        next(error);
    }

}


//remove like
exports.removeLike = async (req, res, next) => {

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        },
            { new: true }
        );

        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name avatar');
        if (global.io) {
            global.io.emit('remove-like', posts);
        }

        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }

}

//Full-text Search kết hợp với Relevance Scoring (mức độ liên quan)
//Logic search = debounce + gửi API + backend xử lý bằng aggregation + text index + tính điểm + phân trang + trả về kết quả phù hợp nhất.
// tóm tắt 
// Debounce (Chờ người dùng nhập xong):
// Server nhận từ khóa, tìm bài viết trong database có chứa từ khóa đó (ở tiêu đề, nội dung, hoặc tên người đăng).
// Server tính điểm cho từng bài viết: bài nào khớp từ khóa nhiều, nhiều like, nhiều comment, mới đăng sẽ được ưu tiên lên trên.
// Server chỉ trả về một số bài viết phù hợp nhất (theo trang), không trả hết tất cả.
//Giao diện hiển thị các bài viết liên quan nhất cho người dùng.
// ============================================
exports.searchPosts = async (req, res, next) => {
    try {
        const { query, sortBy = 'relevance', page = 1, limit = 10 } = req.query; // Lấy tham số từ query string với giá trị mặc định

        if (!query || query.trim() === '') { // nếu không có từ khóa thì báo lỗi
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchQuery = query.trim(); // Chuẩn hóa từ khóa tìm kiếm
        const skip = (parseInt(page) - 1) * parseInt(limit); // Tính số bản ghi cần bỏ qua
        const searchRegex = new RegExp(searchQuery, 'i'); // Tạo regex không phân biệt hoa thường, regex là công cụ tìm kiếm mạnh mẽ trong MongoDB để tìm các chuỗi con trong văn bản.

        // ============================================
        //  MONGODB AGGREGATION PIPELINE , tạo stage mảng
        // ============================================
        const pipeline = [
            // bước 1 : tìm kiếm thông tin user (kết nối với collection User)
            // kết nối post với user để lấy thông tin người đăng bài dựa trên postyedBy
            // lookup , kết nối những collection với nhau
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy'
                }
            },
            {
                $unwind: '$postedBy' // tách mảng user thành các document riêng biệt để dễ dàng truy cập các trường bên trong
            },
            
            // Bước 2 dùng $match và $or để lọc các bài viết có category, content hoặc tên người đăng khớp với từ khóa tìm kiếm.
            // or: hoặc
            // math : lọc các bài viết có từ khóa trong category, content hoặc tên người đăng
            {
                $match: {
                    $or: [
                        { category: searchRegex },
                        { content: searchRegex },
                        { 'postedBy.name': searchRegex }
                    ]
                }
            },
            
            //Bước 3 dùng $addFields để tính điểm phù hợp cho từng bài viết dựa trên mức độ khớp từ khóa, số like, số comment và độ mới của bài viết.
            {
                $addFields: {
                    // Category score
                    // eq toán tử so sánh bằng 
                    categoryScore: { 
                        $cond: [ // tương tự if else
                            { $regexMatch: { input: { $toLower: '$category' }, regex: searchQuery.toLowerCase() } }, // xem catagory có khớp với từ tìm kiếm không
                            { $cond: [ 
                                { $eq: [{ $toLower: '$category' }, searchQuery.toLowerCase()] },  // nếu category là chũ thường 
                                100,  // Exact match
                                50    // Partial match
                            ]},
                            0
                        ]
                    },
                    // điểm tên user
                    usernameScore: {
                        $cond: [
                            { $regexMatch: { input: { $toLower: '$postedBy.name' }, regex: searchQuery.toLowerCase() } },
                            { $cond: [
                                { $eq: [{ $toLower: '$postedBy.name' }, searchQuery.toLowerCase()] }, // trùng khớp 100% thì 80 điểm, còn khớp từ khóa thì 40 điểm
                                80,   // Exact match
                                40    // Partial match
                            ]},
                            0
                        ]
                    },
                    // điểm nội dung
                    // regexMatch kiểm tra xem một chuỗi có khớp với biểu thức chính quy hay không
                    contentScore: {
                        $cond: [
                            { $regexMatch: { input: { $toLower: '$content' }, regex: searchQuery.toLowerCase() } },
                            20,
                            0
                        ]
                    },
                    // điểm tương tác 
                    //  size lấy số lượng phần tử trong mảng, multiply toán tử nhân
                    likesScore: { $size: '$likes' }, // 1 like = 1 điểm
                    commentsScore: { $multiply: [{ $size: '$comments' }, 0.5] }, // 1 comment = 0.5 điểm
                    // điểm mới nhất
                    freshnessScore: {
                        $cond: [
                            { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                            10,  // < 7 days, gte: toán tử lớn hơn hoặc bằng
                            { $cond: [
                                { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                                5,   // < 30 days
                                0
                            ]}
                        ]
                    }
                }
            },
            
            // Bước 4 dùng $addFields để cộng và làm tròn các điểm thành relevanceScore, 
            // đồng thời tính số lượng like và comment cho mỗi bài viết.
            // addFields thêm trường mới vào document hiện tại
            // round làm tròn số
            // add: toán tử cộng
            {
                $addFields: {
                    relevanceScore: { 
                        $round: [{ // làm tròn số
                            $add: [ // cộng các điểm lại với nhau
                                '$categoryScore',
                                '$usernameScore', 
                                '$contentScore',
                                '$likesScore',
                                '$commentsScore',
                                '$freshnessScore'
                            ]
                        }]
                    },
                    likesCount: { $size: '$likes' }, // tính số lượt thích
                    commentsCount: { $size: '$comments' } // tính số lượt bình luận
                }
            },
            
            // Bước 5 dùng $project để chỉ lấy các trường cần thiết trong kết quả trả về, giảm thiểu dung lượng dữ liệu.
            {
                $project: { // chọn các trường cần thiết để trả về
                    category: 1, // 1 là lấy trường đó, 0 là không lấy
                    content: 1,
                    image: 1,
                    likes: 1,
                    comments: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    relevanceScore: 1,
                    'postedBy._id': 1,
                    'postedBy.name': 1,
                    'postedBy.email': 1,
                    'postedBy.avatar': 1
                }
            }
        ];
        
        // bước 6 : Sắp xếp để sẽ quyết định thứ tự kết quả trả về
        // sắp xếp từ cao đến thấp dựa trên tiêu chí được chọn
        let sortStage = {}; // Default
        if (sortBy === 'relevance') { // sắp xếp theo điểm phù hợp
            sortStage = { relevanceScore: -1, createdAt: -1 }; // -1 là giảm dần
        } else if (sortBy === 'likes') { // sắp xếp theo lượt thích 
            sortStage = { likesCount: -1, createdAt: -1 };
        } else if (sortBy === 'recent') { // sắp xếp theo bài viết mới nhất
            sortStage = { createdAt: -1 };
        }
        pipeline.push({ $sort: sortStage }); // thêm bước sắp xếp vào pipeline

        //Đếm tổng số kết quả (trước phân trang), count là toán tử đếm số lượng document
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Post.aggregate(countPipeline);
        const totalResults = countResult[0]?.total || 0;

        // bước 7 : phân trang bằng cách
        //  sử dụng $skip và $limit loại bỏ các bản ghi không cần thiết và giới hạn số lượng kết quả trả về.
        pipeline.push({ $skip: skip }); // bỏ qua số bản ghi đã tính toán
        pipeline.push({ $limit: parseInt(limit) }); // giới hạn số lượng kết quả trả về

        // Thực thi câu lệnh aggregation với pipeline đã xây dựng ở trên
        // Để lấy các danh sách bài viết phù hợp với từ khóa tìm kiếm , trả về kết quả dưới dạng json cho client
        const posts = await Post.aggregate(pipeline);
        // trả về kết quả dưới dạng json
        res.status(200).json({
            success: true,
            posts, // danh sách bài viết
            totalResults, // tổng số kết quả tìm được
            currentPage: parseInt(page), // trang hiện tại
            totalPages: Math.ceil(totalResults / parseInt(limit)), // tính tổng số trang
            query: searchQuery, // từ khóa tìm kiếm
            algorithm: 'MongoDB Aggregation (Optimized)',
            performance: { // thông tin về hiệu suất
                method: 'Database-level processing',
                speedImprovement: '10-50x faster',
                memoryUsage: 'Minimal (streaming)',
                scalability: 'Supports millions of posts'
            }
        });

    } catch (error) {
        console.log('Search error:', error);
        next(error);
    }
};


// ============================================
//  Gợi ý tìm kiếm - MongoDB Aggregation
// ============================================
exports.getSearchSuggestions = async (req, res, next) => {
    try {
        const { query } = req.query; // lấy từ khóa tìm kiếm từ query string


        if (!query || query.trim().length < 2) {
            // nếu người dùng chưa nhập gì hoặc nhập ít hơn 2 ký tự, trả về gợi ý "trending"
            const trendingSuggestions = await Post.aggregate([ // lấy các bài viết phổ biến nhất
                {
                    $addFields: { // thêm trường likesCount để đếm số lượt thích
                        likesCount: { $size: '$likes' } // tính số lượt thích
                    }
                },
                {
                    $sort: { likesCount: -1, createdAt: -1 } // sắp xếp theo số lượt thích giảm dần
                },
                {
                    $limit: 5  // lấy ra 5 bài viết được thích nhiều nhất
                },
                {   // Join với collection users để lấy tên người đăng
                    $lookup: {
                        from: 'users',
                        localField: 'postedBy',
                        foreignField: '_id',
                        as: 'postedBy'
                    }
                },
                {
                    $unwind: '$postedBy' // giải nén mảng users
                },
                {
                    $project: { // định dạng kết quả trả về
                        text: '$category', // sử dụng thể loại làm văn bản gợi ý
                        type: { $literal: 'trending' }, // loại gợi ý là "trending"
                        subtitle: {
                            $concat: [
                                { $substr: ['$content', 0, 50] }, // lấy 50 ký tự đầu của nội dung
                                '... - by ',
                                '$postedBy.name'
                            ]
                        }
                    }
                }
            ]);

            return res.status(200).json({ // trả về gợi ý trending
                success: true,
                suggestions: trendingSuggestions
            });
        }

        const searchQuery = query.trim(); // lấy chuỗi tìm kiếm và loại bỏ khoảng trắng thừa
        const searchRegex = new RegExp(searchQuery, 'i'); // tạo regex không phân biệt hoa thường
        
        // ============================================
        //  SMART SUGGESTIONS using Aggregation
        // ============================================
        // gợi ý dựa trên thể loại, tên người dùng và từ khóa trong nội dung khi nhập vào ô tìm kiếm 
        const suggestions = await Post.aggregate([
            // Join with users
            {
                $lookup: { // Join với collection users để lấy thông tin người đăng
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy'
                }
            },
            {
                $unwind: '$postedBy' // giải nén mảng users
            },
            
            // lọc các bài viết có chứa từ khóa trong category, content, hoặc tên người đăng.
            {
                $match: { // lọc bài viết khớp với từ khóa tìm kiếm
                    $or: [
                        { category: searchRegex }, // lọc theo thể loại
                        { content: searchRegex }, // lọc theo nội dung
                        { 'postedBy.name': searchRegex } // lọc theo tên người đăng 
                    ]
                }
            },
            
            // Chia thành 3 nhóm gợi ý  category, username và từ khóa trong nội dung để có các gợi ý duy nhất
            {
                $facet: {
                    // gợi ý thể loại (category)
                    categories: [
                        {   // Lọc theo thể loại
                            $group: {
                                _id: '$category', // nhóm theo thể loại
                                count: { $sum: 1 },// đếm số bài viết trong mỗi thể loại
                                totalLikes: { $sum: { $size: '$likes' } } // tổng số lượt thích trong mỗi thể loại
                            }
                        },
                        {
                            $match: { _id: searchRegex } // chỉ lấy những thể loại khớp với từ khóa tìm kiếm
                        },
                        {   // Định dạng kết quả gợi ý thể loại
                            $project: {
                                text: '$_id',
                                type: { $literal: 'category' }, // loại gợi ý là "category"
                                subtitle: { // phụ đề hiển thị số bài viết và lượt thích
                                    $concat: [
                                        { $toString: '$count' }, // chuyển số bài viết thành chuỗi
                                        ' posts, ',
                                        { $toString: '$totalLikes' }, // chuyển số lượt thích thành chuỗi
                                        ' likes'
                                    ]
                                },
                                score: { $multiply: ['$count', 10] } // điểm dựa trên số bài viết trong thể loại
                            }
                        },
                        { $limit: 3 } // giới hạn 3 gợi ý thể loại
                    ],
                    
                    // User suggestions
                    users: [
                        {
                            $match: { 'postedBy.name': searchRegex } // lọc theo tên người dùng
                        },
                        {
                            $group: { // nhóm theo tên người dùng
                                _id: '$postedBy.name',
                                postCount: { $sum: 1 } // đếm số bài viết của mỗi người dùng
                            }
                        },
                        {   // định dạng kết quả gợi ý người dùng
                            $project: {
                                text: '$_id', // tên người dùng 
                                type: { $literal: 'user' }, // loại gợi ý là "user"
                                subtitle: {
                                    $concat: [ // phụ đề hiển thị số bài viết của người dùng
                                        'Author - ',
                                        { $toString: '$postCount' },
                                        ' posts'
                                    ]
                                },
                                score: { $multiply: ['$postCount', 5] } // điểm dựa trên số bài viết của người dùng
                            }
                        },
                        { $limit: 3 } // giới hạn 3 gợi ý người dùng
                    ],
                    
                    // gợi ý từ khóa (keywords) trong nội dung bài viết
                    keywords: [
                        {
                            $match: { content: searchRegex } // lọc theo nội dung bài viết
                        },
                        {
                            $project: {
                                // tách nội dung thành các từ và lọc từ có độ dài >= 4 ký tự và khớp với từ khóa tìm kiếm
                                words: {
                                    $filter: {
                                        input: { $split: [{ $toLower: '$content' }, ' '] }, // tách nội dung thành mảng từ
                                        as: 'word',
                                        cond: { // điều kiện lọc
                                            $and: [
                                                { $gte: [{ $strLenCP: '$$word' }, 4] }, // từ có độ dài >= 4 ký tự
                                                { $regexMatch: { input: '$$word', regex: searchQuery.toLowerCase() } } // từ khớp với từ khóa tìm kiếm
                                            ]
                                        }
                                    }
                                } // kết thúc lọc từ
                            }
                        },
                        { $unwind: '$words' }, // tách từng từ thành các tài liệu riêng biệt
                        {
                            $group: { // nhóm theo từ
                                _id: '$words',
                                count: { $sum: 1 } // đếm số lần từ xuất hiện
                            }
                        },
                        {
                            $project: { // định dạng kết quả gợi ý từ khóa
                                text: '$_id',
                                type: { $literal: 'keyword' }, // loại gợi ý là "keyword"
                                subtitle: { $literal: 'Keyword' }, // phụ đề hiển thị "Keyword"
                                score: '$count' // điểm dựa trên số lần từ xuất hiện
                            }
                        },
                        { $sort: { score: -1 } }, // sắp xếp theo điểm giảm dần
                        { $limit: 2 } // giới hạn 2 gợi ý từ khóa
                    ] 
                }
            },
            
            // kết hợp tất cả các gợi ý từ 3 nhóm trên
            {
                $project: {
                    suggestions: {
                        $concatArrays: ['$categories', '$users', '$keywords'] // kết hợp mảng gợi ý từ 3 nhóm
                    }
                }
            },
            { $unwind: '$suggestions' }, // tách từng gợi ý thành các tài liệu riêng biệt
            { $replaceRoot: { newRoot: '$suggestions' } }, // thay thế root bằng gợi ý
            { $sort: { score: -1 } }, // sắp xếp theo điểm giảm dần
            { $limit: 8 } // giới hạn 8 gợi ý tổng cộng
        ]);

        res.status(200).json({ // trả về kết quả gợi ý tìm kiếm
            success: true,
            suggestions: suggestions
        });

    } catch (error) {
        console.log('Suggestions error:', error);
        next(error);
    }
};

// hàm này tính điểm tương đồng giữa hai chuỗi để có thể sử dụng cho các mục đích khác nhau (như gợi ý tìm kiếm, phân loại nội dung, v.v.)
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    // điều kiện kiểm tra nếu một chuỗi chứa chuỗi kia
    if (str2.includes(str1)) {
        return 0.8 + (str1.length / str2.length) * 0.2;
    }
    if (str1.includes(str2)) {
        return 0.8 + (str2.length / str1.length) * 0.2;
    }
    
    // tính khoảng cách Levenshtein
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Khởi tạo ma trận
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Điền ma trận để tính khoảng cách Levenshtein
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // thay thế
                    matrix[i][j - 1] + 1,     // chèn
                    matrix[i - 1][j] + 1      // xóa
                );
            }
        }
    }

    // Tính khoảng cách Levenshtein và chuyển đổi thành điểm tương đồng
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}


// lấy trending topic 
exports.getTrendingTopics = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        // Aggregate posts by category with counts and likes
        const trendingTopics = await Post.aggregate([
            {
                $group: {
                    _id: '$category',
                    postCount: { $sum: 1 },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalComments: { $sum: { $size: '$comments' } },
                    latestPost: { $max: '$createdAt' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    postCount: 1,
                    totalLikes: 1,
                    totalComments: 1,
                    latestPost: 1,
                    // Calculate trending score: likes + comments + recency bonus
                    trendingScore: {
                        $add: [
                            '$totalLikes',
                            { $multiply: ['$totalComments', 0.5] },
                            '$postCount'
                        ]
                    }
                }
            },
            {
                $sort: { trendingScore: -1, postCount: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            topics: trendingTopics
        });

    } catch (error) {
        console.log('Trending topics error:', error);
        next(error);
    }
};


// Lấy gợi ý người dùng tích cực
exports.getSuggestedUsers = async (req, res, next) => {
    try {
        const User = require('../models/userModel');
        const limit = parseInt(req.query.limit) || 5;
        const currentUserId = req.user ? req.user._id : null;
        
        // Get users with their post counts
        const users = await User.aggregate([
            // Exclude current user if logged in
            ...(currentUserId ? [{ $match: { _id: { $ne: currentUserId } } }] : []),
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'postedBy',
                    as: 'posts'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    avatar: 1,
                    createdAt: 1,
                    postCount: { $size: '$posts' },
                    totalLikes: {
                        $sum: {
                            $map: {
                                input: '$posts',
                                as: 'post',
                                in: { $size: '$$post.likes' }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    activityScore: {
                        $add: [
                            { $multiply: ['$postCount', 10] },
                            '$totalLikes'
                        ]
                    }
                }
            },
            {
                $sort: { activityScore: -1, createdAt: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.log('Suggested users error:', error);
        next(error);
    }
};

// Get category counts (số lượng bài viết theo từng category)
exports.getCategoryCounts = async (req, res, next) => {
    try {
        // Get total count
        const totalPosts = await Post.countDocuments();
        
        // Get counts by category
        const categoryCounts = await Post.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format response
        const counts = {
            'All Posts': totalPosts,
        };

        categoryCounts.forEach(item => {
            counts[item._id] = item.count;
        });

        res.status(200).json({
            success: true,
            counts
        });

    } catch (error) {
        console.log('Category counts error:', error);
        next(error);
    }
};

// Get dashboard statistics - optimized for admin dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const User = require('../models/userModel');
        const Contact = require('../models/contactModel');

        // Calculate date for 30 days ago
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Run all queries in parallel
        const [
            totalPosts,
            postsLast30Days,
            totalUsers,
            usersLast30Days,
            totalContacts,
            pendingContacts,
            likesAndComments,
            categoryStats,
            topPosts,
            topUsers
        ] = await Promise.all([
            // Total posts
            Post.countDocuments(),
            
            // Posts in last 30 days
            Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            
            // Total users
            User.countDocuments(),
            
            // Users in last 30 days
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            
            // Total contacts
            Contact.countDocuments(),
            
            // Pending contacts
            Contact.countDocuments({ status: 'pending' }),
            
            // Total likes and comments
            Post.aggregate([
                {
                    $group: {
                        _id: null,
                        totalLikes: { $sum: { $size: '$likes' } },
                        totalComments: { $sum: { $size: '$comments' } }
                    }
                }
            ]),
            
            // Category statistics
            Post.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        totalLikes: { $sum: { $size: '$likes' } },
                        totalComments: { $sum: { $size: '$comments' } }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            
            // Top performing posts
            Post.aggregate([
                {
                    $addFields: {
                        engagement: { $add: [{ $size: '$likes' }, { $size: '$comments' }] }
                    }
                },
                { $sort: { engagement: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postedBy',
                        foreignField: '_id',
                        as: 'postedBy'
                    }
                },
                { $unwind: '$postedBy' },
                {
                    $project: {
                        content: 1,
                        likes: { $size: '$likes' },
                        comments: { $size: '$comments' },
                        'postedBy.name': 1
                    }
                }
            ]),
            
            // Most active users
            Post.aggregate([
                {
                    $group: {
                        _id: '$postedBy',
                        postCount: { $sum: 1 },
                        totalLikes: { $sum: { $size: '$likes' } },
                        totalComments: { $sum: { $size: '$comments' } }
                    }
                },
                { $sort: { postCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: {
                        name: '$user.name',
                        count: '$postCount',
                        likes: '$totalLikes',
                        comments: '$totalComments'
                    }
                }
            ])
        ]);

        // Calculate statistics
        const stats = likesAndComments[0] || { totalLikes: 0, totalComments: 0 };
        const postsGrowth = totalPosts > 0 ? ((postsLast30Days / totalPosts) * 100).toFixed(1) : 0;
        const usersGrowth = totalUsers > 0 ? ((usersLast30Days / totalUsers) * 100).toFixed(1) : 0;
        const avgEngagement = totalPosts ? ((stats.totalLikes + stats.totalComments) / totalPosts).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalPosts,
                    totalUsers,
                    totalContacts,
                    pendingContacts,
                    totalLikes: stats.totalLikes,
                    totalComments: stats.totalComments,
                    postsLast30Days,
                    usersLast30Days,
                    postsGrowth: parseFloat(postsGrowth),
                    usersGrowth: parseFloat(usersGrowth),
                    avgEngagement: parseFloat(avgEngagement)
                },
                categoryStats: categoryStats.map(cat => ({
                    category: cat._id || 'Other',
                    count: cat.count,
                    likes: cat.totalLikes,
                    comments: cat.totalComments
                })),
                topPosts: topPosts.map(post => ({
                    _id: post._id,
                    content: post.content,
                    likes: post.likes,
                    comments: post.comments,
                    postedBy: {
                        name: post.postedBy.name
                    }
                })),
                topUsers: topUsers.map(user => ({
                    _id: user._id,
                    name: user.name,
                    count: user.count,
                    likes: user.likes,
                    comments: user.comments
                }))
            }
        });

    } catch (error) {
        console.log('Dashboard stats error:', error);
        next(error);
    }
};

// Lấy tất cả bài viết cho admin với phân trang và tìm kiếm
exports.getAllPostsForAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        // Build search filter
        let filter = {};
        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, 'i');
            filter = {
                $or: [
                    { content: searchRegex },
                    { category: searchRegex }
                ]
            };
        }

        // Get total count with filter
        const totalPosts = await Post.countDocuments(filter);

        // Get posts with pagination - chỉ select các trường cần thiết
        const posts = await Post.find(filter)
            .select('content category image likes comments createdAt postedBy')
            .populate('postedBy', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Convert to plain JavaScript objects for better performance

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts,
                postsPerPage: limit,
                hasNextPage: page < Math.ceil(totalPosts / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.log('Get all posts for admin error:', error);
        next(error);
    }
};
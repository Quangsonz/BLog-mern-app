const axios = require('axios');

// System prompt cho Community Assistant
const SYSTEM_PROMPT = `Bạn là Trợ lý Cộng đồng (Community Assistant) chính thức của website mạng xã hội **D2S Blog Platform**.

**VAI TRÒ & TRÁCH NHIỆM:**
Bạn có trách nhiệm hỗ trợ người dùng trong các tình huống sau:
1. Trả lời câu hỏi thường gặp (FAQs) về tính năng của website
2. Cung cấp hướng dẫn chi tiết về các bước sử dụng
3. Xử lý báo cáo lỗi hoặc vấn đề bằng cách thu thập thông tin và chuyển hướng chính xác
4. Giải đáp thắc mắc về quy định, chính sách sử dụng
5. Hỗ trợ kỹ thuật cơ bản và hướng dẫn khắc phục sự cố

**THÔNG TIN VỀ D2S BLOG PLATFORM:**

📌 **Tính năng chính:**
- ✍️ Đăng bài viết với Rich Text Editor (hỗ trợ định dạng văn bản, chèn hình ảnh)
- 📂 Phân loại bài viết theo category: Technology, Design, Business, Lifestyle, Other
- ❤️ Like/Unlike bài viết với cập nhật real-time
- 💬 Bình luận với thông báo thời gian thực (Socket.io)
- 🔔 Hệ thống thông báo khi có người like hoặc comment
- 🔍 Tìm kiếm nâng cao với fuzzy matching
- 📊 Filter và Sort bài viết (Latest, Most Popular, Most Commented)
- 👤 Hồ sơ cá nhân với avatar tùy chỉnh
- 📧 Form liên hệ với admin
- 🛡️ Bảo mật với JWT authentication

📌 **Vai trò người dùng:**
- **User:** Đăng bài, like, comment, chỉnh sửa bài viết của mình
- **Admin:** Quản lý toàn bộ users, posts, contacts, xem analytics

📌 **Hướng dẫn sử dụng phổ biến:**
1. **Đăng ký tài khoản:** Nhấn "Đăng ký" → Nhập tên, email, mật khẩu (tối thiểu 6 ký tự)
2. **Tạo bài viết:** Đăng nhập → Nhấn nút "Tạo bài viết" → Chọn category → Viết nội dung → Upload ảnh (tùy chọn) → Đăng
3. **Tương tác:** Like bài viết (icon trái tim), Comment (icon bình luận)
4. **Tìm kiếm:** Sử dụng thanh search ở navbar → Nhập từ khóa → Xem kết quả
5. **Chỉnh sửa bài viết:** Mở bài viết của bạn → Nhấn icon "..." → Chọn "Edit"
6. **Cập nhật avatar:** Vào Profile → Nhấn vào ảnh đại diện → Upload ảnh mới

📌 **Xử lý lỗi thường gặp:**
- **Không đăng nhập được:** Kiểm tra email/mật khẩu, xóa cache/cookies, reset mật khẩu
- **Upload ảnh thất bại:** Kiểm tra dung lượng (tối đa 5MB), định dạng (JPG, PNG), kết nối mạng
- **Không nhận thông báo:** Kiểm tra kết nối internet, reload trang, đăng xuất/đăng nhập lại
- **Bài viết bị mất:** Liên hệ admin qua form Contact, cung cấp ID bài viết nếu có

**TÍNH CÁCH & TÔNG GIỌNG:**
- ✅ Luôn **thân thiện, chuyên nghiệp, hỗ trợ, và đồng cảm**
- ✅ Sử dụng **Tiếng Việt tự nhiên**, tránh từ ngữ máy móc
- ✅ **KHÔNG BAO GIỜ** nói "Tôi là AI", "Tôi là mô hình ngôn ngữ", "Tôi là chatbot"
- ✅ Bắt đầu bằng **lời chào ngắn gọn (không quá 1 câu)**
- ✅ Kết thúc bằng **câu hỏi gợi mở** hoặc **lời mời gọi hành động** (Call to Action)
- ✅ Sử dụng emoji phù hợp để tạo không khí thân thiện (nhưng không lạm dụng)
- ✅ Nếu không chắc chắn, hãy thừa nhận và đề xuất liên hệ admin

**CÁCH TRẢ LỜI:**
- 📝 **QUY TẮC BẮT BUỘC: HÃY TRẢ LỜI NGẮN GỌN VÀ SÚC TÍCH NHẤT CÓ THỂ.**
- 🎯 Đi thẳng vào vấn đề, **chỉ cung cấp thông tin cần thiết**
- 📏 **Độ dài tối đa:** **1 đến 3 câu** cho câu hỏi đơn giản, và **không quá 5 gạch đầu dòng** cho các bước hướng dẫn.
- 💡 Đưa ra ví dụ minh họa **ngắn** khi giải thích các bước
- 🔗 Đề xuất các tính năng liên quan nếu phù hợp
- ❓ Luôn hỏi lại nếu người dùng cần thêm thông tin

**VÍ DỤ CÁCH TRẢ LỜI TỐT:**
❌ Tránh: "Chào bạn! Mình có thể giúp gì cho bạn hôm nay? Rất vui được hỗ trợ bạn về D2S Blog Platform. Đây là các bước bạn cần làm để đăng ký tài khoản..." (Dài dòng, nhiều câu chào)
✅ **Nên:** "Chào bạn! Để đăng ký tài khoản, bạn chỉ cần nhấn **'Đăng ký'** và nhập thông tin (tên, email, mật khẩu tối thiểu 6 ký tự) là xong. Bạn còn cần hỗ trợ gì khác không? 😊"

❌ Tránh: "Theo dữ liệu được cung cấp, tính năng này hoạt động như sau..."
✅ Nên: "Để đăng bài viết mới, bạn làm theo các bước sau nhé..."

❌ Tránh: "Tôi không có thông tin về vấn đề này."
✅ Nên: "Hmm, mình chưa rõ về trường hợp này lắm. Bạn có thể liên hệ với admin qua form Contact để được hỗ trợ tốt hơn nhé!"
`;

// Gửi tin nhắn tới Gemini Flash API
exports.sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập câu hỏi của bạn'
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'API key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env'
            });
        }

        // Kết hợp system prompt với user message
        const fullPrompt = `${SYSTEM_PROMPT}

---

**CÂU HỎI TỪ NGƯỜI DÙNG:**
${message}

**HƯỚNG DẪN TRẢ LỜI:**
- Trả lời như một trợ lý cộng đồng thật sự, không phải AI
- Giữ giọng điệu thân thiện, tự nhiên
- Đưa ra hướng dẫn cụ thể, dễ hiểu
- Kết thúc bằng câu hỏi hoặc lời mời hành động
- Sử dụng emoji phù hợp`;

        // Gọi Gemini 2.5 Flash API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Lấy response từ Gemini
        const geminiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
            'Xin lỗi, mình không thể trả lời lúc này. Bạn thử hỏi lại câu hỏi nhé! 😊';

        res.status(200).json({
            success: true,
            message: geminiResponse,
            role: 'Community Assistant'
        });

    } catch (error) {
        console.error('Gemini API Error:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
        
        // Handle specific error cases
        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                error: 'Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại.',
                details: 'Rate limit exceeded'
            });
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            return res.status(401).json({
                success: false,
                error: 'API key không hợp lệ hoặc hết hạn. Vui lòng kiểm tra GEMINI_API_KEY trong file .env',
                details: error.response?.data?.error?.message || 'Invalid API key'
            });
        }

        if (error.response?.status === 400) {
            return res.status(400).json({
                success: false,
                error: 'Yêu cầu không hợp lệ. Vui lòng thử lại.',
                details: error.response?.data?.error?.message || 'Bad request'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Có lỗi xảy ra. Vui lòng thử lại sau nhé! 😊',
            details: error.response?.data?.error?.message || error.message
        });
    }
};

// Get conversation context
exports.getContext = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            context: {
                role: 'Community Assistant',
                platform: 'D2S Blog Platform',
                focus: 'User Support & Guidance',
                capabilities: [
                    'Trả lời câu hỏi về tính năng',
                    'Hướng dẫn sử dụng chi tiết',
                    'Xử lý báo cáo lỗi',
                    'Hỗ trợ kỹ thuật cơ bản'
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};

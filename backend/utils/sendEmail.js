const nodemailer = require('nodemailer');

// Kiểm tra email đã được cấu hình chưa
const isEmailConfigured = () => {
    return (
        process.env.EMAIL_USER && 
        process.env.EMAIL_PASS
    );
};

// Tạo transporter để gửi email
// transporter là đối tượng chịu trách nhiệm gửi email thông qua dịch vụ email đã cấu hình
const createTransporter = () => {
    if (!isEmailConfigured()) {
        console.log('⚠️  Email configuration missing or invalid');
        return null;
    }

    console.log(' Creating email transporter for:', process.env.EMAIL_USER);
    // trả về một transporter sử dụng dịch vụ Gmail
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Hàm gửi email phản hồi liên hệ
exports.sendReplyEmail = async (options) => {
    try {
        // Log giá trị biến môi trường
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
        console.log('Is configured:', isEmailConfigured());
        
        // Kiểm tra email đã cấu hình chưa
        if (!isEmailConfigured()) {
            console.log('⚠️  Email not configured. Cannot send reply email.');
            throw new Error('Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file.');
        }

        const transporter = createTransporter();
        
        if (!transporter) {
            throw new Error('Failed to create email transporter');
        }
        // Tùy chọn email với nội dung HTML được cải tiến
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Blog Support'}" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .message-box {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            border-left: 4px solid #667eea;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #ddd;
                            color: #666;
                            font-size: 14px;
                        }
                        .greeting {
                            margin-bottom: 20px;
                        }
                        .original-message {
                            background: #e8eaf6;
                            padding: 15px;
                            border-radius: 5px;
                            margin-top: 20px;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📧 Reply to Your Message</h1>
                    </div>
                    <div class="content">
                        <div class="greeting">
                            <p>Dear <strong>${options.name}</strong>,</p>
                            <p>Thank you for contacting us. We have received your message and here is our response:</p>
                        </div>
                        
                        <div class="message-box">
                            <h3 style="margin-top: 0; color: #667eea;">Our Response:</h3>
                            <p style="white-space: pre-wrap;">${options.replyMessage}</p>
                        </div>

                        <div class="original-message">
                            <h4 style="margin-top: 0; color: #666;">Your Original Message:</h4>
                            <p><strong>Subject:</strong> ${options.originalSubject}</p>
                            <p><strong>Message:</strong></p>
                            <p style="white-space: pre-wrap;">${options.originalMessage}</p>
                        </div>

                        <p style="margin-top: 30px;">
                            If you have any further questions, please don't hesitate to contact us again.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Best regards,<br><strong>${process.env.EMAIL_FROM_NAME || 'Blog Support Team'}</strong></p>
                        <p style="font-size: 12px; color: #999;">
                            This is an automated response. Please do not reply directly to this email.
                        </p>
                    </div>
                </body>
                </html>
            `
        };
        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
};


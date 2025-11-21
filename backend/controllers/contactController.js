const Contact = require('../models/contactModel');
const ErrorResponse = require('../utils/errorResponse');
const { sendReplyEmail, sendNewContactNotification } = require('../utils/sendEmail');

// Create contact message
exports.createContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return next(new ErrorResponse('Please provide all required fields', 400));
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Gửi email thông báo cho admin (tùy chọn - có thể bật/tắt)
        // if (process.env.SEND_ADMIN_NOTIFICATION === 'true') {
        //     await sendNewContactNotification(contact);
        // }

        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully! We will get back to you soon.',
            contact
        });
    } catch (error) {
        next(error);
    }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res, next) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const contacts = await Contact.find(query).sort({ createdAt: -1 });

        // Get statistics
        const stats = {
            total: await Contact.countDocuments(),
            pending: await Contact.countDocuments({ status: 'pending' }),
            replied: await Contact.countDocuments({ status: 'replied' }),
            closed: await Contact.countDocuments({ status: 'closed' })
        };

        res.status(200).json({
            success: true,
            count: contacts.length,
            stats,
            contacts
        });
    } catch (error) {
        next(error);
    }
};

// Get single contact (admin only)
exports.getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return next(new ErrorResponse('Contact message not found', 404));
        }

        res.status(200).json({
            success: true,
            contact
        });
    } catch (error) {
        next(error);
    }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res, next) => {
    try {
        const { status, replyMessage } = req.body;

        let contact = await Contact.findById(req.params.id);

        if (!contact) {
            return next(new ErrorResponse('Contact message not found', 404));
        }

        const updateData = { status };

        if (status === 'replied' && replyMessage) {
            updateData.replied = true;
            updateData.replyMessage = replyMessage;
            updateData.repliedAt = Date.now();

            // Gửi email phản hồi cho người dùng
            try {
                await sendReplyEmail({
                    email: contact.email,
                    name: contact.name,
                    subject: `Re: ${contact.subject}`,
                    replyMessage: replyMessage,
                    originalSubject: contact.subject,
                    originalMessage: contact.message
                });
                console.log('Reply email sent successfully to:', contact.email);
            } catch (emailError) {
                console.error('Failed to send reply email:', emailError);
                // Vẫn cập nhật status nhưng thông báo lỗi gửi email
                return res.status(200).json({
                    success: true,
                    message: 'Contact status updated but failed to send email. Please check email configuration.',
                    contact: await Contact.findByIdAndUpdate(
                        req.params.id,
                        updateData,
                        { new: true, runValidators: true }
                    ),
                    emailError: true
                });
            }
        }

        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: status === 'replied' 
                ? 'Reply sent successfully via email!' 
                : 'Contact status updated successfully',
            contact
        });
    } catch (error) {
        next(error);
    }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return next(new ErrorResponse('Contact message not found', 404));
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

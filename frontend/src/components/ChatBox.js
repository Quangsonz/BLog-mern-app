import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: '👋 **Xin chào! Mình là trợ lý cộng đồng của D2S Blog.**\n\nMình ở đây để giúp bạn:\n\n🔹 **Hướng dẫn sử dụng** các tính năng\n🔹 **Giải đáp thắc mắc** về cách đăng bài, like, comment\n🔹 **Hỗ trợ kỹ thuật** khi gặp sự cố\n🔹 **Trả lời các câu hỏi** về D2S Blog\n\n💬 Bạn cần hỗ trợ gì hôm nay?',
            sender: 'bot',
            timestamp: new Date(),
            isWelcome: true
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim()) return;

        // Thêm tin nhắn của user
        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Gọi API (không cần withCredentials vì chat không yêu cầu authentication)
            const response = await axios.post('/api/chat', {
                message: inputMessage
            });

            // Thêm phản hồi từ AI
            const botMessage = {
                text: response.data.message,
                sender: 'bot',
                timestamp: new Date(),
                role: response.data.role
            };
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                text: error?.response?.data?.error || 'Xin lỗi, có lỗi xảy ra. Bạn thử hỏi lại nhé! 😊',
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Quick action buttons
    const quickActions = [
        { label: 'Làm sao để đăng bài?', icon: '✍️', message: 'Hướng dẫn tôi cách đăng bài viết mới trên D2S Blog' },
        { label: 'Upload ảnh như thế nào?', icon: '📷', message: 'Tôi muốn biết cách upload và thêm ảnh vào bài viết' },
        { label: 'Cách like & comment', icon: '❤️', message: 'Hướng dẫn cách like và comment bài viết của người khác' }
    ];

    const handleQuickAction = (message) => {
        setInputMessage(message);
    };

    return (
        <div className="chatbox-container">
            {/* Floating Button */}
            <button 
                className={`chatbox-toggle community-assistant ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle Community Assistant"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbox-window community-assistant-theme">
                    {/* Header */}
                    <div className="chatbox-header community-assistant-header">
                        <div className="chatbox-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                            </svg>
                            <div className="status-indicator"></div>
                        </div>
                        <div className="chatbox-info">
                            <h3 className="chatbox-title">Trợ lý Cộng đồng</h3>
                            <p className="chatbox-subtitle">Sẵn sàng hỗ trợ bạn</p>
                        </div>
                        <button className="chatbox-close" onClick={toggleChat} aria-label="Close chat">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbox-messages">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.sender} ${msg.isError ? 'error' : ''} ${msg.isWelcome ? 'welcome' : ''}`}
                            >
                                <div className="message-content">
                                    {msg.sender === 'bot' && (
                                        <div className="bot-avatar-small">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    <div className="message-text">
                                        {msg.text.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line.split('**').map((part, j) => 
                                                    j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                                                )}
                                                {i < msg.text.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <div className="message-content">
                                    <div className="bot-avatar-small">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                        </svg>
                                    </div>
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div className="quick-actions">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="quick-action-btn"
                                    onClick={() => handleQuickAction(action.message)}
                                >
                                    <span className="action-icon">{action.icon}</span>
                                    <span className="action-label">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="chatbox-input-area">
                        <form className="chatbox-input-wrapper" onSubmit={sendMessage}>
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Bạn cần hỗ trợ gì? Hỏi mình nhé..."
                                disabled={isLoading}
                                className="chatbox-input"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(e);
                                    }
                                }}
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !inputMessage.trim()}
                                className="chatbox-send-btn"
                                aria-label="Send message"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;

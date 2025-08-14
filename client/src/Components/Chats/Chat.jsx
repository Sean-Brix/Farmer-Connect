import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Client/Components/Navbar.jsx'
import botAvatar from '../../Assets/default_picture.png';
import userAvatar from '../../Assets/eic_default.png';

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [currentView, setCurrentView] = useState('chat'); // 'chat', 'faq', 'inquiries'
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [currentInquiry, setCurrentInquiry] = useState(null); // Currently active inquiry being discussed
    
    // State for chat input and messages
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // New inquiry state
    const [newInquiry, setNewInquiry] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
    });

    // Handle body scroll when modal opens/closes
    useEffect(() => {
        if (open) {
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
            
            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        } else {
            // Restore background scrolling
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.removeProperty('--scrollbar-width');
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.removeProperty('--scrollbar-width');
        };
    }, [open]);

    // Sample FAQ data
    const [faqs] = useState([
        {
            id: 1,
            question: "How do I register for a seminar?",
            answer: "You can register for seminars by visiting the Seminar section in your dashboard and clicking on the 'Register' button for your desired seminar.",
            category: "Seminar"
        },
        {
            id: 2,
            question: "How do I reset my password?",
            answer: "To reset your password, click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
            category: "Account"
        },
        {
            id: 3,
            question: "What equipment is available for farmers?",
            answer: "We offer various farming equipment including tractors, irrigation systems, and harvesting tools. Check the Equipment section for availability.",
            category: "Equipment"
        },
        {
            id: 4,
            question: "How can I contact technical support?",
            answer: "You can contact technical support through this chat system, email us at support@fits-tanza.com, or call our helpline.",
            category: "General"
        }
    ]);

    // Sample user inquiries data
    const [userInquiries, setUserInquiries] = useState([
        {
            id: 1,
            subject: "Equipment Request",
            category: "Equipment",
            priority: "high",
            status: "in-progress",
            message: "I need to request a tractor for the upcoming planting season.",
            date: "2024-01-15",
            lastUpdate: "2024-01-16",
            replies: [
                { from: "user", message: "I need to request a tractor for the upcoming planting season.", time: "2024-01-15 10:30 AM" },
                { from: "admin", message: "Thank you for your request. We have tractors available. Please provide your farm location and preferred dates.", time: "2024-01-15 2:15 PM", responder: "Admin Sarah" },
                { from: "user", message: "My farm is located in Barangay San Jose. I need it from January 20-25.", time: "2024-01-16 8:45 AM" }
            ]
        },
        {
            id: 2,
            subject: "Seminar Registration Issue",
            category: "Seminar", 
            priority: "medium",
            status: "resolved",
            message: "I'm having trouble registering for the organic farming seminar.",
            date: "2024-01-10",
            resolvedDate: "2024-01-12",
            lastUpdate: "2024-01-12",
            replies: [
                { from: "user", message: "I'm having trouble registering for the organic farming seminar.", time: "2024-01-10 3:20 PM" },
                { from: "admin", message: "I can help you with that. What specific error are you encountering?", time: "2024-01-10 4:00 PM", responder: "Admin John" },
                { from: "user", message: "The registration button is not working when I click it.", time: "2024-01-11 9:15 AM" },
                { from: "admin", message: "The issue has been fixed. Please try again. You should now be able to register successfully.", time: "2024-01-12 10:30 AM", responder: "Admin John" },
                { from: "user", message: "It works now! Thank you so much for the help.", time: "2024-01-12 11:00 AM" }
            ]
        }
    ]);

    // Chat action functions to be accessed from bot reply buttons
    useEffect(() => {
        window.chatActions = {
            showFAQ: () => setCurrentView('faq'),
            showInquiries: () => setCurrentView('inquiries')
        };
        
        return () => {
            delete window.chatActions;
        };
    }, []);

    // Handle sending a message
    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        const userMsg = { from: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        // If there's a current inquiry, add message to it
        if (currentInquiry) {
            const newReply = {
                from: "user",
                message: message,
                time: new Date().toLocaleString()
            };
            
            setUserInquiries(prev => 
                prev.map(inquiry => 
                    inquiry.id === currentInquiry.id
                        ? { 
                            ...inquiry, 
                            lastUpdate: new Date().toLocaleDateString(),
                            replies: [...inquiry.replies, newReply]
                        }
                        : inquiry
                )
            );
            
            // Update current inquiry
            setCurrentInquiry(prev => ({
                ...prev,
                lastUpdate: new Date().toLocaleDateString(),
                replies: [...prev.replies, newReply]
            }));
        } else {
            // Create new inquiry automatically for first message
            const newInquiry = {
                id: Date.now(),
                subject: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                category: 'general',
                priority: 'medium',
                status: 'pending',
                message: message,
                date: new Date().toLocaleDateString(),
                lastUpdate: new Date().toLocaleDateString(),
                replies: [
                    { 
                        from: "user", 
                        message: message, 
                        time: new Date().toLocaleString() 
                    }
                ]
            };
            
            setUserInquiries(prev => [newInquiry, ...prev]);
            setCurrentInquiry(newInquiry);
        }
        
        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsBotTyping(true);
        
        setTimeout(() => {
            const botReply = getBotReply(message);
            const botMsg = { from: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, botMsg]);
            
            // Add bot reply to inquiry if there's a current inquiry
            if (currentInquiry) {
                const botReplyObj = {
                    from: "admin",
                    message: botReply.replace(/<[^>]*>/g, ''), // Remove HTML tags for storage
                    time: new Date().toLocaleString(),
                    responder: "FITS-Tanza Bot"
                };
                
                setUserInquiries(prev => 
                    prev.map(inquiry => 
                        inquiry.id === currentInquiry.id
                            ? { 
                                ...inquiry, 
                                lastUpdate: new Date().toLocaleDateString(),
                                replies: [...inquiry.replies, botReplyObj]
                            }
                            : inquiry
                    )
                );
                
                setCurrentInquiry(prev => ({
                    ...prev,
                    lastUpdate: new Date().toLocaleDateString(),
                    replies: [...prev.replies, botReplyObj]
                }));
            }
            
            setIsBotTyping(false);
        }, 1200);
    };

    // Handle new inquiry submission
    const handleInquirySubmit = (e) => {
        e.preventDefault();
        if (!newInquiry.subject.trim() || !newInquiry.message.trim()) return;
        
        const inquiry = {
            id: Date.now(),
            ...newInquiry,
            status: 'pending',
            date: new Date().toLocaleDateString(),
            lastUpdate: new Date().toLocaleDateString(),
            replies: [
                { 
                    from: "user", 
                    message: newInquiry.message, 
                    time: new Date().toLocaleString() 
                }
            ]
        };
        
        setUserInquiries(prev => [inquiry, ...prev]);
        setNewInquiry({ subject: '', category: 'general', priority: 'medium', message: '' });
        setCurrentView('inquiries');
        
        // Show success message
        alert('Inquiry submitted successfully! You can track its progress in your inquiries.');
    };

    // Handle continuing an inquiry (load into chat)
    const handleContinueInquiry = (inquiry) => {
        setCurrentInquiry(inquiry);
        
        // Load inquiry messages into chat
        const inquiryMessages = [
            { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ];
        
        // Add all replies as chat messages
        inquiry.replies.forEach(reply => {
            inquiryMessages.push({
                from: reply.from === 'user' ? 'user' : 'bot',
                text: reply.message,
                time: reply.time
            });
        });
        
        setMessages(inquiryMessages);
        setCurrentView('chat');
    };

    // Start new conversation
    const startNewConversation = () => {
        setCurrentInquiry(null);
        setMessages([
            { from: 'bot', text: 'Welcome to FITS-Tanza Support! 🌟 I\'m here to assist you with seminars, account management, and general inquiries. How may I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setCurrentView('chat');
    };

    // Handle marking inquiry as resolved
    const handleResolveInquiry = (inquiryId) => {
        setUserInquiries(prev => 
            prev.map(inquiry => 
                inquiry.id === inquiryId 
                    ? { 
                        ...inquiry, 
                        status: 'resolved',
                        resolvedDate: new Date().toLocaleDateString(),
                        lastUpdate: new Date().toLocaleDateString()
                    }
                    : inquiry
            )
        );
    };

    // Generate categorized FAQ display
    const generateFAQByCategory = () => {
        const categories = [...new Set(faqs.map(faq => faq.category))];
        return categories.map(category => {
            const categoryFaqs = faqs.filter(faq => faq.category === category);
            return `
                <div style="margin: 12px 0; padding: 16px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #10b981;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <span style="font-size: 16px;">${getCategoryIcon(category)}</span>
                        <strong style="color: #1f2937; font-size: 15px;">${category}</strong>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${categoryFaqs.map(faq => `
                            <button onclick="window.chatActions.selectFAQ('${faq.question}', '${faq.answer.replace(/'/g, "\\'")}', '${faq.category}')" 
                                style="text-align: left; padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #374151; hover:background: #f3f4f6;" 
                                onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#10b981'" 
                                onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">
                                💬 ${faq.question}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    };

    // Get category icon
    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'seminar': return '🎓';
            case 'account': return '👤';
            case 'equipment': return '🚜';
            case 'general': return '💬';
            default: return '📋';
        }
    };

    // Handle FAQ selection from bot responses
    useEffect(() => {
        window.chatActions = {
            showFAQ: () => setCurrentView('faq'),
            showInquiries: () => setCurrentView('inquiries'),
            selectFAQ: (question, answer, category) => {
                // Add the selected FAQ as a bot response
                const botResponse = {
                    from: 'bot',
                    text: `<div style="background: #f0fdf4; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981; margin: 8px 0;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 16px;">${getCategoryIcon(category)}</span>
                            <strong style="color: #166534;">${question}</strong>
                        </div>
                        <p style="color: #166534; margin: 0; line-height: 1.5;">${answer}</p>
                    </div>
                    <div style="margin-top: 12px;">
                        <p style="color: #6b7280; font-size: 13px;">Was this helpful? Feel free to ask if you need more assistance!</p>
                    </div>`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                
                setMessages(prev => [...prev, botResponse]);
            }
        };
        
        return () => {
            delete window.chatActions;
        };
    }, [faqs]);

    // Enhanced bot reply logic with professional styling
    function getBotReply(userMsg) {
        const lower = userMsg.toLowerCase();
        if (lower.includes('hello') || lower.includes('hi')) {
            return `Hi there! 😊 How can I assist you today?<br><br>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
                        <button onclick="window.chatActions.showFAQ()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 10px 16px; border: none; border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.3)'">📋 View FAQ</button>
                        <button onclick="window.chatActions.showInquiries()" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 10px 16px; border: none; border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(59, 130, 246, 0.3)'">📝 My Inquiries</button>
                    </div>`;
        }
        if (lower.includes('help') || lower.includes('faq') || lower.includes('frequently') || lower.includes('question')) {
            return `I can help you with these topics. Click on any question below:<br><br>
                    ${generateFAQByCategory()}
                    <div style="margin-top: 16px; padding: 12px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <p style="margin: 0; color: #1e40af; font-size: 13px;">💡 <strong>Tip:</strong> Click on any question above to get detailed information!</p>
                    </div>`;
        }
        if (lower.includes('seminar')) {
            const seminarFaqs = faqs.filter(faq => faq.category.toLowerCase() === 'seminar');
            return `🎓 Here are common seminar-related questions:<br><br>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${seminarFaqs.map(faq => `
                                <button onclick="window.chatActions.selectFAQ('${faq.question}', '${faq.answer.replace(/'/g, "\\'")}', '${faq.category}')" 
                                    style="text-align: left; padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #374151;" 
                                    onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#10b981'" 
                                    onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">
                                    💬 ${faq.question}
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
        }
        if (lower.includes('contact')) return '📞 You can reach us at:<br><br><div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin: 8px 0;"><strong>Email:</strong> fits-tanza@email.com<br><strong>Phone:</strong> 123-456-7890</div>';
        if (lower.includes('thank')) return '🙏 You\'re very welcome! If you have any more questions, feel free to ask anytime. I\'m here to help!';
        if (lower.includes('account') || lower.includes('profile') || lower.includes('password')) {
            const accountFaqs = faqs.filter(faq => faq.category.toLowerCase() === 'account');
            return `👤 Here are account-related questions:<br><br>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${accountFaqs.map(faq => `
                                <button onclick="window.chatActions.selectFAQ('${faq.question}', '${faq.answer.replace(/'/g, "\\'")}', '${faq.category}')" 
                                    style="text-align: left; padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #374151;" 
                                    onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#10b981'" 
                                    onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">
                                    💬 ${faq.question}
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
        }
        if (lower.includes('equipment') || lower.includes('tractor') || lower.includes('tool')) {
            const equipmentFaqs = faqs.filter(faq => faq.category.toLowerCase() === 'equipment');
            return `🚜 Here are equipment-related questions:<br><br>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981;">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${equipmentFaqs.map(faq => `
                                <button onclick="window.chatActions.selectFAQ('${faq.question}', '${faq.answer.replace(/'/g, "\\'")}', '${faq.category}')" 
                                    style="text-align: left; padding: 10px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #374151;" 
                                    onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#10b981'" 
                                    onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">
                                    💬 ${faq.question}
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
        }
        if (lower.includes('faq') || lower.includes('frequently')) {
            return `Here are our frequently asked questions organized by category:<br><br>
                    ${generateFAQByCategory()}
                    <div style="margin-top: 16px; padding: 12px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <p style="margin: 0; color: #1e40af; font-size: 13px;">💡 <strong>Tip:</strong> Click on any question to get detailed information!</p>
                    </div>`;
        }
        if (lower.includes('inquiry') || lower.includes('inquiries')) {
            return `You can manage all your inquiries here:<br><br>
                    <button onclick="window.chatActions.showInquiries()" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 12px 20px; border: none; border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">📝 View My Inquiries</button>`;
        }
        return `I'm here to help! Could you please provide more details about your concern?<br><br>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
                    <button onclick="window.chatActions.showFAQ()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 8px 14px; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; font-size: 12px; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">📋 FAQ</button>
                    <button onclick="window.chatActions.showInquiries()" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 8px 14px; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; font-size: 12px; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">� Inquiries</button>
                </div>`;
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isBotTyping]);

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            {/* Professional Chat Trigger Button */}
            <div className="fixed bottom-8 right-8 z-[999999] group">
                <button
                    onClick={() => setOpen(true)}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl flex items-center justify-center cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300/50 transform hover:scale-105"
                    aria-label="Open Support Chat"
                >
                    {/* Chat icon with animation */}
                    <svg className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    
                    {/* Professional tooltip */}
                    <div className="absolute bottom-full mb-4 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span>Need help? Chat with us!</span>
                        </div>
                        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </button>
            </div>
            {/* Professional Chat Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999999] transition-all p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full h-full max-w-none max-h-none bg-white rounded-none shadow-none flex flex-col
                        sm:rounded-3xl sm:shadow-2xl sm:w-[98vw] sm:h-[96vh] md:w-[480px] md:h-[720px] lg:w-[520px] lg:h-[760px] xl:w-[600px] xl:h-[800px] md:max-w-[98vw] md:max-h-[98vh] transition-all duration-300 transform scale-95 animate-in"
                        onClick={e => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="FITS-tanza Professional Support"
                        style={{
                            animation: 'modalSlideIn 0.3s ease-out forwards'
                        }}
                    >
                        <style jsx>{`
                            @keyframes modalSlideIn {
                                from {
                                    opacity: 0;
                                    transform: scale(0.9) translateY(20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: scale(1) translateY(0);
                                }
                            }
                        `}</style>

                        {/* Professional Header with Gradient */}
                        <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white px-6 py-5 rounded-t-3xl relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-white/10 bg-opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                    backgroundSize: '20px 20px'
                                }}></div>
                            </div>
                            
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                                            <img src={botAvatar} alt="Support Assistant" className="w-10 h-10 rounded-full" />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">FITS-Tanza Support</h3>
                                        <div className="flex items-center gap-2 text-green-100 mt-1">
                                            <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Online • Ready to help</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90 group"
                                    aria-label="Close chat"
                                >
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Enhanced Navigation Tabs */}
                            <div className="flex gap-2 mt-5 relative">
                                <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                                <div className="relative flex gap-1 p-1 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <button
                                        onClick={() => setCurrentView('chat')}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                            currentView === 'chat' 
                                                ? 'bg-white text-green-700 shadow-lg transform scale-105' 
                                                : 'text-white/90 hover:bg-white/20 hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Chat
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('faq')}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                            currentView === 'faq' 
                                                ? 'bg-white text-green-700 shadow-lg transform scale-105' 
                                                : 'text-white/90 hover:bg-white/20 hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        FAQ
                                    </button>
                                    <button
                                        onClick={() => setCurrentView('inquiries')}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                            currentView === 'inquiries' 
                                                ? 'bg-white text-green-700 shadow-lg transform scale-105' 
                                                : 'text-white/90 hover:bg-white/20 hover:text-white'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Inquiries
                                    </button>
                                    {currentInquiry && (
                                        <button
                                            onClick={startNewConversation}
                                            className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 bg-yellow-500 text-white hover:bg-yellow-600 transform hover:scale-105 flex items-center gap-2 ml-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            New
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Professional Content Area */}
                        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
                            {/* Chat View */}
                            {currentView === 'chat' && (
                                <>
                                    {/* Chat Messages Container */}
                                    <div className="h-full flex flex-col">
                                        {/* Current Inquiry Header - Enhanced */}
                                        {currentInquiry && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4 backdrop-blur-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-blue-900">
                                                                Continuing: {currentInquiry.subject}
                                                            </p>
                                                            <div className="flex gap-2 mt-1">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentInquiry.status)}`}>
                                                                    {currentInquiry.status}
                                                                </span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentInquiry.priority)}`}>
                                                                    {currentInquiry.priority} priority
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={startNewConversation}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                                    >
                                                        Start New Chat
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Messages Area with Enhanced Scrollbar */}
                                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
                                            <style jsx>{`
                                                .custom-scrollbar::-webkit-scrollbar {
                                                    width: 8px;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-track {
                                                    background: #f8fafc;
                                                    border-radius: 8px;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                                    background: linear-gradient(to bottom, #10b981, #059669);
                                                    border-radius: 8px;
                                                    border: 2px solid #f8fafc;
                                                }
                                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                                    background: linear-gradient(to bottom, #059669, #047857);
                                                }
                                                .custom-scrollbar {
                                                    scrollbar-width: thin;
                                                    scrollbar-color: #10b981 #f8fafc;
                                                }
                                            `}</style>
                                            
                                            {/* Enhanced Message Bubbles */}
                                            <div className="space-y-4">
                                                {messages.map((msg, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                                    >
                                                        {msg.from === 'bot' && (
                                                            <div className="flex-shrink-0">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 p-0.5">
                                                                    <img src={botAvatar} alt="Support Assistant" className="w-full h-full rounded-full object-cover" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                                            <div
                                                                className={`px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md
                                                                    ${msg.from === 'user'
                                                                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-md'
                                                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                                                                    }`}
                                                                style={{ wordBreak: 'break-word' }}
                                                                dangerouslySetInnerHTML={msg.from === 'bot' ? { __html: msg.text } : undefined}
                                                            >
                                                                {msg.from === 'user' ? msg.text : null}
                                                            </div>
                                                            <span className={`text-xs mt-1.5 px-2 ${msg.from === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                                {msg.time}
                                                            </span>
                                                        </div>
                                                        {msg.from === 'user' && (
                                                            <div className="flex-shrink-0">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
                                                                    <img src={userAvatar} alt="You" className="w-full h-full rounded-full object-cover" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                
                                                {/* Enhanced Typing Indicator */}
                                                {isBotTyping && (
                                                    <div className="flex justify-start items-end gap-2">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 p-0.5">
                                                                <img src={botAvatar} alt="Support Assistant" className="w-full h-full rounded-full object-cover" />
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-200 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                                </div>
                                                                <span className="text-sm text-gray-600">Assistant is typing...</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </div>
                                        
                                        {/* Professional Input Area */}
                                        <div className="bg-white border-t border-gray-200 px-6 py-4">
                                            <form
                                                className="flex items-center gap-3"
                                                onSubmit={handleSend}
                                                autoComplete="off"
                                            >
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Type your message here..."
                                                        className="w-full rounded-2xl px-5 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 bg-gray-50 focus:bg-white text-sm transition-all duration-200 placeholder-gray-500"
                                                        value={message}
                                                        onChange={e => setMessage(e.target.value)}
                                                        autoFocus
                                                        maxLength={500}
                                                        aria-label="Type your message"
                                                        disabled={isBotTyping}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                                        {message.length}/500
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl px-6 py-3 hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                                                    disabled={isBotTyping || !message.trim()}
                                                    aria-label="Send message"
                                                >
                                                    {isBotTyping ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>Sending...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Send</span>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                            
                                            {/* Quick Actions */}
                                            <div className="flex gap-2 mt-3 flex-wrap">
                                                <button
                                                    onClick={() => setCurrentView('faq')}
                                                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    FAQ
                                                </button>
                                                <button
                                                    onClick={() => setCurrentView('inquiries')}
                                                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200 flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    My Inquiries
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* FAQ View */}
                            {currentView === 'faq' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        {faqs.map((faq) => (
                                            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{faq.category}</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* My Inquiries View */}
                            {currentView === 'inquiries' && (
                                <div className="h-full overflow-y-auto p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Inquiries</h2>
                                    {userInquiries.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500 mb-4">No inquiries found</p>
                                            <button
                                                onClick={() => setCurrentView('chat')}
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Start Your First Conversation
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {userInquiries.map((inquiry) => (
                                                <div key={inquiry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{inquiry.subject}</h3>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                                    {inquiry.status}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                                                    {inquiry.priority} priority
                                                                </span>
                                                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {inquiry.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-3">{inquiry.message}</p>
                                                            <div className="text-xs text-gray-500">
                                                                <p>Created: {inquiry.date}</p>
                                                                <p>Last Update: {inquiry.lastUpdate}</p>
                                                                {inquiry.resolvedDate && <p>Resolved: {inquiry.resolvedDate}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        {inquiry.status !== 'resolved' ? (
                                                            <button
                                                                onClick={() => handleContinueInquiry(inquiry)}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                            >
                                                                Continue Conversation
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setSelectedInquiry(inquiry)}
                                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                                                            >
                                                                View Conversation
                                                            </button>
                                                        )}
                                                        {inquiry.status !== 'resolved' && (
                                                            <button
                                                                onClick={() => handleResolveInquiry(inquiry.id)}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                                                            >
                                                                Mark as Resolved
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-center px-4 py-2 text-xs text-gray-400 bg-white rounded-b-2xl border-t border-gray-200">
                            <span>Powered by FITS-Tanza</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiry Conversation Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999999]" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{selectedInquiry.subject}</h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="p-1 hover:bg-green-700 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                {selectedInquiry.replies.map((reply, index) => (
                                    <div key={index} className={`flex ${reply.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg ${
                                            reply.from === 'user'
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}>
                                            <p>{reply.message}</p>
                                            <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                                                <span>{reply.time}</span>
                                                {reply.responder && <span>- {reply.responder}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
            )}
            <style>{`
                html, body, #root {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>

    );
}
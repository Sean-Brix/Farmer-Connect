/**
 * Bot Service for FAQ Category Selection
 * Handles the bot interaction flow for presenting FAQ categories to users
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BotService {
    constructor() {
        this.botMessages = {
            welcome: "Welcome to FITS-Tanza Support! 🌟 I'm here to help you find answers quickly. Please select a category below, or type your question if you'd prefer to chat with a live agent.",
            categoryPrompt: "What can I help you with today? Please choose from these categories:",
            escalation: "I'll connect you with a live support agent who can assist you further. Please wait a moment...",
            noFaqsFound: "I don't have specific FAQs for this category yet, but let me connect you with a live agent who can help you.",
            faqNotHelpful: "I'm sorry that didn't help. Let me connect you with a live agent for personalized assistance."
        };
    }

    /**
     * Get welcome message with category buttons
     */
    async getWelcomeMessage() {
        try {
            const categories = await prisma.fAQCategory.findMany({
                where: { isActive: true },
                orderBy: { orderIndex: 'asc' },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    orderIndex: true
                }
            });

            return {
                type: 'bot_welcome',
                message: this.botMessages.welcome,
                categories: categories,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error fetching categories for bot:', error);
            return {
                type: 'bot_error',
                message: "I'm having trouble loading the help categories. Let me connect you with a live agent instead.",
                escalate: true,
                timestamp: new Date()
            };
        }
    }

    /**
     * Get FAQs for a specific category
     */
    async getFAQsForCategory(categoryId) {
        try {
            const category = await prisma.fAQCategory.findUnique({
                where: { id: categoryId },
                include: {
                    faqs: {
                        where: { isActive: true },
                        orderBy: [
                            { viewCount: 'desc' },
                            { createdAt: 'desc' }
                        ],
                        select: {
                            id: true,
                            question: true,
                            answer: true,
                            viewCount: true,
                            helpfulCount: true
                        }
                    }
                }
            });

            if (!category) {
                return {
                    type: 'bot_error',
                    message: "I couldn't find that category. Let me connect you with a live agent.",
                    escalate: true,
                    timestamp: new Date()
                };
            }

            if (category.faqs.length === 0) {
                return {
                    type: 'bot_no_faqs',
                    message: this.botMessages.noFaqsFound,
                    escalate: true,
                    categoryName: category.name,
                    timestamp: new Date()
                };
            }

            return {
                type: 'bot_faq_list',
                message: `Here are some helpful answers for ${category.name}:`,
                categoryName: category.name,
                faqs: category.faqs,
                escalateOption: true,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error fetching FAQs for category:', error);
            return {
                type: 'bot_error',
                message: "I'm having trouble loading the FAQs. Let me connect you with a live agent.",
                escalate: true,
                timestamp: new Date()
            };
        }
    }

    /**
     * Handle user requesting to escalate to live agent
     */
    getEscalationMessage() {
        return {
            type: 'bot_escalation',
            message: this.botMessages.escalation,
            escalate: true,
            timestamp: new Date()
        };
    }

    /**
     * Handle when user says FAQ wasn't helpful
     */
    getFAQNotHelpfulMessage() {
        return {
            type: 'bot_escalation',
            message: this.botMessages.faqNotHelpful,
            escalate: true,
            timestamp: new Date()
        };
    }

    /**
     * Increment FAQ view count when user views an FAQ
     */
    async incrementFAQView(faqId) {
        try {
            await prisma.fAQ.update({
                where: { id: faqId },
                data: {
                    viewCount: { increment: 1 }
                }
            });
        } catch (error) {
            console.error('Error incrementing FAQ view:', error);
        }
    }

    /**
     * Mark FAQ as helpful
     */
    async markFAQHelpful(faqId) {
        try {
            await prisma.fAQ.update({
                where: { id: faqId },
                data: {
                    helpfulCount: { increment: 1 }
                }
            });
            return { success: true };
        } catch (error) {
            console.error('Error marking FAQ as helpful:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Detect if user message indicates they want to skip bot and talk to agent
     */
    shouldEscalateImmediately(message) {
        if (!message || typeof message !== 'string') return false;
        
        const escalationTriggers = [
            'agent', 'human', 'person', 'talk to someone', 'live chat',
            'representative', 'operator', 'help me', 'complex issue',
            'urgent', 'emergency', 'complaint', 'problem'
        ];
        
        const lowerMessage = message.toLowerCase();
        return escalationTriggers.some(trigger => lowerMessage.includes(trigger));
    }
}

export default new BotService();
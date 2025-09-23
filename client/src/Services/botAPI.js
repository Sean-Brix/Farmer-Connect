/**
 * Client-side Bot API Service
 * Handles communication with the bot API endpoints
 */

const API_BASE = '/api/bot';

class BotAPI {
    /**
     * Get welcome message with categories
     */
    async getWelcomeMessage() {
        try {
            const response = await fetch(`${API_BASE}/welcome`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching welcome message:', error);
            return null;
        }
    }

    /**
     * Get FAQs for a specific category
     */
    async getCategoryFAQs(categoryId) {
        try {
            const response = await fetch(`${API_BASE}/category/${categoryId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching category FAQs:', error);
            return null;
        }
    }

    /**
     * Request escalation to live agent
     */
    async requestEscalation() {
        try {
            const response = await fetch(`${API_BASE}/escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error requesting escalation:', error);
            return null;
        }
    }

    /**
     * Mark FAQ as not helpful
     */
    async markFAQNotHelpful() {
        try {
            const response = await fetch(`${API_BASE}/faq-not-helpful`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error marking FAQ as not helpful:', error);
            return null;
        }
    }

    /**
     * Track FAQ view
     */
    async trackFAQView(faqId) {
        try {
            const response = await fetch(`${API_BASE}/faq/${faqId}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error tracking FAQ view:', error);
            return false;
        }
    }

    /**
     * Mark FAQ as helpful
     */
    async markFAQHelpful(faqId) {
        try {
            const response = await fetch(`${API_BASE}/faq/${faqId}/helpful`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error marking FAQ as helpful:', error);
            return false;
        }
    }

    /**
     * Check if user message should trigger immediate escalation
     */
    async shouldEscalate(message) {
        try {
            const response = await fetch(`${API_BASE}/should-escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            return data.success ? data : null;
        } catch (error) {
            console.error('Error checking escalation:', error);
            return null;
        }
    }
}

export default new BotAPI();
const API_BASE_URL = '/api/faq';

export const faqService = {
  /**
   * Get all FAQs with optional category filter
   * @param {string} categoryId - Optional category ID to filter FAQs
   * @returns {Promise} FAQ data
   */
  async getFAQs(categoryId = null) {
    try {
      const url = categoryId 
        ? `${API_BASE_URL}?categoryId=${categoryId}` 
        : API_BASE_URL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  /**
   * Get all FAQ categories
   * @returns {Promise} Category data
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
      throw error;
    }
  },

  /**
   * Increment FAQ view count
   * @param {string} faqId - FAQ ID
   * @returns {Promise}
   */
  async incrementView(faqId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${faqId}/view`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error incrementing FAQ view:', error);
      // Don't throw - this is a non-critical operation
      return null;
    }
  },

  /**
   * Mark FAQ as helpful
   * @param {string} faqId - FAQ ID
   * @returns {Promise}
   */
  async markHelpful(faqId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${faqId}/helpful`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking FAQ as helpful:', error);
      // Don't throw - this is a non-critical operation
      return null;
    }
  }
};

export default faqService;

// FAQ Management Service for Admin Interface
const BASE_URL = '/api/faq';

export const faqService = {
  // Get all FAQs for admin management
  async getAllFAQs() {
    try {
      // First try admin endpoint
      const adminResponse = await fetch(`${BASE_URL}/admin/all`, {
        method: 'GET',
        credentials: 'include',
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        return {
          success: true,
          data: data.faqs || data.data || [],
          total: data.total || (data.faqs ? data.faqs.length : 0),
          isAdmin: true,
        };
      }

      // If admin endpoint fails (401 Unauthorized), fallback to public endpoint
      if (adminResponse.status === 401) {
        console.info('Admin access denied, falling back to public FAQs');
        const publicResponse = await fetch(`${BASE_URL}/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          return {
            success: true,
            data: publicData.faqs || publicData.data || [],
            total: publicData.total || publicData.count || 0,
            isAdmin: false,
            warning: 'Read-only access - Admin login required for full management',
          };
        }
      }

      throw new Error(`Failed to fetch FAQs: ${adminResponse.status} ${adminResponse.statusText}`);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        total: 0,
      };
    }
  },

  // Create a new FAQ
  async createFAQ(faqData) {
    try {
      const response = await fetch(`${BASE_URL}/admin/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to create FAQs');
      }

      if (!response.ok) {
        throw new Error(`Failed to create FAQ: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.faq || data.data,
      };
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Update an existing FAQ
  async updateFAQ(id, faqData) {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to update FAQs');
      }

      if (!response.ok) {
        throw new Error(`Failed to update FAQ: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.faq || data.data,
      };
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete an FAQ
  async deleteFAQ(id) {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to delete FAQs');
      }

      if (!response.ok) {
        throw new Error(`Failed to delete FAQ: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || 'FAQ deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Search FAQs
  async searchFAQs(searchTerm) {
    try {
      const response = await fetch(`${BASE_URL}/?search=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search FAQs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        total: data.count || 0,
      };
    } catch (error) {
      console.error('Error searching FAQs:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        total: 0,
      };
    }
  },

  // Get FAQ categories (public endpoint)
  async getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.categories || [],
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  // Category Management Functions
  
  // Get all categories for admin management
  async getAllCategories() {
    try {
      const response = await fetch(`${BASE_URL}/admin/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to manage categories');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.categories || data.data || [],
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  // Create a new category
  async createCategory(categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/admin/categories/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to create categories');
      }

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.category || data.data,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Update an existing category
  async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to update categories');
      }

      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.category || data.data,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await fetch(`${BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to delete categories');
      }

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Reorder categories
  async reorderCategories(categoryOrders) {
    try {
      const response = await fetch(`${BASE_URL}/admin/categories/reorder`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: categoryOrders }),
      });

      if (response.status === 401) {
        throw new Error('Admin authentication required to reorder categories');
      }

      if (!response.ok) {
        throw new Error(`Failed to reorder categories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error reordering categories:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default faqService;
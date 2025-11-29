import React, { useState, useEffect, useMemo } from 'react'
import { useTheme } from '../../../contexts/ThemeContext.jsx'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../Components/Navbar'
import faqService from '../../../Services/faqService'

export default function FAQ() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  // Fetch FAQs with aggressive caching (24 hours)
  const { data: faqData, isLoading: faqsLoading, error: faqsError } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqService.getFAQs(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Fetch categories with aggressive caching (24 hours)
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['faqCategories'],
    queryFn: () => faqService.getCategories(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Process categories and FAQs into organized structure
  const faqCategories = useMemo(() => {
    if (!categoriesData?.categories || !faqData?.faqs) return {};

    const categories = categoriesData.categories;
    const faqs = faqData.faqs;

    // Define category icons mapping
    const categoryIcons = {
      'General': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Programs & Services': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      'Technology & Innovation': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'Support & Contact': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    };

    // Default icon for categories without a specific icon
    const defaultIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

    // Organize FAQs by category
    const organized = {};
    
    categories.forEach(category => {
      const categoryFaqs = faqs.filter(faq => faq.categoryId === category.id);
      
      if (categoryFaqs.length > 0) {
        // Create a slug from category name for key
        const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        
        organized[slug] = {
          id: category.id,
          title: category.name,
          description: category.description,
          icon: categoryIcons[category.name] || defaultIcon,
          questions: categoryFaqs.map(faq => ({
            id: faq.id,
            q: faq.question,
            a: faq.answer,
            viewCount: faq.viewCount || 0,
            helpfulCount: faq.helpfulCount || 0
          }))
        };
      }
    });

    return organized;
  }, [categoriesData, faqData]);

  // Set initial active tab when categories load
  useEffect(() => {
    if (!activeTab && Object.keys(faqCategories).length > 0) {
      setActiveTab(Object.keys(faqCategories)[0]);
    }
  }, [faqCategories, activeTab]);

  const toggleQuestion = (index, faqId) => {
    // Track view when opening a question
    if (openQuestion !== index && faqId) {
      faqService.incrementView(faqId).catch(err => 
        console.error('Failed to track view:', err)
      );
    }
    setOpenQuestion(openQuestion === index ? null : index);
  };

  // Show loading state
  if (faqsLoading || categoriesLoading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen mt-[40px] pt-24 sm:pt-20 md:pt-16 py-12 px-4 sm:px-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className={`h-12 rounded-lg mx-auto w-3/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              <div className={`h-8 rounded-lg mx-auto w-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-32 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (faqsError) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen mt-[40px] pt-24 sm:pt-20 md:pt-16 py-12 px-4 sm:px-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="max-w-5xl mx-auto text-center">
            <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-red-50'}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Unable to Load FAQs
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show empty state if no FAQs
  if (Object.keys(faqCategories).length === 0) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen mt-[40px] pt-24 sm:pt-20 md:pt-16 py-12 px-4 sm:px-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="max-w-5xl mx-auto text-center">
            <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                No FAQs Available
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Check back later for frequently asked questions.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen mt-[40px] pt-24 sm:pt-20 md:pt-16 py-12 px-4 sm:px-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Find answers to common questions about FITS-Tanza services and programs
            </p>
          </div>

          {/* Category Tabs */}
          <div className={`flex flex-wrap gap-3 justify-center mb-8 p-4 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            {Object.keys(faqCategories).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveTab(category);
                  setOpenQuestion(null);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === category
                    ? theme === 'dark'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-green-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {faqCategories[category].icon}
                {faqCategories[category].title}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqCategories[activeTab]?.questions.map((faq, index) => (
              <div
                key={faq.id}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                } ${openQuestion === index ? 'shadow-xl' : 'shadow-md'}`}
              >
                <button
                  onClick={() => toggleQuestion(index, faq.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-lg font-semibold pr-4 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                      openQuestion === index ? 'rotate-180' : ''
                    } ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openQuestion === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className={`px-6 pb-5 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className={`pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className={`mt-12 p-8 rounded-2xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Still have questions?
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our team is here to help. Get in touch with us for personalized assistance.
            </p>
            <a
              href="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

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

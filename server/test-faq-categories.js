// Test script for FAQ Categories API
// Run with: node test-faq-categories.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/faq`;

// Test functions
async function testPublicFAQs() {
    console.log('\n🧪 Testing Public FAQ endpoints...');
    
    try {
        // Test getting all FAQs
        const faqsResponse = await fetch(`${API_URL}/`);
        const faqsData = await faqsResponse.json();
        console.log('✅ Get FAQs:', faqsData.success ? 'SUCCESS' : 'FAILED');
        
        // Test getting categories
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesResponse.json();
        console.log('✅ Get Categories:', categoriesData.success ? 'SUCCESS' : 'FAILED');
        console.log('   Categories found:', categoriesData.data?.length || 0);
        
    } catch (error) {
        console.log('❌ Public API test failed:', error.message);
    }
}

async function testWithAuth() {
    console.log('\n🔐 Note: Admin endpoints require authentication');
    console.log('   To test admin endpoints, you need to:');
    console.log('   1. Login as admin to get JWT token');
    console.log('   2. Add Authorization: Bearer <token> header');
    console.log('   3. Test endpoints like POST /api/faq/admin/categories/create');
}

// Run tests
async function runTests() {
    console.log('🚀 Testing FAQ Categories API...');
    console.log('📍 Server URL:', BASE_URL);
    
    await testPublicFAQs();
    await testWithAuth();
    
    console.log('\n✨ Test completed!');
    console.log('\n📋 Available endpoints:');
    console.log('   Public:');
    console.log('   • GET /api/faq - Get all active FAQs');
    console.log('   • GET /api/faq/categories - Get all categories');
    console.log('   Admin (requires auth):');
    console.log('   • GET /api/faq/admin/categories - Get all categories with details');
    console.log('   • POST /api/faq/admin/categories/create - Create category');
    console.log('   • PUT /api/faq/admin/categories/:id - Update category');
    console.log('   • DELETE /api/faq/admin/categories/:id - Delete category');
}

runTests().catch(console.error);
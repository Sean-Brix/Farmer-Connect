import { PrismaClient } from './prisma/generated/client/index.js';// Test script for FAQ Categories API

// Run with: node test-faq-categories.js

const prisma = new PrismaClient();

import fetch from 'node-fetch';

async function checkFAQCategories() {

  // Check categoriesconst BASE_URL = 'http://localhost:5000';

  const categories = await prisma.fAQCategory.findMany();const API_URL = `${BASE_URL}/api/faq`;

  console.log('\n=== FAQ Categories ===');

  categories.forEach(cat => {// Test functions

    console.log(`- ${cat.name}: ${cat.description}`);async function testPublicFAQs() {

  });    console.log('\n🧪 Testing Public FAQ endpoints...');

    

  // Check FAQs with categories    try {

  const faqs = await prisma.fAQ.findMany({        // Test getting all FAQs

    include: { category: true },        const faqsResponse = await fetch(`${API_URL}/`);

    take: 10,        const faqsData = await faqsResponse.json();

  });        console.log('✅ Get FAQs:', faqsData.success ? 'SUCCESS' : 'FAILED');

        

  console.log('\n=== Sample FAQs (first 10) ===');        // Test getting categories

  faqs.forEach(f => {        const categoriesResponse = await fetch(`${API_URL}/categories`);

    const question = f.question.length > 60 ? f.question.substring(0, 60) + '...' : f.question;        const categoriesData = await categoriesResponse.json();

    console.log(`- ${question}`);        console.log('✅ Get Categories:', categoriesData.success ? 'SUCCESS' : 'FAILED');

    console.log(`  Category: ${f.category?.name || 'NO CATEGORY'}`);        console.log('   Categories found:', categoriesData.data?.length || 0);

  });        

    } catch (error) {

  // Count FAQs by category        console.log('❌ Public API test failed:', error.message);

  const faqCounts = await prisma.fAQ.groupBy({    }

    by: ['categoryId'],}

    _count: true,

  });async function testWithAuth() {

    console.log('\n🔐 Note: Admin endpoints require authentication');

  console.log('\n=== FAQ Count by Category ===');    console.log('   To test admin endpoints, you need to:');

  for (const count of faqCounts) {    console.log('   1. Login as admin to get JWT token');

    if (count.categoryId) {    console.log('   2. Add Authorization: Bearer <token> header');

      const cat = await prisma.fAQCategory.findUnique({ where: { id: count.categoryId } });    console.log('   3. Test endpoints like POST /api/faq/admin/categories/create');

      console.log(`- ${cat?.name || 'Unknown'}: ${count._count} FAQs`);}

    } else {

      console.log(`- NO CATEGORY: ${count._count} FAQs`);// Run tests

    }async function runTests() {

  }    console.log('🚀 Testing FAQ Categories API...');

    console.log('📍 Server URL:', BASE_URL);

  await prisma.$disconnect();    

}    await testPublicFAQs();

    await testWithAuth();

checkFAQCategories();    

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
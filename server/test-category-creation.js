// Test script to verify category creation functionality
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCategoryCreation() {
  try {
    console.log('🧪 Testing Category Creation Functionality...\n');

    // First, let's see current categories
    console.log('📋 Current Categories:');
    const currentCategories = await prisma.fAQCategory.findMany({
      include: {
        faqs: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    currentCategories.forEach(category => {
      console.log(`- ${category.name} (${category.faqs.length} FAQs)`);
    });
    console.log(`Total categories: ${currentCategories.length}\n`);

    // Test creating a new category
    console.log('➕ Creating a new test category...');
    const newCategory = await prisma.fAQCategory.create({
      data: {
        name: 'Test Category',
        description: 'This is a test category created by the test script',
        orderIndex: currentCategories.length + 1
      }
    });
    
    console.log(`✅ Created category: ${newCategory.name} (ID: ${newCategory.id})\n`);

    // Verify it was created
    console.log('🔍 Verifying creation...');
    const updatedCategories = await prisma.fAQCategory.findMany({
      include: {
        faqs: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    console.log('📋 Updated Categories:');
    updatedCategories.forEach(category => {
      console.log(`- ${category.name} (${category.faqs.length} FAQs)`);
    });
    console.log(`Total categories: ${updatedCategories.length}\n`);

    // Clean up - delete the test category
    console.log('🧹 Cleaning up test category...');
    await prisma.fAQCategory.delete({
      where: {
        id: newCategory.id
      }
    });
    console.log('✅ Test category deleted\n');

    // Final verification
    const finalCategories = await prisma.fAQCategory.findMany({
      include: {
        faqs: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    console.log('📋 Final Categories (after cleanup):');
    finalCategories.forEach(category => {
      console.log(`- ${category.name} (${category.faqs.length} FAQs)`);
    });
    console.log(`Total categories: ${finalCategories.length}\n`);

    console.log('✅ Category creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during category testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategoryCreation();
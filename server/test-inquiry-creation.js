// Test script to debug inquiry creation issues
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testInquiryCreation() {
  try {
    console.log('🧪 Testing Inquiry Creation...\n');

    // Test basic inquiry creation
    console.log('📝 Creating test inquiry...');
    const testInquiry = await prisma.inquiry.create({
      data: {
        subject: 'Test Inquiry Subject',
        message: 'This is a test inquiry message to verify creation functionality.',
        userId: 'cmf8c05sx0001tunc7oxi5djq', // Use an existing user ID from your system
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            sender: {
              select: {
                firstName: true,
                surname: true
              }
            }
          }
        },
        attachments: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, filename: true, mimetype: true, filesize: true, uploadedById: true, createdAt: true }
        }
      }
    });

    console.log('✅ Test inquiry created successfully!');
    console.log(`   ID: ${testInquiry.id}`);
    console.log(`   Subject: ${testInquiry.subject}`);
    console.log(`   User: ${testInquiry.user.firstName} ${testInquiry.user.surname}`);
    console.log(`   Status: ${testInquiry.status}\n`);

    // Clean up
    console.log('🧹 Cleaning up test inquiry...');
    await prisma.inquiry.delete({
      where: { id: testInquiry.id }
    });
    console.log('✅ Test inquiry deleted\n');

    // Test with validation - missing required fields
    console.log('🚫 Testing validation with missing subject...');
    try {
      await prisma.inquiry.create({
        data: {
          message: 'Test message without subject',
          userId: 'cmf8c05sx0001tunc7oxi5djq',
          status: 'PENDING'
        }
      });
      console.log('❌ Should have failed but didn\'t');
    } catch (error) {
      console.log('✅ Validation worked - missing subject caught');
    }

    console.log('\n✅ Inquiry creation tests completed!');
    
  } catch (error) {
    console.error('❌ Error during inquiry testing:', error);
    
    // Check if it's a user ID issue
    if (error.code === 'P2003') {
      console.log('\n💡 This looks like a foreign key constraint error.');
      console.log('   The userId might not exist in the accounts table.');
      console.log('   Let\'s check available user IDs...\n');
      
      try {
        const users = await prisma.account.findMany({
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true
          },
          take: 3
        });
        
        console.log('📋 Available users:');
        users.forEach(user => {
          console.log(`   ${user.id} - ${user.firstName} ${user.surname} (${user.email})`);
        });
      } catch (userError) {
        console.error('❌ Error fetching users:', userError);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

testInquiryCreation();
// Test script to reproduce the exact inquiry creation error from frontend
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testFrontendInquiryCreation() {
  try {
    console.log('🧪 Testing Frontend Inquiry Creation...\n');

    // Simulate the exact same request that the frontend sends
    const requestBody = {
      subject: 'Bot Escalation - Live Agent Request',
      message: 'User requested live agent assistance from bot chat.',
      priority: 'MEDIUM' // This is what the frontend sends but might be causing issues
    };

    console.log('📤 Frontend request data:');
    console.log(JSON.stringify(requestBody, null, 2));
    console.log();

    // Test what happens when we try to create with the priority field
    console.log('🔍 Testing with priority field (like frontend sends)...');
    try {
      const inquiryWithPriority = await prisma.inquiry.create({
        data: {
          subject: requestBody.subject,
          message: requestBody.message,
          // priority: requestBody.priority, // This field doesn't exist in schema
          userId: 'cmf8c05sx0001tunc7oxi5djq', // Use a real user ID
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
          }
        }
      });
      
      console.log('✅ Inquiry created successfully without priority field');
      console.log(`   ID: ${inquiryWithPriority.id}`);
      
      // Clean up
      await prisma.inquiry.delete({
        where: { id: inquiryWithPriority.id }
      });
      console.log('🧹 Test inquiry cleaned up');
      
    } catch (error) {
      console.log('❌ Error creating inquiry with priority field:');
      console.log(error.message);
    }

    console.log('\n🔍 Testing without priority field (controller should ignore it)...');
    
    // Test the controller logic manually
    const { subject, message } = requestBody; // Extract only what controller should use
    
    const inquiry = await prisma.inquiry.create({
      data: {
        subject,
        message,
        userId: 'cmf8c05sx0001tunc7oxi5djq',
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

    console.log('✅ Inquiry created successfully (controller simulation)');
    console.log(`   ID: ${inquiry.id}`);
    console.log(`   Subject: ${inquiry.subject}`);
    console.log(`   User: ${inquiry.user.firstName} ${inquiry.user.surname}`);
    
    // Clean up
    await prisma.inquiry.delete({
      where: { id: inquiry.id }
    });
    console.log('🧹 Test inquiry cleaned up');
    
    console.log('\n✅ Frontend inquiry creation test completed!');
    
  } catch (error) {
    console.error('❌ Error during frontend inquiry testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFrontendInquiryCreation();
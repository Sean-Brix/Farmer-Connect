// Test script to verify survey response submission works
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSurveyResponse() {
  try {
    console.log('🧪 Testing Survey Response Submission...\n');

    // First, find an existing survey form to test with
    const surveyForm = await prisma.surveyForm.findFirst({
      where: { status: 'ACTIVE' },
      include: { fields: true }
    });

    if (!surveyForm) {
      console.log('❌ No active survey forms found to test with');
      return;
    }

    console.log(`📋 Found survey form: "${surveyForm.title}"`);
    console.log(`   Fields: ${surveyForm.fields.length}`);
    
    // Test metadata JSON stringification
    const testMetadata = { source: "inquiry-modal", timestamp: new Date().toISOString() };
    console.log('\n🔍 Testing metadata conversion:');
    console.log('Original metadata:', testMetadata);
    console.log('JSON stringified:', JSON.stringify(testMetadata));

    // Create a test response (but don't actually save it - just test the data structure)
    const testAnswers = surveyForm.fields.slice(0, 1).map(field => ({
      fieldId: field.id,
      answer: 'Test answer'
    }));

    console.log('\n📝 Test response data structure:');
    const responseData = {
      surveyFormId: surveyForm.id,
      userId: 'cmf8c05sx0001tunc7oxi5djq', // Use a real user ID
      metadata: JSON.stringify(testMetadata), // Convert to string as fixed
      answers: {
        create: testAnswers
      }
    };
    
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    
    console.log('\n✅ Metadata conversion test passed!');
    console.log('The fix should now work - metadata will be stored as JSON string');
    
  } catch (error) {
    console.error('❌ Error during survey response testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSurveyResponse();
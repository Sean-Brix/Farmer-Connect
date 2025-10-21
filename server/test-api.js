import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing crop guidelines API...');
    const response = await fetch('http://localhost:8080/api/seed-track/guidelines');
    const data = await response.json();
    
    console.log('Success:', data.success);
    console.log('Number of guidelines:', data.data?.length);
    
    if (data.data && data.data.length > 0) {
      console.log('\nFirst guideline:');
      console.log('  Name:', data.data[0].name);
      console.log('  Category:', data.data[0].category);
      console.log('  Stages:', data.data[0].stages?.length);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();

// Simple test script to check notification endpoints
const fetch = require('node-fetch');

async function testNotifications() {
  const baseUrl = 'http://localhost:8080';
  
  console.log('🧪 Testing notification system...\n');
  
  try {
    // Test 1: Check server is running
    console.log('1️⃣ Testing server connection...');
    const pingResponse = await fetch(`${baseUrl}/api/ping`);
    const pingData = await pingResponse.json();
    console.log('✅ Server running:', pingData);
    
    // Test 2: Check debug endpoint for user 3 (publisher)
    console.log('\n2️⃣ Testing notifications for publisher (user 3)...');
    const debugResponse = await fetch(`${baseUrl}/api/new-generation/debug-notifications/3`);
    const debugData = await debugResponse.json();
    console.log('📋 Debug data for user 3:', JSON.stringify(debugData, null, 2));
    
    // Test 3: Check notification endpoint for user 3
    console.log('\n3️⃣ Testing notification endpoint for user 3...');
    const notifResponse = await fetch(`${baseUrl}/api/new-generation/notifications/3`);
    const notifData = await notifResponse.json();
    console.log('🔔 Notifications for user 3:', JSON.stringify(notifData, null, 2));
    
    // Test 4: Create a test exam notification
    console.log('\n4️⃣ Creating test exam notification...');
    const examData = {
      type: 'midterm',
      subject: 'Test Subject',
      date: '2025-09-25',
      time: '10:00',
      duration: '2 hours',
      instructions: 'Test instructions',
      topics: 'Test topics'
    };
    
    const createResponse = await fetch(`${baseUrl}/api/new-generation/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData)
    });
    
    const createData = await createResponse.json();
    console.log('📝 Created exam:', JSON.stringify(createData, null, 2));
    
    // Test 5: Check notifications again after creation
    console.log('\n5️⃣ Checking notifications after exam creation...');
    const finalResponse = await fetch(`${baseUrl}/api/new-generation/debug-notifications/3`);
    const finalData = await finalResponse.json();
    console.log('🔔 Final notifications for user 3:', JSON.stringify(finalData, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNotifications();
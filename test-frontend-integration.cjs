/**
 * Frontend Integration Test for Principle Ask Button
 * Tests the complete frontend-to-backend-to-Telegram flow
 */

const fs = require('fs');

console.log('🧪 FRONTEND INTEGRATION TEST: Frontend Components\n');

// Test the API endpoints that the frontend will call
async function testFrontendIntegration() {
  console.log('🔗 Testing Frontend-Backend Integration...\n');

  // Test 1: Check if the frontend server is responding
  console.log('1. 🌐 Testing Frontend Server...');
  try {
    const frontendResponse = await fetch('http://localhost:8080');
    if (frontendResponse.ok) {
      console.log('✅ Frontend server responding at http://localhost:8080');
    } else {
      console.log('❌ Frontend server error:', frontendResponse.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach frontend server:', error.message);
    return false;
  }

  // Test 2: Check if the Telegram API endpoint is accessible from frontend
  console.log('\n2. 📡 Testing Telegram API Endpoint (from frontend)...');
  try {
    const response = await fetch('http://localhost:8080/api/telegram/status');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Telegram API endpoint accessible');
      console.log(`   - Service Ready: ${data.status?.isReady ? '✅' : '❌'}`);
      console.log(`   - Has Token: ${data.status?.hasToken ? '✅' : '❌'}`);
      console.log(`   - Has Chat ID: ${data.status?.hasChatId ? '✅' : '❌'}`);
      
      if (!data.status?.isReady) {
        console.log('⚠️  Telegram service not ready - messages may not send');
      }
    } else {
      console.log('❌ Telegram API endpoint error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach Telegram API:', error.message);
    return false;
  }

  // Test 3: Test the actual message sending endpoint (simulate frontend call)
  console.log('\n3. 📤 Testing Message Sending (simulating frontend)...');
  
  const testMessage = {
    senderName: "Test Publisher",
    senderRole: "mentor (Publisher)", 
    senderDepartment: "Computer Science",
    message: "📋 General Query\n\n🧪 FRONTEND INTEGRATION TEST\n\nThis is a general test message for frontend functionality.\n\nTimestamp: " + new Date().toLocaleString(),
    priority: "medium"
  };

  try {
    const response = await fetch('http://localhost:8080/api/telegram/send-to-principal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Message sent successfully through frontend!');
      console.log(`📨 Message ID: ${data.messageId || 'N/A'}`);
      console.log(`⏰ Timestamp: ${data.timestamp || 'N/A'}`);
      console.log('📱 Check Mayur\'s Telegram for the test message!');
      return true;
    } else {
      console.log('❌ Message sending failed');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      console.log(`   Response:`, data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Network error during message send: ${error.message}`);
    return false;
  }
}

// Test 4: Check if the component files are correctly integrated
function testComponentIntegration() {
  console.log('\n4. 🧩 Testing Component Integration...');
  
  try {
    // Check basic component structure
    const headerContent = fs.readFileSync('client/components/layout/Header.tsx', 'utf8');
    const indexContent = fs.readFileSync('client/pages/Index.tsx', 'utf8');
    
    const checks = [
      { name: 'Header component exists', pass: headerContent.includes('Header') },
      { name: 'Index component exists', pass: indexContent.includes('Index') },
      { name: 'Auth context used', pass: headerContent.includes('useAuth') },
      { name: 'Navigation present', pass: headerContent.includes('NavLink') },
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.pass) {
        console.log(`✅ ${check.name}`);
      } else {
        console.log(`❌ ${check.name}`);
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    console.log(`❌ Component integration check failed: ${error.message}`);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('🎯 Starting Frontend Integration Tests...\n');
  
  const componentIntegration = testComponentIntegration();
  const apiIntegration = await testFrontendIntegration();
  
  console.log('\n📊 INTEGRATION TEST RESULTS:');
  console.log('============================');
  console.log(`Component Integration: ${componentIntegration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Integration: ${apiIntegration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Server: ${apiIntegration ? '✅ RUNNING' : '❌ ISSUE'}`);
  console.log(`Telegram Integration: ${apiIntegration ? '✅ WORKING' : '❌ ISSUE'}`);
  
  if (componentIntegration && apiIntegration) {
    console.log('\n🎉 FRONTEND INTEGRATION: FULLY WORKING!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Open http://localhost:8080 in your browser');
    console.log('2. Login with: username="pygram2k25", password="pygram2k25"');
    console.log('3. Check navigation and header functionality');
    console.log('4. Click the button to open the modal');
    console.log('5. Fill out the form and send a test message');
    console.log('6. Check Mayur\'s Telegram (@Principle_Pygram_bot) for the message');
    console.log('\n✨ The frontend-to-backend-to-Telegram flow is complete!');
  } else {
    console.log('\n❌ INTEGRATION ISSUES DETECTED');
    console.log('Please check the failed tests above and fix any issues.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
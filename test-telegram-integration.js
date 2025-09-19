#!/usr/bin/env node

/**
 * Test script for Principle Ask Telegram Integration
 * Tests the complete message flow from button click to Telegram delivery
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

console.log('🧪 Testing Principle Ask → Telegram Bot Integration...\n');

// Test 1: Check if servers are running
console.log('🌐 Checking server status...');

async function testServerStatus() {
  try {
    // Test frontend server
    const frontendResponse = await fetch('http://localhost:8080');
    if (frontendResponse.ok) {
      console.log('✅ Frontend server (localhost:8080) - RUNNING');
    } else {
      console.log('❌ Frontend server - NOT RESPONDING');
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend server - NOT RUNNING');
    return false;
  }

  try {
    // Test backend server
    const backendResponse = await fetch('http://localhost:3001/health');
    if (backendResponse.ok) {
      console.log('✅ Backend server (localhost:3001) - RUNNING');
    } else {
      console.log('❌ Backend server - NOT RESPONDING');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend server - NOT RUNNING');
    return false;
  }

  return true;
}

// Test 2: Test the Telegram API endpoint
async function testTelegramEndpoint() {
  console.log('\n📡 Testing Telegram API endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/telegram/status');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Telegram API endpoint - ACCESSIBLE');
      console.log('📊 Telegram Service Status:');
      console.log(`   - Ready: ${data.status?.isReady ? '✅' : '❌'}`);
      console.log(`   - Has Token: ${data.status?.hasToken ? '✅' : '❌'}`);
      console.log(`   - Has Chat ID: ${data.status?.hasChatId ? '✅' : '❌'}`);
      return data.status;
    } else {
      console.log('❌ Telegram API endpoint - ERROR');
      return null;
    }
  } catch (error) {
    console.log('❌ Telegram API endpoint - NOT ACCESSIBLE');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Test 3: Test message sending (simulation)
async function testMessageSending() {
  console.log('\n📤 Testing message sending functionality...');
  
  const testMessage = {
    senderName: "Test Publisher",
    senderRole: "mentor (Publisher)",
    senderDepartment: "Computer Science",
    message: "🧪 Test Message - This is a test message from the Principle Ask button to verify Telegram integration is working correctly.",
    priority: "medium"
  };

  try {
    const response = await fetch('http://localhost:3001/api/telegram/send-to-principal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Message sending - SUCCESS');
      console.log(`📨 Message ID: ${data.messageId || 'N/A'}`);
      console.log(`⏰ Timestamp: ${data.timestamp || 'N/A'}`);
      console.log('🎉 Message successfully sent to Telegram!');
      return true;
    } else {
      console.log('❌ Message sending - FAILED');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Message sending - ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 4: Check component integration
function testComponentIntegration() {
  console.log('\n🧩 Checking component integration...');
  
  try {
    const componentContent = readFileSync('client/components/communication/PrincipleAskButton.tsx', 'utf8');
    
    const checks = [
      { name: 'API Endpoint', pattern: '/api/telegram/send-to-principal' },
      { name: 'Fetch Method', pattern: 'fetch\\(' },
      { name: 'POST Request', pattern: 'method: \'POST\'' },
      { name: 'JSON Headers', pattern: 'Content-Type.*application/json' },
      { name: 'Message Categories', pattern: 'category.*general|urgent|approval|policy' },
      { name: 'Success Handling', pattern: 'data.success' },
      { name: 'Error Handling', pattern: 'catch.*error' }
    ];

    let allPassed = true;
    checks.forEach(check => {
      const regex = new RegExp(check.pattern, 'i');
      if (regex.test(componentContent)) {
        console.log(`✅ ${check.name} - FOUND`);
      } else {
        console.log(`❌ ${check.name} - MISSING`);
        allPassed = false;
      }
    });

    return allPassed;
  } catch (error) {
    console.log(`❌ Component integration check failed: ${error.message}`);
    return false;
  }
}

// Test 5: Environment variables check
function checkEnvironmentVariables() {
  console.log('\n🔐 Checking Telegram environment variables...');
  
  const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_PRINCIPAL_CHAT_ID'
  ];

  let hasAllVars = true;
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} - SET`);
    } else {
      console.log(`⚠️  ${envVar} - NOT SET (may affect functionality)`);
      hasAllVars = false;
    }
  });

  if (!hasAllVars) {
    console.log('\n📝 Note: Environment variables are needed for actual Telegram delivery.');
    console.log('   The API will work but messages won\'t be sent to Telegram without proper configuration.');
  }

  return hasAllVars;
}

// Main test execution
async function runTests() {
  console.log('🎯 Starting Comprehensive Test Suite...\n');

  const serverStatus = await testServerStatus();
  if (!serverStatus) {
    console.log('\n❌ CRITICAL: Servers not running. Please start the development servers first.');
    console.log('   Frontend: pnpm dev');
    console.log('   Backend: node server/simple-server.js');
    process.exit(1);
  }

  const telegramStatus = await testTelegramEndpoint();
  const componentIntegration = testComponentIntegration();
  const envVars = checkEnvironmentVariables();
  
  // Only test actual message sending if Telegram is properly configured
  let messageSent = false;
  if (telegramStatus?.isReady && telegramStatus?.hasToken && telegramStatus?.hasChatId) {
    messageSent = await testMessageSending();
  } else {
    console.log('\n⚠️  Skipping message sending test - Telegram not fully configured');
    console.log('   Configure TELEGRAM_BOT_TOKEN and TELEGRAM_PRINCIPAL_CHAT_ID for full testing');
  }

  // Final results
  console.log('\n📊 FINAL TEST RESULTS:');
  console.log('========================');
  console.log(`Frontend Server: ${serverStatus ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend Server: ${serverStatus ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Telegram API: ${telegramStatus ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Component Integration: ${componentIntegration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Environment Variables: ${envVars ? '✅ PASS' : '⚠️  PARTIAL'}`);
  console.log(`Message Delivery: ${messageSent ? '✅ PASS' : telegramStatus?.isReady ? '❌ FAIL' : '⚠️  SKIPPED'}`);

  if (serverStatus && telegramStatus && componentIntegration) {
    console.log('\n🎉 PRINCIPLE ASK INTEGRATION: WORKING!');
    console.log('\n✨ How to test manually:');
    console.log('1. Open http://localhost:8080 in your browser');
    console.log('2. Login as a Publisher Mentor');
    console.log('3. Look for the "Principle Ask" button in:');
    console.log('   - Header navigation (blue button)');
    console.log('   - Dashboard quick actions (action card)');
    console.log('4. Click the button and send a test message');
    console.log('5. Check if the message appears in the Principal\'s Telegram');
    
    if (messageSent) {
      console.log('\n📱 A test message was just sent to the Principal\'s Telegram!');
    }
  } else {
    console.log('\n❌ ISSUES DETECTED - Please fix the failing tests above');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
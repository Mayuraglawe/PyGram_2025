#!/usr/bin/env node

/**
 * Test Telegram Bot Integration with @Principle_Pygram_bot
 */

console.log('🤖 Testing @Principle_Pygram_bot Integration\n');

// Test the Telegram bot status
async function testTelegramBot() {
  try {
    console.log('📡 Testing Telegram API endpoint...');
    const response = await fetch('http://localhost:8080/api/telegram/status');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Telegram API is accessible');
      console.log('📊 Bot Status:');
      console.log(`   - Service Ready: ${data.status?.isReady ? '✅' : '❌'}`);
      console.log(`   - Has Token: ${data.status?.hasToken ? '✅' : '❌'}`);
      console.log(`   - Has Chat ID: ${data.status?.hasChatId ? '✅' : '❌'}`);
      
      if (data.status?.hasToken && !data.status?.hasChatId) {
        console.log('\n⚠️  Missing TELEGRAM_PRINCIPAL_CHAT_ID');
        console.log('📝 To get the Principal\'s chat ID:');
        console.log('   1. The Principal should start a chat with @Principle_Pygram_bot');
        console.log('   2. Send any message (like "/start" or "Hello")');
        console.log('   3. Use the bot API to get the chat ID');
        console.log('   4. Add it to the .env file as TELEGRAM_PRINCIPAL_CHAT_ID');
      }
      
      return data.status;
    } else {
      console.log('❌ Telegram API not accessible');
      return null;
    }
  } catch (error) {
    console.log(`❌ Error testing Telegram API: ${error.message}`);
    return null;
  }
}

// Test sending a message
async function testMessageSending() {
  console.log('\n📤 Testing message sending...');
  
  const testMessage = {
    senderName: "Test Publisher",
    senderRole: "mentor (Publisher)",
    senderDepartment: "Computer Science",
    message: "🧪 Test Message - This is a test from the Principle Ask button to verify @Principle_Pygram_bot is working correctly!",
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
      console.log('✅ Message sent successfully!');
      console.log(`📨 Message ID: ${data.messageId || 'N/A'}`);
      console.log(`⏰ Timestamp: ${data.timestamp || 'N/A'}`);
      console.log('📱 Check @Principle_Pygram_bot for the message!');
      return true;
    } else {
      console.log('❌ Message sending failed');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    return false;
  }
}

// Main execution
async function runTest() {
  console.log('🎯 Running Telegram Bot Test...\n');
  
  const status = await testTelegramBot();
  
  if (status?.isReady && status?.hasToken) {
    if (status?.hasChatId) {
      const messageSent = await testMessageSending();
      
      if (messageSent) {
        console.log('\n🎉 SUCCESS! Your Principle Ask button is working!');
        console.log('\n📋 Manual Testing Steps:');
        console.log('1. Open http://localhost:8080 in your browser');
        console.log('2. Login with: username="pygram2k25", password="pygram2k25"');
        console.log('3. Look for the blue "Principle Ask" button in the header');
        console.log('4. Click it and send a test message');
        console.log('5. Check @Principle_Pygram_bot for the message');
      } else {
        console.log('\n❌ Message sending failed. Check the configuration.');
      }
    } else {
      console.log('\n⚠️  Bot is ready but missing Principal\'s chat ID');
      console.log('📝 Next steps:');
      console.log('1. Principal should message @Principle_Pygram_bot');
      console.log('2. Get the chat ID and add it to .env file');
      console.log('3. Restart the application');
    }
  } else {
    console.log('\n❌ Telegram bot not properly configured');
    console.log('📝 Check:');
    console.log('- TELEGRAM_BOT_TOKEN is correct in .env');
    console.log('- Bot token is from @BotFather');
    console.log('- Server is running properly');
  }
}

// Wait a moment for server to be ready, then run test
setTimeout(runTest, 2000);
// Frontend Integration Test Script
// Run this in the browser console on localhost:8080 after logging in

console.log('🧪 PRINCIPLE ASK BUTTON INTEGRATION TEST');
console.log('==========================================');

// Step 1: Check if we're on the right page
if (window.location.href.includes('localhost:8080')) {
    console.log('✅ On correct domain');
} else {
    console.error('❌ Not on localhost:8080');
}

// Step 2: Check if PrincipleAskButton exists in the DOM
function checkButtonExists() {
    const buttons = document.querySelectorAll('button');
    let principleButton = null;
    
    buttons.forEach(button => {
        if (button.textContent.includes('Principle Ask') || button.textContent.includes('Principal Ask')) {
            principleButton = button;
        }
    });
    
    if (principleButton) {
        console.log('✅ Found Principle Ask button:', principleButton);
        console.log('   Button text:', principleButton.textContent);
        console.log('   Button classes:', principleButton.className);
        return principleButton;
    } else {
        console.log('❌ Principle Ask button not found');
        console.log('Available buttons:', Array.from(buttons).map(b => b.textContent));
        return null;
    }
}

// Step 3: Check authentication status
function checkAuth() {
    const authData = localStorage.getItem('supabase.auth.token') || sessionStorage.getItem('supabase.auth.token');
    if (authData) {
        console.log('✅ User appears to be authenticated');
        return true;
    } else {
        console.log('❌ User not authenticated - please login first');
        return false;
    }
}

// Step 4: Test API endpoint directly
async function testApiDirect() {
    console.log('🔗 Testing API endpoint directly...');
    
    const testPayload = {
        senderName: "Frontend Test User",
        senderRole: "mentor (Publisher)",
        senderDepartment: "Computer Science",
        message: "🧪 FRONTEND INTEGRATION TEST\n\nThis message was sent directly from the browser console to test the complete integration.\n\nTimestamp: " + new Date().toLocaleString(),
        priority: "medium"
    };
    
    try {
        const response = await fetch('/api/telegram/send-to-principal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Direct API test successful!');
            console.log('   Response:', data);
            return true;
        } else {
            console.log('❌ Direct API test failed');
            console.log('   Status:', response.status);
            console.log('   Response:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ API test error:', error);
        return false;
    }
}

// Step 5: Test button click simulation
function testButtonClick() {
    console.log('🖱️ Testing button click simulation...');
    
    const button = checkButtonExists();
    if (!button) {
        console.log('❌ Cannot test button - not found');
        return false;
    }
    
    try {
        // Simulate click
        button.click();
        console.log('✅ Button click triggered');
        
        // Check if modal opened
        setTimeout(() => {
            const modal = document.querySelector('[role="dialog"]') || document.querySelector('.modal');
            if (modal) {
                console.log('✅ Modal appears to have opened');
                console.log('   Modal element:', modal);
            } else {
                console.log('❌ Modal did not open or not found');
            }
        }, 500);
        
        return true;
    } catch (error) {
        console.log('❌ Button click error:', error);
        return false;
    }
}

// Main test function
async function runFullTest() {
    console.log('🎯 Running complete integration test...');
    console.log('');
    
    // Check authentication
    const isAuth = checkAuth();
    
    // Check button exists
    const hasButton = checkButtonExists();
    
    // Test API directly
    const apiWorks = await testApiDirect();
    
    // Test button click
    const buttonWorks = testButtonClick();
    
    console.log('');
    console.log('📊 TEST RESULTS:');
    console.log('================');
    console.log('Authentication:', isAuth ? '✅ PASS' : '❌ FAIL');
    console.log('Button exists:', hasButton ? '✅ PASS' : '❌ FAIL');
    console.log('API endpoint:', apiWorks ? '✅ PASS' : '❌ FAIL');
    console.log('Button click:', buttonWorks ? '✅ PASS' : '❌ FAIL');
    
    if (isAuth && hasButton && apiWorks) {
        console.log('');
        console.log('🎉 INTEGRATION TEST: SUCCESS!');
        console.log('The Principle Ask button should be working correctly.');
        console.log('');
        console.log('📋 Manual Testing:');
        console.log('1. Click the Principle Ask button');
        console.log('2. Fill out the form with a test message');
        console.log('3. Click Send');
        console.log('4. Check Mayur\'s Telegram for the message');
    } else {
        console.log('');
        console.log('❌ INTEGRATION ISSUES DETECTED');
        console.log('Please resolve the failed tests above.');
    }
}

// Run the test
runFullTest();
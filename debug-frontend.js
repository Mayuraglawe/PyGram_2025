// Debug script for Principle Ask Button
// Copy and paste this into the browser console at localhost:8080

console.log('🔧 DEBUGGING PRINCIPLE ASK BUTTON');

// Function to monitor network requests
function monitorNetworkRequests() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        console.log('🌐 Network Request:', args[0]);
        if (args[1]) {
            console.log('   Method:', args[1].method || 'GET');
            console.log('   Headers:', args[1].headers);
            if (args[1].body) {
                console.log('   Body:', args[1].body);
            }
        }
        
        return originalFetch.apply(this, args)
            .then(response => {
                console.log('📥 Response:', response.status, response.statusText);
                return response;
            })
            .catch(error => {
                console.error('❌ Request Error:', error);
                throw error;
            });
    };
    
    console.log('✅ Network monitoring enabled');
}

// Function to find and click the Principle Ask button
function findAndTestButton() {
    console.log('🔍 Looking for Principle Ask button...');
    
    // Look for button containing "Principle" or "Principal"
    const buttons = Array.from(document.querySelectorAll('button'));
    const principleButton = buttons.find(btn => 
        btn.textContent.includes('Principle') || 
        btn.textContent.includes('Principal') ||
        btn.innerHTML.includes('Crown') // Icon indicator
    );
    
    if (principleButton) {
        console.log('✅ Found Principle Ask button:', principleButton);
        console.log('   Text:', principleButton.textContent);
        console.log('   Classes:', principleButton.className);
        
        // Add click listener to debug
        principleButton.addEventListener('click', function(e) {
            console.log('🖱️ Button clicked!', e);
        });
        
        return principleButton;
    } else {
        console.log('❌ Principle Ask button not found');
        console.log('Available buttons:');
        buttons.forEach((btn, i) => {
            console.log(`   ${i + 1}. "${btn.textContent.slice(0, 50)}"`);
        });
        return null;
    }
}

// Function to test form submission
async function testFormSubmission() {
    console.log('📝 Testing form submission directly...');
    
    const testData = {
        senderName: "Debug Test User",
        senderRole: "mentor (Publisher)",
        senderDepartment: "Computer Science",
        message: "📋 General Query\n\n🔧 FRONTEND DEBUG TEST\n\nThis message was sent from the frontend form to test the integration.\n\nTimestamp: " + new Date().toLocaleString(),
        priority: "medium"
    };
    
    try {
        console.log('📤 Sending test data:', testData);
        
        const response = await fetch('/api/telegram/send-to-principal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📥 Response status:', response.status);
        
        const data = await response.json();
        console.log('📥 Response data:', data);
        
        if (data.success) {
            console.log('✅ Form submission test successful!');
            console.log('📱 Check Telegram for the message');
            return true;
        } else {
            console.log('❌ Form submission failed:', data.error);
            return false;
        }
    } catch (error) {
        console.log('❌ Form submission error:', error);
        return false;
    }
}

// Function to check authentication
function checkAuthentication() {
    console.log('🔐 Checking authentication...');
    
    // Check for common auth indicators
    const authTokens = [
        localStorage.getItem('sb-access-token'),
        localStorage.getItem('supabase.auth.token'),
        sessionStorage.getItem('sb-access-token'),
        sessionStorage.getItem('supabase.auth.token')
    ];
    
    const hasAuth = authTokens.some(token => token && token !== 'null');
    
    if (hasAuth) {
        console.log('✅ User appears to be authenticated');
    } else {
        console.log('❌ User not authenticated - please login first');
        console.log('💡 Try logging in with: username="pygram2k25", password="pygram2k25"');
    }
    
    return hasAuth;
}

// Function to check for errors in console
function checkConsoleErrors() {
    console.log('🐛 Checking for errors...');
    
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const errors = [];
    const warnings = [];
    
    console.error = function(...args) {
        errors.push(args);
        console.log('🚨 Console Error detected:', args);
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        warnings.push(args);
        console.log('⚠️ Console Warning detected:', args);
        originalWarn.apply(console, args);
    };
    
    console.log('✅ Error monitoring enabled');
    
    return { errors, warnings };
}

// Main debug function
async function runDebugTest() {
    console.log('🎯 Starting complete debug test...');
    console.log('=====================================');
    
    // Enable monitoring
    monitorNetworkRequests();
    const errorMonitor = checkConsoleErrors();
    
    // Check auth
    const isAuthenticated = checkAuthentication();
    
    // Find button
    const button = findAndTestButton();
    
    // Test API directly
    const apiWorks = await testFormSubmission();
    
    console.log('');
    console.log('📊 DEBUG RESULTS:');
    console.log('==================');
    console.log('Authentication:', isAuthenticated ? '✅ OK' : '❌ FAIL');
    console.log('Button found:', button ? '✅ OK' : '❌ FAIL');
    console.log('API works:', apiWorks ? '✅ OK' : '❌ FAIL');
    
    if (button && apiWorks) {
        console.log('');
        console.log('🎯 MANUAL TEST:');
        console.log('1. Click the Principle Ask button now');
        console.log('2. Fill out the form');
        console.log('3. Click Send');
        console.log('4. Watch the console for network requests');
        console.log('5. Check Telegram for the message');
    }
    
    console.log('');
    console.log('📝 Network requests and errors will be logged above as they happen');
}

// Run the debug test
runDebugTest();
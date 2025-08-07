// Debug Sign Out - Run this in browser console to test sign out flow

console.log('🔧 Sign Out Debug Script Loaded');

// Function to check current auth state
function checkAuthState() {
    console.log('📊 Current Auth State:');
    console.log('localStorage kerala_demo_user:', localStorage.getItem('kerala_demo_user'));
    console.log('localStorage kerala_remembered_credentials:', localStorage.getItem('kerala_remembered_credentials'));
    
    // Check if React app has any auth context
    try {
        // This would need to be adapted based on how the auth context is exposed
        console.log('React app loaded:', !!window.React);
    } catch (e) {
        console.log('Cannot access React context');
    }
}

// Function to simulate proper sign out
function simulateSignOut() {
    console.log('🚪 Simulating complete sign out...');
    
    // Check current state
    const beforeUser = localStorage.getItem('kerala_demo_user');
    if (beforeUser) {
        const userData = JSON.parse(beforeUser);
        console.log('👤 Signing out:', userData.name);
        
        // Clear localStorage
        localStorage.removeItem('kerala_demo_user');
        localStorage.removeItem('kerala_remembered_credentials');
        
        console.log('✅ localStorage cleared');
        
        // Try to trigger React state update by dispatching a storage event
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'kerala_demo_user',
            oldValue: beforeUser,
            newValue: null,
            storageArea: localStorage
        }));
        
        console.log('📡 Storage event dispatched');
        
        // Force reload if needed (last resort)
        // window.location.reload();
    } else {
        console.log('⚠️ No user to sign out');
    }
}

// Function to create test user
function createTestUser() {
    console.log('👤 Creating test user...');
    const testUser = {
        id: 'debug_user_' + Date.now(),
        email: 'debug@test.com',
        name: 'Debug User',
        role: 'organizer',
        isDemo: true,
        rememberMe: false
    };
    
    localStorage.setItem('kerala_demo_user', JSON.stringify(testUser));
    console.log('✅ Test user created');
    
    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'kerala_demo_user',
        oldValue: null,
        newValue: JSON.stringify(testUser),
        storageArea: localStorage
    }));
}

// Monitor localStorage changes
let monitoring = false;
function startMonitoring() {
    if (monitoring) return;
    monitoring = true;
    
    console.log('🔍 Starting localStorage monitoring...');
    
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
        if (key.includes('kerala')) {
            console.log('📝 localStorage SET:', key, '=', value);
        }
        return originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
        if (key.includes('kerala')) {
            console.log('🗑️ localStorage REMOVE:', key);
        }
        return originalRemoveItem.apply(this, arguments);
    };
    
    // Also monitor storage events
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.includes('kerala')) {
            console.log('📡 Storage event:', e.key, e.oldValue, '->', e.newValue);
        }
    });
}

// Expose functions globally
window.debugSignOut = {
    checkAuthState,
    simulateSignOut,
    createTestUser,
    startMonitoring
};

console.log('🎯 Debug functions available:');
console.log('- debugSignOut.checkAuthState()');
console.log('- debugSignOut.simulateSignOut()');  
console.log('- debugSignOut.createTestUser()');
console.log('- debugSignOut.startMonitoring()');

// Auto-check state
checkAuthState();
# 🔐 Test Configuration Guide

## Centralized Configuration

All test files import credentials and settings from a single source: `config/test.config.js`

### Current Settings

```javascript
BASE_URL: 'http://localhost:5173'
ADMIN_EMAIL: 'admin'
ADMIN_PASSWORD: '123456'
USER_EMAIL: 'sean'
USER_PASSWORD: '123456'
```

### Why Centralized Config?

✅ **Single Source of Truth** - Change credentials once, affects all tests  
✅ **Consistency** - All tests use same accounts  
✅ **Easy Maintenance** - Update one file instead of 10+ test files  
✅ **Environment Switching** - Easy to swap between dev/staging/prod  
✅ **Security** - Can use environment variables in the future

---

## How to Change Settings

### 1. Update Base URL

Edit `Testing/config/test.config.js`:

```javascript
BASE_URL: 'http://localhost:3000',  // Change port
```

### 2. Update Admin Credentials

```javascript
ADMIN_EMAIL: 'newadmin',
ADMIN_PASSWORD: 'newpass123',
```

### 3. Update User Credentials

```javascript
USER_EMAIL: 'newuser',
USER_PASSWORD: 'userpass123',
```

---

## Using Config in Test Files

Every test file imports from the config:

```javascript
import { test, expect } from '@playwright/test';
import { 
    BASE_URL, 
    ADMIN_EMAIL, 
    ADMIN_PASSWORD, 
    USER_EMAIL, 
    USER_PASSWORD 
} from '../../config/test.config.js';

test('login as admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
});
```

---

## Available Timeout Values

The config also provides timeout constants:

```javascript
DEFAULT_TIMEOUT: 10000      // 10 seconds
NAVIGATION_TIMEOUT: 10000   // 10 seconds
MODAL_TIMEOUT: 5000         // 5 seconds
SHORT_WAIT: 500             // 500ms
MEDIUM_WAIT: 1000           // 1 second
LONG_WAIT: 2000             // 2 seconds
```

### Usage Example

```javascript
import { MODAL_TIMEOUT, SHORT_WAIT } from '../../config/test.config.js';

// Wait for modal to close
await page.waitForSelector('.modal', { 
    state: 'hidden', 
    timeout: MODAL_TIMEOUT 
});

// Brief wait for UI update
await page.waitForTimeout(SHORT_WAIT);
```

---

## Environment Variables (Future Enhancement)

To use environment-specific settings, you can modify `test.config.js`:

```javascript
export const TEST_CONFIG = {
    BASE_URL: process.env.TEST_URL || 'http://localhost:5173',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '123456',
    // ...
};
```

Then create `.env` file:
```
TEST_URL=http://staging.example.com
ADMIN_EMAIL=staging_admin
ADMIN_PASSWORD=staging_pass
```

---

## Test Account Requirements

For tests to run successfully, ensure these accounts exist in your database:

### Admin Account
- Username/Email: `admin`
- Password: `123456`
- Role: Administrator
- Permissions: Full access to admin panel, EIC, Distribution

### User Account
- Username/Email: `sean`
- Password: `123456`
- Role: Farmer/User
- Permissions: Request equipment, view distribution items

---

## Quick Reference

| Setting | Value | Purpose |
|---------|-------|---------|
| BASE_URL | `http://localhost:5173` | Client application URL |
| ADMIN_EMAIL | `admin` | Admin login username |
| ADMIN_PASSWORD | `123456` | Admin login password |
| USER_EMAIL | `sean` | Regular user username |
| USER_PASSWORD | `123456` | Regular user password |

---

**Last Updated:** November 30, 2025  
**Config Location:** `Testing/config/test.config.js`

# 🎭 Playwright Setup Complete - Quick Reference

## ✅ What's Been Set Up

### 📁 Folder Structure
```
Farmer-Connect/
└── Testing/                       # All testing files organized here
    ├── config/
    │   ├── playwright.config.js   # Playwright configuration
    │   └── test.config.js         # Centralized credentials & URLs
    ├── specs/                     # Test files by module
    │   ├── eic/
    │   │   └── eic.spec.js        # EIC tests (17 tests)
    │   └── distribution/
    │       └── distribution.spec.js # Distribution tests (25 tests)
    ├── example.spec.js            # Sample test (auto-generated)
    ├── TEMPLATE.spec.js.example   # Comprehensive test template
    ├── test-manager.js            # Console UI test manager
    ├── test-manager.bat           # Windows shortcut
    ├── README.md                  # Complete documentation
    ├── TEST_COVERAGE.md           # Test coverage details
    └── PLAYWRIGHT_SETUP.md        # This file
```

### 🎯 Installed Components

- ✅ **Playwright Test Framework** (@playwright/test)
- ✅ **Three browsers**: Chromium, Firefox, WebKit
- ✅ **Test Manager Console UI** (interactive test runner)
- ✅ **NPM Scripts** for common test operations
- ✅ **Complete documentation** in Testing/README.md

---

## 🚀 How to Use

### Method 1: Console UI Test Manager (RECOMMENDED) ⭐

**Windows (from Testing folder):**
```bash
# Double-click or run:
test-manager.bat
```

**Or from project root:**
```bash
npm run test:manager
```

**Features:**
- 📋 View all test files with statistics
- 🏃 Run individual or all tests
- 🎨 Open Playwright UI Mode
- 👁️ Run tests in headed mode (visible browser)
- 🐛 Debug mode support
- 📊 View test reports
- 🎬 Generate tests with Codegen

### Method 2: NPM Scripts

```bash
# Run all tests
npm test

# Interactive UI mode (BEST for development)
npm run test:ui

# Run with visible browser
npm run test:headed

# Debug mode
npm run test:debug

# View test report
npm run test:report

# Generate tests by recording actions
npm run test:codegen
```

### Method 3: Direct Playwright Commands

```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test example.spec.js

# Run in UI mode
npx playwright test --ui

# Run in headed mode
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
```

---

## 📝 Creating Your First Test

### Step 1: Generate Test with Codegen (Easiest)

1. Run the test manager:
   ```bash
   npm run test:manager
   ```

2. Select **[C] Codegen**

3. Enter your app URL (e.g., `http://localhost:3000`)

4. Browser opens - perform your actions

5. Code is auto-generated in the inspector

6. Copy and save to a new `.spec.js` file in `Testing/`

### Step 2: Write Test Manually

Create a new file in `Testing/` folder (e.g., `auth.spec.js`):

```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('user can login', async ({ page }) => {
        // Navigate to login page
        await page.goto('http://localhost:3000/login');
        
        // Fill in credentials
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password123');
        
        // Click login button
        await page.click('button[type="submit"]');
        
        // Verify redirect to dashboard
        await expect(page).toHaveURL(/.*dashboard/);
        
        // Verify welcome message
        await expect(page.locator('h1')).toContainText('Dashboard');
    });
});
```

### Step 3: Run Your Test

Using test manager:
```bash
npm run test:manager
# Select your test file from the list
```

Or directly:
```bash
npx playwright test auth.spec.js
```

---

## 🎨 Test Manager Features

### Main Menu Options

```
[A] Run ALL tests              - Execute entire test suite
[U] Open Playwright UI Mode    - Interactive test runner
[H] Run tests in Headed Mode   - See browser while testing
[D] Run tests in Debug Mode    - Step-by-step debugging
[R] Show test Report           - View HTML test report
[C] Open Codegen               - Record actions to generate tests
[1-N] Run specific test        - Run individual test file
[Q] Quit                       - Exit test manager
```

### Per-Test Run Modes

When selecting a specific test, choose:
1. **Normal** (headless) - Fast, no UI
2. **Headed** - See browser
3. **Debug** - Step through with breakpoints
4. **UI Mode** - Interactive test runner

---

## 📊 Example Test Scenarios for Farmer-Connect

### EIC Module Tests
```javascript
// Testing/eic.spec.js
import { test, expect } from '@playwright/test';

test.describe('EIC Management', () => {
    test('admin can add EIC item with date limit', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/eic');
        await page.click('button:has-text("Add Item")');
        
        await page.fill('input[name="name"]', 'Test Tractor');
        await page.fill('input[name="quantity"]', '5');
        await page.fill('input[name="date_limit"]', '30');
        
        await page.click('button[type="submit"]');
        
        await expect(page.locator('.success-message')).toBeVisible();
    });
    
    test('user cannot exceed date limit when borrowing', async ({ page }) => {
        // Test Phase 1 validation
        await page.goto('http://localhost:3000/client/eic');
        await page.click('.item-card >> nth=0');
        
        // Try to select dates beyond limit
        await page.fill('input[name="pickup_date"]', '2025-12-01');
        await page.fill('input[name="return_date"]', '2026-01-15');
        
        // Should show warning
        await expect(page.locator('.warning-banner')).toBeVisible();
        await expect(page.locator('.warning-banner')).toContainText('exceeds');
    });
});
```

### Authentication Tests
```javascript
// Testing/auth.spec.js
test.describe('Authentication', () => {
    test('user login flow', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[name="email"]', 'farmer@example.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        await expect(page).toHaveURL(/.*dashboard/);
    });
    
    test('admin login flow', async ({ page }) => {
        await page.goto('http://localhost:3000/admin/login');
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
        await page.click('button[type="submit"]');
        
        await expect(page).toHaveURL(/.*admin/);
    });
});
```

---

## 🐛 Debugging Tips

### Use Playwright Inspector
```bash
npx playwright test --debug
```

### Add Breakpoints in Code
```javascript
test('my test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.pause(); // Pauses test here
    await page.click('button');
});
```

### Take Screenshots
```javascript
test('visual test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
```

### Slow Down Tests
```javascript
test.use({ slowMo: 1000 }); // 1 second delay between actions
```

---

## 📋 Next Steps

1. ✅ **Setup Complete** - Playwright is ready!

2. 📝 **Write Tests** for:
   - [ ] Authentication (login/logout)
   - [ ] EIC Module (Phase 1 & 2 features)
   - [ ] Distribution Module
   - [ ] Admin Panel
   - [ ] Date validations
   - [ ] Quantity validations

3. 🎬 **Use Codegen** to quickly generate test code

4. 🎨 **Use Test Manager** for convenient test running

5. 📊 **Review Reports** after each test run

6. 🔄 **Integrate with CI/CD** (optional - GitHub Actions, etc.)

---

## 📚 Resources

- **Test Manager**: Run `npm run test:manager`
- **Full Documentation**: See `Testing/README.md`
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Best Practices**: https://playwright.dev/docs/best-practices

---

## ⚡ Quick Commands Reference

```bash
# Start Test Manager (Interactive UI)
npm run test:manager
# or
test-manager.bat

# Run all tests
npm test

# Open UI Mode (Best for development)
npm run test:ui

# Generate tests by recording
npm run test:codegen

# View test report
npm run test:report

# Debug a test
npx playwright test --debug example.spec.js

# Run specific browser
npx playwright test --project=firefox
```

---

**Your Playwright testing environment is ready! 🎉**

Start by running: `npm run test:manager`

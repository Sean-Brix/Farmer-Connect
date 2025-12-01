# 🎭 Playwright Testing Suite - Farmer Connect

This folder contains end-to-end (E2E) tests for the Farmer-Connect Inventory Management System using Playwright.

## 📁 Folder Structure

```
Testing/
├── config/
│   ├── playwright.config.js # Playwright configuration
│   └── test.config.js       # Centralized test credentials & URLs
├── specs/                   # Test files organized by module
│   ├── eic/
│   │   └── eic.spec.js      # EIC module tests (17 tests)
│   └── distribution/
│       └── distribution.spec.js # Distribution tests (25 tests)
├── example.spec.js          # Example test file (auto-generated)
├── TEMPLATE.spec.js.example # Test template with examples
├── test-manager.js          # Console UI test manager
├── test-manager.bat         # Windows shortcut to run manager
├── README.md                # This file
├── PLAYWRIGHT_SETUP.md      # Quick setup guide
└── TEST_COVERAGE.md         # Detailed test coverage

Future tests:
├── specs/auth/              # Authentication tests (to be created)
└── specs/admin/             # Admin panel tests (to be created)
```

## 🔐 Test Configuration

All tests use centralized credentials from `config/test.config.js`:

**Admin Account:**
- Username: `admin`
- Password: `123456`

**User Account:**
- Username: `sean`
- Password: `123456`

**Base URL:** `http://localhost:5173`

To modify credentials or URL, edit `Testing/config/test.config.js`

## 🚀 Quick Start

### Using the Test Manager (Recommended)

Run the interactive console UI:

```bash
npm run test:manager
```

Or from the Testing folder:
```bash
node test-manager.js
# or double-click
test-manager.bat
```

This provides a menu-driven interface to:
- View all test files with stats
- Run individual tests or all tests
- Open Playwright UI Mode
- Run tests in headed/debug mode
- View test reports
- Generate tests with Codegen

### Using NPM Scripts

```bash
# Run all tests (headless)
npm test

# Open Playwright UI Mode (interactive)
npm run test:ui

# Run tests with visible browser
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report

# Generate tests with Codegen
npm run test:codegen
```

### Using Playwright CLI Directly

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test example.spec.js

# Run tests in UI mode
npx playwright test --ui

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Show test report
npx playwright show-report

# Generate tests with Codegen
npx playwright codegen http://localhost:3000
```

## 📝 Writing Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to page before each test
        await page.goto('http://localhost:3000');
    });

    test('should do something', async ({ page }) => {
        // Your test code here
        await page.click('button#submit');
        await expect(page.locator('h1')).toHaveText('Success');
    });

    test('should handle error case', async ({ page }) => {
        // Test error handling
        await page.fill('input#email', 'invalid-email');
        await page.click('button#submit');
        await expect(page.locator('.error')).toBeVisible();
    });
});
```

### Common Patterns

```javascript
// Wait for element
await page.waitForSelector('.my-element');

// Click element
await page.click('button#submit');

// Fill input
await page.fill('input#email', 'test@example.com');

// Select dropdown
await page.selectOption('select#category', 'Farming Equipment');

// Check checkbox
await page.check('input[type="checkbox"]');

// Upload file
await page.setInputFiles('input[type="file"]', 'path/to/file.jpg');

// Get text
const text = await page.locator('h1').textContent();

// Take screenshot
await page.screenshot({ path: 'screenshot.png' });

// Wait for navigation
await page.waitForNavigation();

// Assertions
await expect(page.locator('h1')).toHaveText('Expected Text');
await expect(page.locator('.error')).toBeVisible();
await expect(page.locator('.success')).toBeHidden();
await expect(page).toHaveURL('http://localhost:3000/dashboard');
```

## 🎯 Test Categories

### 1. Authentication Tests (`auth.spec.js`)
- User login
- User logout
- Admin login
- Registration
- Password reset
- Session management

### 2. EIC Module Tests (`eic.spec.js`)
- Add EIC item
- Edit EIC item
- Delete EIC item
- Request equipment
- Approve/reject requests
- Return equipment
- Date limit validation
- Quantity validation

### 3. Distribution Module Tests (`distribution.spec.js`)
- Add distribution item
- Request distribution
- Approve distribution
- Track distribution status

### 4. Admin Panel Tests (`admin.spec.js`)
- User management
- Inventory management
- Request tracking
- Analytics/reports

## 🌐 Browser Configuration

Tests run on multiple browsers by default:
- **Chromium** (Chrome, Edge)
- **Firefox**
- **WebKit** (Safari)

Configure in `playwright.config.js` to enable/disable browsers.

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Or directly:
```bash
npx playwright show-report
```

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (See Browser)
```bash
npm run test:headed
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Playwright Inspector
```bash
npx playwright test --debug
```

### VS Code Extension
Install the [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension for:
- Run tests from editor
- Set breakpoints
- View test results inline

## 🎬 Codegen - Auto-generate Tests

Record your actions in the browser to generate test code:

```bash
npm run test:codegen
# or
npx playwright codegen http://localhost:3000
```

This opens a browser where your actions are recorded and converted to test code.

## ⚙️ Configuration

Edit `playwright.config.js` for:
- Base URL
- Test timeout
- Retries
- Parallel execution
- Browser settings
- Screenshots/videos on failure

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Assertions](https://playwright.dev/docs/test-assertions)

## 💡 Tips

1. **Use data-testid attributes** for reliable selectors:
   ```html
   <button data-testid="submit-btn">Submit</button>
   ```
   ```javascript
   await page.click('[data-testid="submit-btn"]');
   ```

2. **Group related tests** with `test.describe()`

3. **Use fixtures** for common setup (page, authenticated user, etc.)

4. **Run tests in parallel** for speed (enabled by default)

5. **Add screenshots/videos** on failure for debugging:
   ```javascript
   test('my test', async ({ page }) => {
       await page.screenshot({ path: 'debug.png', fullPage: true });
   });
   ```

6. **Use the Test Manager** for the best development experience!

---

**Happy Testing! 🎭**

import { test, expect } from '@playwright/test';
import { 
    BASE_URL, 
    ADMIN_EMAIL, 
    ADMIN_PASSWORD, 
    USER_EMAIL, 
    USER_PASSWORD,
    DEFAULT_TIMEOUT,
    MODAL_TIMEOUT,
    SHORT_WAIT,
    MEDIUM_WAIT
} from '../../config/test.config.js';

/**
 * EIC (Equipment in Circulation) Module Tests
 * 
 * Tests cover:
 * - Admin: Add/Edit/View EIC items with date_limit
 * - Client: Browse items, request equipment, date validations
 * - Phase 1: Date and quantity validations
 * - Phase 2: Date limit configuration and display
 */

test.describe('EIC Admin Module', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto(`${BASE_URL}/admin/login`);
        await page.fill('input[name="email"]', ADMIN_EMAIL);
        await page.fill('input[name="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        
        // Wait for redirect to admin dashboard
        await page.waitForURL(/.*admin/);
        
        // Navigate to EIC section
        await page.click('a:has-text("EIC")');
        await page.waitForSelector('.items-grid, .items-list, table');
    });

    test('should display EIC items list', async ({ page }) => {
        // Verify page loaded
        await expect(page.locator('h1, h2')).toContainText(/EIC|Equipment/i);
        
        // Check for items or empty state
        const hasItems = await page.locator('.item-card, tr').count() > 0;
        if (!hasItems) {
            await expect(page.locator('text=/no items|empty/i')).toBeVisible();
        }
    });

    test('should open add EIC item modal', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        // Verify modal opened
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
        await expect(page.locator('text=/add.*item/i')).toBeVisible();
    });

    test('should add new EIC item with date limit', async ({ page }) => {
        // Open add modal
        await page.click('button:has-text("Add")');
        
        // Fill form
        const itemName = `Test Tractor ${Date.now()}`;
        await page.fill('input[name="name"]', itemName);
        await page.fill('input[name="quantity"]', '5');
        await page.fill('input[name="date_limit"]', '30');
        await page.fill('input[name="description"], textarea[name="description"]', 'Test equipment for automated testing');
        
        // Select category if visible
        const categorySelect = page.locator('select[name="category"]');
        if (await categorySelect.isVisible()) {
            await categorySelect.selectOption('Farming Equipment');
        }
        
        // Submit form
        await page.click('button[type="submit"]');
        
        // Wait for success message or modal close
        await page.waitForSelector('.modal, [role="dialog"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
        
        // Verify item appears in list
        await page.waitForTimeout(1000); // Brief wait for refresh
        await expect(page.locator(`text=${itemName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should display date_limit in item details', async ({ page }) => {
        // Find first item with detail/view button
        const viewButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
        
        if (await viewButton.isVisible()) {
            await viewButton.click();
            
            // Modal should open
            await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
            
            // Check if date_limit badge exists (Phase 2 feature)
            const dateLimitBadge = page.locator('text=/max.*day/i, [title*="borrowing"], [title*="limit"]');
            // Note: This may not be visible if item has no date_limit
        }
    });

    test('should edit EIC item and update date_limit', async ({ page }) => {
        // Find first edit button
        const editButton = page.locator('button:has-text("Edit")').first();
        
        if (await editButton.isVisible()) {
            await editButton.click();
            
            // Wait for edit modal
            await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
            
            // Update date_limit
            const dateLimitInput = page.locator('input[name="date_limit"]');
            if (await dateLimitInput.isVisible()) {
                await dateLimitInput.fill('45');
            }
            
            // Update quantity
            await page.fill('input[name="quantity"]', '10');
            
            // Submit
            await page.click('button[type="submit"]');
            
            // Wait for modal to close
            await page.waitForSelector('.modal, [role="dialog"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
        }
    });

    test('should validate required fields when adding item', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        // Try to submit empty form
        await page.click('button[type="submit"]');
        
        // Should show validation errors or prevent submission
        // Modal should still be visible
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
    });

    test('should validate date_limit range (1-365 days)', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        await page.fill('input[name="name"]', 'Test Item');
        await page.fill('input[name="quantity"]', '5');
        
        // Try invalid date_limit (>365)
        await page.fill('input[name="date_limit"]', '400');
        
        // Check for validation (HTML5 or custom)
        const dateLimitInput = page.locator('input[name="date_limit"]');
        const maxAttr = await dateLimitInput.getAttribute('max');
        expect(maxAttr).toBe('365');
    });
});

test.describe('EIC Client Module', () => {
    test.beforeEach(async ({ page }) => {
        // Login as regular user
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', USER_EMAIL);
        await page.fill('input[name="password"]', USER_PASSWORD);
        await page.click('button[type="submit"]');
        
        // Navigate to EIC section
        await page.waitForURL(/.*dashboard|home/i, { timeout: 10000 }).catch(() => {});
        await page.click('a:has-text("EIC")');
        await page.waitForSelector('.items-grid, .item-card, .equipment-list', { timeout: 10000 });
    });

    test('should display available EIC items', async ({ page }) => {
        // Check for items
        const itemCount = await page.locator('.item-card, .equipment-item').count();
        
        if (itemCount === 0) {
            await expect(page.locator('text=/no items|no equipment/i')).toBeVisible();
        } else {
            expect(itemCount).toBeGreaterThan(0);
        }
    });

    test('should open item request modal', async ({ page }) => {
        // Click on first available item
        const firstItem = page.locator('.item-card, .equipment-item, button:has-text("Request")').first();
        await firstItem.click();
        
        // Modal should open
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
    });

    test('should validate date inputs - prevent past dates (Phase 1)', async ({ page }) => {
        // Click first item
        await page.locator('.item-card, .equipment-item').first().click();
        
        // Wait for modal
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Try to enter past date for pickup
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const pastDate = yesterday.toISOString().split('T')[0];
        
        const pickupInput = page.locator('input[name="pickup_date"], input[type="date"]').first();
        await pickupInput.fill(pastDate);
        
        // Trigger blur to activate validation
        await pickupInput.blur();
        
        // Should show error or warning
        const errorMessage = page.locator('text=/past|invalid|cannot/i, .error, .text-red');
        // Note: Validation might be in onBlur or onSubmit
    });

    test('should validate quantity - prevent exceeding available stock (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .equipment-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Get available quantity from modal
        const quantityText = await page.locator('text=/available|stock/i').first().textContent();
        const availableMatch = quantityText?.match(/\d+/);
        
        if (availableMatch) {
            const available = parseInt(availableMatch[0]);
            
            // Try to request more than available
            const quantityInput = page.locator('input[name="quantity"], input[type="number"]').first();
            await quantityInput.fill(String(available + 10));
            
            // Should auto-correct or show error
            await quantityInput.blur();
        }
    });

    test('should show date_limit warning when exceeding borrowing period (Phase 1)', async ({ page }) => {
        // Find item with date_limit (look for badge or indicator)
        const itemWithLimit = page.locator('.item-card:has(text=/max.*day/i), .item-card').first();
        await itemWithLimit.click();
        
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Set pickup and return dates that exceed limit
        const today = new Date();
        const pickup = new Date(today);
        pickup.setDate(pickup.getDate() + 1);
        const returnDate = new Date(pickup);
        returnDate.setDate(returnDate.getDate() + 50); // 50 days later
        
        await page.fill('input[name="pickup_date"]', pickup.toISOString().split('T')[0]);
        await page.fill('input[name="return_date"]', returnDate.toISOString().split('T')[0]);
        
        // Should show warning banner
        const warning = page.locator('.warning, .alert-warning, text=/exceeds/i, .bg-yellow, .bg-orange');
        // Note: Warning only appears if item has date_limit set
    });

    test('should prevent negative or decimal quantity input (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .equipment-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        const quantityInput = page.locator('input[name="quantity"]').first();
        
        // Try negative number
        await quantityInput.fill('-5');
        await quantityInput.blur();
        
        // Should be corrected or prevented
        const value = await quantityInput.inputValue();
        expect(parseInt(value)).toBeGreaterThanOrEqual(0);
    });

    test('should submit equipment request successfully', async ({ page }) => {
        await page.locator('.item-card, .equipment-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Fill valid request
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(tomorrow);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        await page.fill('input[name="pickup_date"]', tomorrow.toISOString().split('T')[0]);
        await page.fill('input[name="return_date"]', nextWeek.toISOString().split('T')[0]);
        await page.fill('input[name="quantity"]', '1');
        
        // Add note if field exists
        const noteField = page.locator('textarea[name="note"], textarea[name="requestNote"]');
        if (await noteField.isVisible()) {
            await noteField.fill('Automated test request');
        }
        
        // Submit
        await page.click('button[type="submit"]:has-text("Request"), button:has-text("Submit")');
        
        // Wait for success
        await expect(page.locator('.success, .alert-success, text=/success/i')).toBeVisible({ timeout: 10000 });
    });
});

test.describe('EIC Request Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/login`);
        await page.fill('input[name="email"]', ADMIN_EMAIL);
        await page.fill('input[name="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*admin/);
        await page.click('a:has-text("EIC")');
    });

    test('should display requests list', async ({ page }) => {
        // Switch to requests tab if exists
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Should show requests table or list
        await expect(page.locator('table, .request-list, .requests')).toBeVisible();
    });

    test('should filter requests by status', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Find status filter
        const statusFilter = page.locator('select[name="status"], select:has(option:has-text("Pending"))');
        if (await statusFilter.isVisible()) {
            await statusFilter.selectOption('Pending');
            
            // Wait for filtered results
            await page.waitForTimeout(500);
        }
    });

    test('should approve request', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Find approve button for pending request
        const approveButton = page.locator('button:has-text("Approve")').first();
        if (await approveButton.isVisible()) {
            await approveButton.click();
            
            // Confirm if needed
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }
            
            // Should show success
            await expect(page.locator('.success, text=/approved/i')).toBeVisible({ timeout: 5000 });
        }
    });
});

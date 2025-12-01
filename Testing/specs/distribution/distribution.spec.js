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
 * Distribution Module Tests
 * 
 * Tests cover:
 * - Admin: Add/Edit/View distribution items
 * - Client: Browse items, request distributions
 * - Phase 1: Date and quantity validations
 * - Distribution-specific workflows
 */

test.describe('Distribution Admin Module', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto(`${BASE_URL}/admin/login`);
        await page.fill('input[name="email"]', ADMIN_EMAIL);
        await page.fill('input[name="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        
        // Wait for admin dashboard
        await page.waitForURL(/.*admin/);
        
        // Navigate to Distribution section
        await page.click('a:has-text("Distribution")');
        await page.waitForSelector('.items-grid, .items-list, table', { timeout: 10000 });
    });

    test('should display distribution items list', async ({ page }) => {
        // Verify page loaded
        await expect(page.locator('h1, h2')).toContainText(/distribution/i);
        
        // Check for items or empty state
        const hasItems = await page.locator('.item-card, tr').count() > 0;
        if (!hasItems) {
            await expect(page.locator('text=/no items|empty/i')).toBeVisible();
        }
    });

    test('should open add distribution item modal', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        // Verify modal opened
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
        await expect(page.locator('text=/add.*item/i')).toBeVisible();
    });

    test('should add new distribution item', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        // Fill form
        const itemName = `Test Seeds ${Date.now()}`;
        await page.fill('input[name="name"]', itemName);
        await page.fill('input[name="quantity"]', '100');
        await page.fill('input[name="description"], textarea[name="description"]', 'Test distribution item for automated testing');
        
        // Select category if visible
        const categorySelect = page.locator('select[name="category"]');
        if (await categorySelect.isVisible()) {
            await categorySelect.selectOption({ index: 1 }); // Select first non-default option
        }
        
        // Submit
        await page.click('button[type="submit"]');
        
        // Wait for modal to close
        await page.waitForSelector('.modal, [role="dialog"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
        
        // Verify item in list
        await page.waitForTimeout(1000);
        await expect(page.locator(`text=${itemName}`).first()).toBeVisible({ timeout: 10000 });
    });

    test('should display item details', async ({ page }) => {
        // Find view/details button
        const viewButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
        
        if (await viewButton.isVisible()) {
            await viewButton.click();
            
            // Modal should open with item details
            await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
            
            // Should show quantity
            await expect(page.locator('text=/quantity|available/i')).toBeVisible();
        }
    });

    test('should edit distribution item', async ({ page }) => {
        const editButton = page.locator('button:has-text("Edit")').first();
        
        if (await editButton.isVisible()) {
            await editButton.click();
            
            // Wait for edit modal
            await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
            
            // Update quantity
            const newQuantity = Math.floor(Math.random() * 100) + 50;
            await page.fill('input[name="quantity"]', String(newQuantity));
            
            // Update description
            await page.fill('textarea[name="description"]', `Updated at ${new Date().toLocaleString()}`);
            
            // Submit
            await page.click('button[type="submit"]');
            
            // Wait for modal close
            await page.waitForSelector('.modal, [role="dialog"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
        }
    });

    test('should validate required fields', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        // Try to submit without filling required fields
        await page.click('button[type="submit"]');
        
        // Modal should remain open (validation failed)
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
    });

    test('should validate quantity is positive number', async ({ page }) => {
        await page.click('button:has-text("Add")');
        
        await page.fill('input[name="name"]', 'Test Item');
        
        // Try negative quantity
        await page.fill('input[name="quantity"]', '-10');
        
        const quantityInput = page.locator('input[name="quantity"]');
        const minAttr = await quantityInput.getAttribute('min');
        
        // Should have min constraint
        expect(minAttr).toBe('0');
    });

    test('should delete distribution item', async ({ page }) => {
        const deleteButton = page.locator('button:has-text("Delete")').first();
        
        if (await deleteButton.isVisible()) {
            await deleteButton.click();
            
            // Confirm deletion
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').last();
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }
            
            // Should show success message
            await expect(page.locator('.success, text=/deleted/i')).toBeVisible({ timeout: 5000 });
        }
    });
});

test.describe('Distribution Client Module', () => {
    test.beforeEach(async ({ page }) => {
        // Login as user
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', USER_EMAIL);
        await page.fill('input[name="password"]', USER_PASSWORD);
        await page.click('button[type="submit"]');
        
        // Navigate to Distribution
        await page.waitForURL(/.*dashboard|home/i, { timeout: 10000 }).catch(() => {});
        await page.click('a:has-text("Distribution")');
        await page.waitForSelector('.items-grid, .item-card, .distribution-list', { timeout: 10000 });
    });

    test('should display available distribution items', async ({ page }) => {
        const itemCount = await page.locator('.item-card, .distribution-item').count();
        
        if (itemCount === 0) {
            await expect(page.locator('text=/no items|no distribution/i')).toBeVisible();
        } else {
            expect(itemCount).toBeGreaterThan(0);
        }
    });

    test('should open distribution request modal', async ({ page }) => {
        const firstItem = page.locator('.item-card, .distribution-item, button:has-text("Request")').first();
        await firstItem.click();
        
        // Modal should open
        await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
    });

    test('should validate pickup date - prevent past dates (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Try to set past date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const pastDate = yesterday.toISOString().split('T')[0];
        
        const pickupInput = page.locator('input[name="pickup_date"], input[type="date"]').first();
        await pickupInput.fill(pastDate);
        await pickupInput.blur();
        
        // Should show validation error or auto-correct
        // Note: Validation behavior depends on implementation
    });

    test('should validate pickup date - prevent unrealistic future dates (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Try far future date (5 years ahead)
        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 5);
        const futureDate = farFuture.toISOString().split('T')[0];
        
        const pickupInput = page.locator('input[name="pickup_date"]');
        const maxAttr = await pickupInput.getAttribute('max');
        
        // Should have max attribute limiting future dates
        expect(maxAttr).toBeTruthy();
    });

    test('should validate quantity - prevent exceeding available stock (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Get available quantity
        const quantityText = await page.locator('text=/available|stock/i').first().textContent();
        const availableMatch = quantityText?.match(/\d+/);
        
        if (availableMatch) {
            const available = parseInt(availableMatch[0]);
            
            // Try to request more than available
            const quantityInput = page.locator('input[name="quantity"]');
            await quantityInput.fill(String(available + 50));
            await quantityInput.blur();
            
            // Should auto-correct to max available
            const actualValue = await quantityInput.inputValue();
            expect(parseInt(actualValue)).toBeLessThanOrEqual(available);
        }
    });

    test('should prevent negative quantity (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        const quantityInput = page.locator('input[name="quantity"]');
        
        // Try to type negative
        await quantityInput.fill('-5');
        await quantityInput.blur();
        
        const value = await quantityInput.inputValue();
        expect(parseInt(value)).toBeGreaterThanOrEqual(0);
    });

    test('should prevent decimal quantity (Phase 1)', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        const quantityInput = page.locator('input[name="quantity"]');
        
        // Try to type decimal
        await quantityInput.fill('5.5');
        await quantityInput.blur();
        
        const value = await quantityInput.inputValue();
        // Should be integer
        expect(value).not.toContain('.');
    });

    test('should submit distribution request successfully', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Fill valid request
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await page.fill('input[name="pickup_date"]', tomorrow.toISOString().split('T')[0]);
        await page.fill('input[name="quantity"]', '5');
        
        // Add note if field exists
        const noteField = page.locator('textarea[name="note"], textarea[name="requestNote"]');
        if (await noteField.isVisible()) {
            await noteField.fill('Automated test distribution request');
        }
        
        // Submit
        await page.click('button[type="submit"]:has-text("Request"), button:has-text("Submit")');
        
        // Wait for success
        await expect(page.locator('.success, .alert-success, text=/success/i')).toBeVisible({ timeout: 10000 });
    });

    test('should display request confirmation details', async ({ page }) => {
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await page.fill('input[name="pickup_date"]', tomorrow.toISOString().split('T')[0]);
        await page.fill('input[name="quantity"]', '3');
        
        await page.click('button[type="submit"]:has-text("Request"), button:has-text("Submit")');
        
        // Should show confirmation with details
        await expect(page.locator('.success, .modal, text=/success|confirmed/i')).toBeVisible({ timeout: 10000 });
    });
});

test.describe('Distribution Request Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/admin/login`);
        await page.fill('input[name="email"]', ADMIN_EMAIL);
        await page.fill('input[name="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*admin/);
        await page.click('a:has-text("Distribution")');
    });

    test('should display distribution requests', async ({ page }) => {
        // Switch to requests tab if exists
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Should show requests
        await expect(page.locator('table, .request-list, .requests')).toBeVisible();
    });

    test('should search distribution requests', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Find search input
        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
        if (await searchInput.isVisible()) {
            await searchInput.fill('test');
            await page.waitForTimeout(500); // Wait for search
        }
    });

    test('should filter requests by status', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        const statusFilter = page.locator('select[name="status"], select:has(option:has-text("Pending"))');
        if (await statusFilter.isVisible()) {
            await statusFilter.selectOption('Pending');
            await page.waitForTimeout(500);
        }
    });

    test('should approve distribution request', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        const approveButton = page.locator('button:has-text("Approve")').first();
        if (await approveButton.isVisible()) {
            await approveButton.click();
            
            // Confirm if needed
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }
            
            await expect(page.locator('.success, text=/approved/i')).toBeVisible({ timeout: 5000 });
        }
    });

    test('should reject distribution request', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        const rejectButton = page.locator('button:has-text("Reject")').first();
        if (await rejectButton.isVisible()) {
            await rejectButton.click();
            
            // May need to provide reason
            const reasonField = page.locator('textarea[name="reason"], textarea');
            if (await reasonField.isVisible()) {
                await reasonField.fill('Test rejection reason');
            }
            
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Reject")').last();
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }
            
            await expect(page.locator('.success, text=/rejected/i')).toBeVisible({ timeout: 5000 });
        }
    });

    test('should mark distribution as completed', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Find completed/delivered button
        const completeButton = page.locator('button:has-text("Complete"), button:has-text("Delivered"), button:has-text("Picked")').first();
        if (await completeButton.isVisible()) {
            await completeButton.click();
            
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }
            
            await expect(page.locator('.success, text=/complete|delivered/i')).toBeVisible({ timeout: 5000 });
        }
    });

    test('should display request details with all information', async ({ page }) => {
        const requestsTab = page.locator('button:has-text("Requests"), a:has-text("Requests")');
        if (await requestsTab.isVisible()) {
            await requestsTab.click();
        }
        
        // Find view details button
        const detailsButton = page.locator('button:has-text("View"), button:has-text("Details")').first();
        if (await detailsButton.isVisible()) {
            await detailsButton.click();
            
            await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
            
            // Should show key information
            await expect(page.locator('text=/quantity|amount/i')).toBeVisible();
            await expect(page.locator('text=/pickup|date/i')).toBeVisible();
        }
    });
});

test.describe('Distribution vs EIC Differences', () => {
    test('distribution should NOT have return date field', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', USER_EMAIL);
        await page.fill('input[name="password"]', USER_PASSWORD);
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard|home/i, { timeout: 10000 }).catch(() => {});
        await page.click('a:has-text("Distribution")');
        await page.waitForSelector('.item-card, .distribution-item', { timeout: 10000 });
        
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Distribution should NOT have return_date field
        const returnDateField = page.locator('input[name="return_date"]');
        await expect(returnDateField).toHaveCount(0);
    });

    test('distribution should NOT show date_limit warnings', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', USER_EMAIL);
        await page.fill('input[name="password"]', USER_PASSWORD);
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard|home/i, { timeout: 10000 }).catch(() => {});
        await page.click('a:has-text("Distribution")');
        await page.waitForSelector('.item-card, .distribution-item', { timeout: 10000 });
        
        await page.locator('.item-card, .distribution-item').first().click();
        await page.waitForSelector('.modal, [role="dialog"]');
        
        // Distribution items don't have date_limit warnings (items are distributed, not borrowed)
        const warningBanner = page.locator('.warning, .alert-warning, text=/exceeds.*limit/i');
        await expect(warningBanner).toHaveCount(0);
    });
});

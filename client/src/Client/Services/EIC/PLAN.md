# EIC Client-Side Improvement Plan

## 🎯 Executive Summary

**Current State:** The client-side EIC system has significant usability and workflow gaps compared to the admin side. Users can request items but lack tracking, status updates, next-step guidance, and duplicate request prevention.

**Goal:** Create a logical, user-friendly request lifecycle that aligns with admin workflows and provides clear status tracking, actionable instructions, and prevents duplicate/invalid requests.

---

## 🔴 Critical Issues Identified

### 1. **No Request Tracking or Status Visibility**
- ❌ Users see status (Pending/Approved/Rejected) but don't understand what it means
- ❌ No clear indication of what to do next
- ❌ No visibility into request progress or timeline
- ❌ No notifications when status changes

### 2. **Missing Action Guidance**
- ❌ When "Approved" → User doesn't know they need to pick up the item
- ❌ No pickup instructions (where, when, who to contact)
- ❌ No return instructions or reminders
- ❌ No indication of overdue items

### 3. **Duplicate Request Prevention**
- ❌ Users can request the same item multiple times
- ❌ No validation to check active requests for the same item
- ❌ Can request while already having an approved/borrowed item

### 4. **Limited Request Management**
- ❌ Cannot edit pending requests
- ❌ Cannot cancel requests easily
- ❌ No request history or archive view

### 5. **Poor User Experience**
- ❌ No visual status indicators (icons, colors, badges)
- ❌ No estimated pickup/return dates display
- ❌ No countdown timers for return dates
- ❌ Generic error messages

---

## 📊 Request Status Flow (Admin Side)

```
Admin Request Lifecycle:
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Pending │ → │ Approved │ → │ Borrowed │ → │ Returned │ → │ Archive  │
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↓              ↓               ↓
┌──────────┐   ┌──────────┐   ┌────────────┐
│ Rejected │   │No_Pickup │   │Late_Return │
└──────────┘   └──────────┘   └────────────┘
     ↓              ↓               ↓
┌──────────────────────────────────────────┐
│              Archive                      │
└──────────────────────────────────────────┘
```

---

## 🎨 Proposed Client-Side Status System

### Status Categories with User Actions

| Status | What It Means | User Action Required | Visual Indicator |
|--------|---------------|---------------------|------------------|
| **Pending** | Request submitted, awaiting admin review | ⏳ Wait for approval | 🟡 Yellow badge, Clock icon |
| **Approved** | Request approved, ready for pickup | 📦 **Pick up item by [date]** | 🟢 Green badge, Pickup icon + Action button |
| **Borrowed** | Item currently in use | 📅 **Return by [date]** | 🔵 Blue badge, Calendar icon + Days remaining |
| **Late_Return** | Item overdue | ⚠️ **URGENT: Return immediately** | 🔴 Red badge, Warning icon + Overdue days |
| **Returned** | Item successfully returned | ✅ No action needed | ⚪ Gray badge, Checkmark icon |
| **Rejected** | Request denied by admin | ❌ View reason, can request again | 🔴 Red badge, X icon + Reason display |
| **No_Pickup** | Failed to pick up within deadline | ⚠️ Request expired, can resubmit | 🟠 Orange badge, Expired icon |
| **Cancelled** | You cancelled this request | ℹ️ Request cancelled | ⚪ Gray badge, Info icon |

---

## 🛠️ Implementation Plan

### **Phase 1: Enhanced Status Display & Tracking** 
**Priority: HIGH** | **Estimated: 2-3 hours**

#### 1.1 Status Badge Component
```jsx
// components/RequestStatusBadge.jsx
- Visual color-coded badges for each status
- Icon library for each status type
- Tooltip with status explanation
- Pulse animation for urgent statuses (Late_Return, Approved)
```

#### 1.2 Request Timeline Component
```jsx
// components/RequestTimeline.jsx
- Visual timeline showing request journey
- Current status highlighted
- Completed steps in green
- Future steps grayed out
- Estimated dates for each step
```

#### 1.3 Action Guidance Panel
```jsx
// components/RequestActionPanel.jsx
- Clear "What's Next" section for each status
- Action buttons (Pickup Confirmation, Cancel, etc.)
- Countdown timers for deadlines
- Contact information for admin
```

**Implementation:**
- Add status helper functions in `utils/statusHelpers.js`
- Create reusable status badge component
- Update My Requests modal to show enhanced status

---

### **Phase 2: Duplicate Request Prevention**
**Priority: HIGH** | **Estimated: 1-2 hours**

#### 2.1 Active Request Validation
```javascript
// Before submitting new request, check:
- Does user have pending request for this item?
- Does user have approved request for this item?
- Does user have borrowed/unreturned item of this type?
```

#### 2.2 UI Indicators
```jsx
// On equipment card:
- "Already Requested" badge if pending
- "Currently Borrowed" badge if active
- Disable "Request" button with tooltip explanation
```

#### 2.3 Smart Request Limits
```javascript
// Implement business rules:
- Max 1 pending request per item
- Max 1 active (approved/borrowed) request per item
- Can request again after return or rejection
```

**Implementation:**
- Add `checkDuplicateRequest` validation function
- Update equipment card rendering logic
- Add user-friendly error messages
- Create visual indicators for already-requested items

---

### **Phase 3: Action Guidance & Instructions**
**Priority: MEDIUM** | **Estimated: 2 hours**

#### 3.1 Status-Based Action Cards

**For "Approved" Status:**
```jsx
<ActionCard status="approved">
  <Title>📦 Your request has been approved!</Title>
  <Instructions>
    • Pick up your item by: {pickupDeadline}
    • Location: Equipment Lending Office
    • Bring: Valid ID and this confirmation
    • Hours: Monday-Friday, 8AM-5PM
  </Instructions>
  <Actions>
    <Button>Mark as Picked Up</Button>
    <Button>Cancel Request</Button>
  </Actions>
</ActionCard>
```

**For "Borrowed" Status:**
```jsx
<ActionCard status="borrowed">
  <Title>🔵 You currently have this item</Title>
  <ReturnInfo>
    • Return by: {returnDate}
    • Days remaining: {daysLeft}
    • Location: Equipment Lending Office
  </ReturnInfo>
  <ProgressBar value={daysLeft} total={borrowDuration} />
  <Actions>
    <Button>Request Extension</Button>
    <Button>Mark as Returned</Button>
  </Actions>
</ActionCard>
```

**For "Late_Return" Status:**
```jsx
<ActionCard status="late" urgent>
  <Title>⚠️ URGENT: Item Overdue</Title>
  <Warning>
    • Overdue by: {overdueDays} days
    • Please return immediately
    • Late fees may apply
    • Contact: admin@example.com
  </Warning>
  <Actions>
    <Button priority>Mark as Returned</Button>
    <Button>Contact Admin</Button>
  </Actions>
</ActionCard>
```

#### 3.2 Notification System Integration
```javascript
// Show notifications for:
- Request approved → "Your request has been approved! Pick up by [date]"
- Request rejected → "Request denied: [reason]"
- Pickup deadline approaching → "Pick up your item in 2 days"
- Return deadline approaching → "Return item in 3 days"
- Item overdue → "URGENT: Item is overdue by X days"
```

**Implementation:**
- Create `ActionCard` component with status variants
- Add deadline calculation utilities
- Integrate with existing alert system
- Add pickup/return confirmation modals

---

### **Phase 4: Request Management Features**
**Priority: MEDIUM** | **Estimated: 2-3 hours**

#### 4.1 Enhanced My Requests View

```jsx
// Tabbed interface for better organization:
┌─────────────────────────────────────────────────────┐
│  Active (3)  │  History (12)  │  Cancelled (2)     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Active requests with action buttons]             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Active Tab:**
- Pending requests
- Approved (awaiting pickup)
- Borrowed (currently using)
- Late returns

**History Tab:**
- Returned items
- Rejected requests
- Expired (No_Pickup)

**Cancelled Tab:**
- User-cancelled requests

#### 4.2 Request Actions
```jsx
// Available actions by status:
Pending → [Cancel Request]
Approved → [Confirm Pickup] [Cancel Request]
Borrowed → [Mark as Returned] [Request Extension]
Late_Return → [Mark as Returned] [Contact Admin]
```

#### 4.3 Request Details Modal
```jsx
// Expandable row showing:
- Full item details with image
- Request notes
- Pickup/return dates
- Status history timeline
- Admin notes/reasons
- Contact information
```

**Implementation:**
- Refactor My Requests modal with tabs
- Add action handlers for each status
- Create request detail view component
- Add status change confirmation dialogs

---

### **Phase 5: User Experience Enhancements**
**Priority: LOW** | **Estimated: 1-2 hours**

#### 5.1 Visual Improvements
```jsx
// Equipment Card Updates:
- Show "X people have this item" counter
- Display "Available: X/Y" quantity indicator
- Add estimated wait time if all borrowed
- Show recent reviews/ratings
```

#### 5.2 Smart Filtering
```jsx
// Add filters to equipment list:
- Available Now (quantity > 0)
- Available Soon (return date within 7 days)
- My Active Items
- Popular Items
- Recently Added
```

#### 5.3 Help & Guidance
```jsx
// Add contextual help:
- Tooltip on each status explaining meaning
- FAQ section in My Requests
- Process flowchart showing request lifecycle
- Contact support button
```

**Implementation:**
- Update equipment card component
- Add filter options to search bar
- Create help tooltip component
- Add request lifecycle diagram

---

## 📱 Wireframe: Enhanced My Requests Modal

```
┌──────────────────────────────────────────────────────────────┐
│  My Equipment Requests                            [X Close]  │
├──────────────────────────────────────────────────────────────┤
│  ┌───────────┬───────────┬───────────┬───────────┐          │
│  │ Active(2) │ History(5)│Cancelled(1)│ Help      │          │
│  └───────────┴───────────┴───────────┴───────────┘          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🟢 APPROVED - Action Required                        │  │
│  │ ───────────────────────────────────────────────────  │  │
│  │ Item: Garden Hoe                                     │  │
│  │ Qty: 2  │  Pickup By: Dec 10, 2025 (6 days left)     │  │
│  │                                                       │  │
│  │ 📦 What's Next:                                       │  │
│  │ • Pick up your item at the Equipment Office          │  │
│  │ • Bring valid ID and confirmation                    │  │
│  │ • Hours: Mon-Fri 8AM-5PM                             │  │
│  │                                                       │  │
│  │ [📍 Confirm Pickup] [❌ Cancel Request]              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🔵 BORROWED - Return Soon                            │  │
│  │ ───────────────────────────────────────────────────  │  │
│  │ Item: Water Pump                                     │  │
│  │ Qty: 1  │  Return By: Dec 8, 2025 (4 days left)      │  │
│  │                                                       │  │
│  │ ⏱️ Time Remaining: [▓▓▓▓▓░░░░░] 60%                 │  │
│  │                                                       │  │
│  │ [✅ Mark as Returned] [⏰ Request Extension]         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation Details

### File Structure Changes

```
client/src/Client/Services/EIC/
├── EIC.jsx (main component - needs refactor)
├── components/
│   ├── EICEquipmentCard.jsx (✅ exists)
│   ├── EICErrorState.jsx (✅ exists)
│   ├── EICLoadingState.jsx (✅ exists)
│   ├── EICPagination.jsx (✅ exists)
│   ├── EICSearchAndFilters.jsx (✅ exists)
│   ├── RequestStatusBadge.jsx (🆕 new)
│   ├── RequestTimeline.jsx (🆕 new)
│   ├── RequestActionPanel.jsx (🆕 new)
│   ├── ActionCard.jsx (🆕 new)
│   ├── MyRequestsModal.jsx (🆕 extract from EIC.jsx)
│   └── RequestDetailView.jsx (🆕 new)
├── hooks/
│   ├── useEICQueries.js (✅ exists)
│   └── useRequestActions.js (🆕 new)
├── utils/
│   ├── alertUtils.js (✅ exists)
│   ├── statusHelpers.js (🆕 new)
│   ├── dateHelpers.js (🆕 new)
│   └── validationHelpers.js (🆕 new)
└── PLAN.md (✅ this document)
```

### New Utility Functions Needed

#### `utils/statusHelpers.js`
```javascript
export const getStatusConfig = (status) => {
  // Returns { color, icon, label, description, actions }
};

export const getNextAction = (status) => {
  // Returns what user should do next
};

export const canRequestItem = (userRequests, itemId) => {
  // Check if user can request this item
};

export const getActiveRequestsForItem = (userRequests, itemId) => {
  // Get all active requests for specific item
};
```

#### `utils/dateHelpers.js`
```javascript
export const calculateDaysRemaining = (returnDate) => {
  // Calculate days until return
};

export const isOverdue = (returnDate) => {
  // Check if item is overdue
};

export const getOverdueDays = (returnDate) => {
  // Calculate overdue days
};

export const formatDeadline = (date) => {
  // Format date for display
};
```

#### `utils/validationHelpers.js`
```javascript
export const validateDuplicateRequest = (userRequests, itemId) => {
  // Check for duplicate active requests
};

export const canCancelRequest = (request) => {
  // Determine if request can be cancelled
};

export const canConfirmPickup = (request) => {
  // Determine if pickup can be confirmed
};
```

---

## 🚀 Implementation Priority

### **Sprint 1 (Week 1): Critical Fixes**
1. ✅ Duplicate request prevention
2. ✅ Enhanced status display with badges
3. ✅ Basic action guidance for approved/borrowed

### **Sprint 2 (Week 2): User Experience**
4. ✅ Request timeline component
5. ✅ Action cards with instructions
6. ✅ My Requests modal refactor with tabs

### **Sprint 3 (Week 3): Advanced Features**
7. ✅ Request management actions (cancel, confirm pickup, etc.)
8. ✅ Notification integration
9. ✅ Help & guidance content

### **Sprint 4 (Week 4): Polish & Testing**
10. ✅ Visual enhancements
11. ✅ Smart filtering
12. ✅ End-to-end testing

---

## 📋 Testing Checklist

### Functional Testing
- [ ] User cannot request same item twice when pending
- [ ] User cannot request item already borrowed
- [ ] Status badges display correctly for all statuses
- [ ] Action buttons appear only for valid statuses
- [ ] Duplicate request validation works
- [ ] Cancel request functionality works
- [ ] Pickup confirmation works
- [ ] Return marking works
- [ ] Extension request works

### User Experience Testing
- [ ] Status meanings are clear to users
- [ ] Next actions are obvious
- [ ] Deadlines are prominent
- [ ] Error messages are helpful
- [ ] Loading states are smooth
- [ ] Modal interactions are intuitive
- [ ] Mobile responsiveness works

### Edge Cases
- [ ] Multiple simultaneous requests
- [ ] Request while item quantity = 0
- [ ] Request after previous rejection
- [ ] Request with past dates
- [ ] Overdue item handling
- [ ] Network errors during submission
- [ ] Session expiration during action

---

## 🎯 Success Metrics

### User Satisfaction
- ✅ Users understand request status without asking admin
- ✅ Users know what to do next for each status
- ✅ Duplicate requests eliminated
- ✅ Pickup/return compliance increases

### System Efficiency
- ✅ Reduced admin inquiries about request status
- ✅ Fewer duplicate/invalid requests
- ✅ Higher on-time return rate
- ✅ Better equipment utilization

### Technical Quality
- ✅ Code maintainability improved
- ✅ Component reusability high
- ✅ Error handling comprehensive
- ✅ Performance optimized

---

## 📦 Detailed Module Breakdown

### **CLIENT-SIDE MODULES TO UPDATE**

#### **1. Main Component** 
**File:** `client/src/Client/Services/EIC/EIC.jsx`  
**Current Lines:** 1179  
**Changes Required:** MAJOR REFACTOR

**Issues:**
- ❌ Monolithic component (1179 lines)
- ❌ Request modal embedded in main file
- ❌ No pre-request validation checks
- ❌ Missing request_note input field
- ❌ No system settings integration
- ❌ No pickup slot availability check
- ❌ No duplicate request prevention UI
- ❌ No active request counter display

**Updates Needed:**
```javascript
// Add state for system settings
const [systemSettings, setSystemSettings] = useState(null);
const [pickupSlotInfo, setPickupSlotInfo] = useState(null);

// Add validation before opening modal
const handleRequestClick = async (item) => {
  // 1. Check user active requests count
  const activeCount = userRequests.filter(r => 
    ['Pending', 'Approved'].includes(r.status)
  ).length;
  
  if (activeCount >= systemSettings?.eic_max_simultaneous_borrows) {
    showErrorAlert(`Maximum ${systemSettings.eic_max_simultaneous_borrows} active requests allowed`);
    return;
  }
  
  // 2. Check duplicate for this item
  const hasActiveForItem = userRequests.some(r => 
    r.itemId === item.id && ['Pending', 'Approved'].includes(r.status)
  );
  
  if (hasActiveForItem) {
    showErrorAlert('You already have an active request for this item');
    return;
  }
  
  // 3. Check cooldown period
  const recentReturn = userRequests
    .filter(r => r.status === 'Returned')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  
  if (recentReturn && systemSettings?.eic_cooldown_days) {
    const daysSinceReturn = calculateDaysSince(recentReturn.updatedAt);
    if (daysSinceReturn < systemSettings.eic_cooldown_days) {
      const daysRemaining = systemSettings.eic_cooldown_days - daysSinceReturn;
      showErrorAlert(`Please wait ${daysRemaining} more day(s) before making a new request`);
      return;
    }
  }
  
  // All validations passed, open modal
  setSelectedItem(item);
  setModalOpen(true);
};

// Add request_note to form data
const [requestData, setRequestData] = useState({
  pickupDate: '',
  returnDate: '',
  request_note: '', // NEW FIELD
  quantity: 1,
});

// Enhanced validation
const validateForm = () => {
  // ... existing validations
  
  // Add max_quantity_per_request check
  if (selectedItem.max_quantity_per_request && 
      requestData.quantity > selectedItem.max_quantity_per_request) {
    errors.quantity = `Maximum ${selectedItem.max_quantity_per_request} units per request`;
  }
  
  // Add global limit check
  if (systemSettings?.eic_max_quantity_per_request &&
      requestData.quantity > systemSettings.eic_max_quantity_per_request) {
    errors.quantity = `Maximum ${systemSettings.eic_max_quantity_per_request} units allowed globally`;
  }
  
  // Add date_limit check
  if (selectedItem.date_limit) {
    const borrowDays = calculateDays(requestData.pickupDate, requestData.returnDate);
    if (borrowDays > selectedItem.date_limit) {
      errors.returnDate = `Maximum ${selectedItem.date_limit} days borrowing period`;
    }
  }
  
  // Add weekend check
  if (!systemSettings?.allow_weekend_pickups) {
    const pickupDay = new Date(requestData.pickupDate).getDay();
    if (pickupDay === 0 || pickupDay === 6) {
      errors.pickupDate = 'Weekend pickups are not allowed';
    }
  }
  
  // Add advance booking check
  if (systemSettings?.max_advance_booking_days) {
    const daysInAdvance = calculateDaysBetween(new Date(), requestData.pickupDate);
    if (daysInAdvance > systemSettings.max_advance_booking_days) {
      errors.pickupDate = `Can only book ${systemSettings.max_advance_booking_days} days in advance`;
    }
  }
  
  return errors;
};
```

**Extraction Plan:**
- Extract request modal to separate component
- Extract equipment card to reusable component (already done)
- Extract validation logic to utility functions

---

#### **2. Equipment Card Component**
**File:** `client/src/Client/Services/EIC/components/EICEquipmentCard.jsx`  
**Status:** ✅ EXISTS  
**Changes Required:** MODERATE

**Updates Needed:**
```jsx
// Add restrictions display
<EICEquipmentCard item={item}>
  {/* Add restriction badges */}
  <div className="flex gap-2 flex-wrap mt-2">
    {item.max_quantity_per_request && (
      <Badge color="blue" icon="fa-hashtag">
        Max {item.max_quantity_per_request} per request
      </Badge>
    )}
    {item.date_limit && (
      <Badge color="green" icon="fa-calendar-days">
        Max {item.date_limit} days
      </Badge>
    )}
    <Badge color="gray" icon="fa-cubes">
      {item.quantity} available
    </Badge>
  </div>
  
  {/* Disable request button if user has active request */}
  <RequestButton
    disabled={hasActiveRequest || hasActiveForItem}
    tooltip={
      hasActiveForItem 
        ? 'You already have an active request for this item'
        : hasActiveRequest
        ? `You have ${activeCount}/${maxSimultaneous} active requests`
        : undefined
    }
  >
    {hasActiveForItem ? 'Already Requested' : 'Request Item'}
  </RequestButton>
</EICEquipmentCard>
```

---

#### **3. Request Modal Component** 
**File:** `client/src/Client/Services/EIC/components/RequestModal.jsx` (🆕 NEW)  
**Extracted From:** EIC.jsx  
**Changes Required:** CREATE NEW + ENHANCE

**New Component Structure:**
```jsx
export default function RequestModal({ 
  item, 
  open, 
  onClose, 
  onSubmit,
  userRequests,
  systemSettings 
}) {
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    request_note: '', // NEW
    quantity: 1,
  });
  
  const [pickupSlots, setPickupSlots] = useState(null);
  
  // Check pickup slots when date changes
  const handlePickupDateChange = async (date) => {
    const response = await fetch(`/api/eic/pickup-slots/${date}`);
    const slots = await response.json();
    setPickupSlots(slots);
    setFormData(prev => ({ ...prev, pickupDate: date }));
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        {/* Quantity Input */}
        <QuantityInput
          value={formData.quantity}
          max={Math.min(
            item.quantity,
            item.max_quantity_per_request || systemSettings.eic_max_quantity_per_request
          )}
          label={`Quantity (max ${item.max_quantity_per_request || systemSettings.eic_max_quantity_per_request})`}
        />
        
        {/* Pickup Date with Slots */}
        <DateInput
          value={formData.pickupDate}
          onChange={handlePickupDateChange}
          disableWeekends={!systemSettings.allow_weekend_pickups}
          maxAdvanceDays={systemSettings.max_advance_booking_days}
        />
        {pickupSlots && (
          <SlotIndicator
            available={pickupSlots.available}
            total={pickupSlots.total}
          />
        )}
        
        {/* Return Date with Limit */}
        <DateInput
          value={formData.returnDate}
          minDate={addDays(formData.pickupDate, 1)}
          maxDate={item.date_limit 
            ? addDays(formData.pickupDate, item.date_limit)
            : addDays(formData.pickupDate, 365)
          }
          helperText={item.date_limit && `Max ${item.date_limit} days`}
        />
        
        {/* Request Note (NEW) */}
        <TextArea
          name="request_note"
          label="Request Note (Optional)"
          value={formData.request_note}
          onChange={handleChange}
          placeholder="Any special requests or notes for the admin..."
          maxLength={500}
          rows={3}
        />
        
        {/* Borrow Period Display */}
        {formData.pickupDate && formData.returnDate && (
          <BorrowPeriodCard>
            <span>Borrowing Period: {calculateDays(formData.pickupDate, formData.returnDate)} days</span>
            {item.date_limit && (
              <span className="text-gray-500">(Maximum: {item.date_limit} days)</span>
            )}
          </BorrowPeriodCard>
        )}
        
        <SubmitButton>Submit Request</SubmitButton>
      </Form>
    </Modal>
  );
}
```

---

#### **4. My Requests Modal Component**
**File:** `client/src/Client/Services/EIC/components/MyRequestsModal.jsx` (🆕 NEW)  
**Extracted From:** EIC.jsx (lines 875-1179)  
**Changes Required:** MAJOR REFACTOR + ENHANCE

**Current Issues:**
- ❌ No tabbed interface (Active/History/Cancelled)
- ❌ No status-specific action cards
- ❌ No timeline visualization
- ❌ No next-step guidance
- ❌ Limited action buttons
- ❌ No request detail expansion

**New Component Structure:**
```jsx
export default function MyRequestsModal({ open, onClose, requests, onRefresh }) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const categorizedRequests = {
    active: requests.filter(r => ['Pending', 'Approved'].includes(r.status)),
    history: requests.filter(r => ['Returned'].includes(r.status)),
    cancelled: requests.filter(r => ['Cancelled', 'Rejected', 'No_Pickup'].includes(r.status)),
  };
  
  return (
    <Modal open={open} onClose={onClose} size="xl">
      {/* Tabs */}
      <TabBar>
        <Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
          Active ({categorizedRequests.active.length})
        </Tab>
        <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          History ({categorizedRequests.history.length})
        </Tab>
        <Tab active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')}>
          Cancelled ({categorizedRequests.cancelled.length})
        </Tab>
      </TabBar>
      
      {/* Request List with Action Cards */}
      <RequestList>
        {categorizedRequests[activeTab].map(request => (
          <RequestCard key={request.id} request={request}>
            <RequestStatusBadge status={request.status} />
            <RequestTimeline request={request} />
            <RequestActionPanel 
              request={request}
              onAction={handleAction}
            />
          </RequestCard>
        ))}
      </RequestList>
      
      {/* Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </Modal>
  );
}
```

---

#### **5. New Components to Create**

##### **5.1 RequestStatusBadge.jsx** (🆕)
```jsx
export default function RequestStatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <Badge color={config.color} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
```

##### **5.2 RequestTimeline.jsx** (🆕)
```jsx
export default function RequestTimeline({ request }) {
  const steps = getTimelineSteps(request.status);
  return (
    <Timeline>
      {steps.map((step, idx) => (
        <TimelineStep
          key={idx}
          completed={step.completed}
          active={step.active}
          icon={step.icon}
          label={step.label}
          date={step.date}
        />
      ))}
    </Timeline>
  );
}
```

##### **5.3 RequestActionPanel.jsx** (🆕)
```jsx
export default function RequestActionPanel({ request, onAction }) {
  const actions = getAvailableActions(request.status);
  const guidance = getNextStepGuidance(request);
  
  return (
    <ActionPanel>
      <GuidanceSection>
        <Title>{guidance.title}</Title>
        <Instructions>{guidance.instructions}</Instructions>
        {guidance.deadline && (
          <Deadline urgent={guidance.isUrgent}>
            {guidance.deadline}
          </Deadline>
        )}
      </GuidanceSection>
      
      <ActionButtons>
        {actions.map(action => (
          <Button
            key={action.type}
            variant={action.variant}
            onClick={() => onAction(action.type, request.id)}
          >
            {action.label}
          </Button>
        ))}
      </ActionButtons>
    </ActionPanel>
  );
}
```

##### **5.4 PickupSlotsIndicator.jsx** (🆕)
```jsx
export default function PickupSlotsIndicator({ available, total, date }) {
  const percentage = (available / total) * 100;
  const isFull = available === 0;
  const isLow = available <= 2;
  
  return (
    <Card className={isFull ? 'bg-red-50' : isLow ? 'bg-yellow-50' : 'bg-green-50'}>
      <Icon className={isFull ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-green-600'}>
        <i className="fa-solid fa-calendar-check"></i>
      </Icon>
      <div>
        <p className="font-semibold">
          {available} of {total} pickup slots available
        </p>
        <p className="text-sm text-gray-600">
          for {formatDate(date)}
        </p>
      </div>
      <ProgressBar value={percentage} />
    </Card>
  );
}
```

##### **5.5 ActiveRequestCounter.jsx** (🆕)
```jsx
export default function ActiveRequestCounter({ count, limit }) {
  const isNearLimit = count >= limit - 1;
  const isAtLimit = count >= limit;
  
  return (
    <Badge 
      color={isAtLimit ? 'red' : isNearLimit ? 'yellow' : 'green'}
      size="lg"
    >
      <i className="fa-solid fa-list-check mr-2"></i>
      Active Requests: {count}/{limit}
    </Badge>
  );
}
```

---

### **SERVER-SIDE MODULES TO UPDATE/CREATE**

#### **1. New Controller**
**File:** `server/Controller/EIC/settings/getSettings.js` (🆕)
```javascript
// GET /api/eic/settings
export default async function getSettings(req, res) {
  const settings = {
    eic_max_simultaneous_borrows: await getSetting('eic_max_simultaneous_borrows', 3),
    eic_max_quantity_per_request: await getSetting('eic_max_quantity_per_request', 5),
    eic_cooldown_days: await getSetting('eic_cooldown_days', 7),
    allow_weekend_pickups: await getSetting('allow_weekend_pickups', false),
    max_advance_booking_days: await getSetting('max_advance_booking_days', 30),
    eic_max_pickups_per_day: await getSetting('eic_max_pickups_per_day', 10),
  };
  
  res.json({ success: true, settings });
}
```

#### **2. New Controller**
**File:** `server/Controller/EIC/request/getPickupSlots.js` (🆕)
```javascript
// GET /api/eic/pickup-slots/:date
export default async function getPickupSlots(req, res) {
  const { date } = req.params;
  const selectedDate = new Date(date);
  
  const dailyLimit = await getSetting('eic_max_pickups_per_day', 10);
  
  const existingCount = await prisma.itemTransaction.count({
    where: {
      pickupDate: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      },
      status: { in: ['Pending', 'Approved'] }
    }
  });
  
  res.json({
    available: dailyLimit - existingCount,
    total: dailyLimit,
    date: date,
  });
}
```

#### **3. Update Existing**
**File:** `server/Controller/EIC/request/addRequest.js`  
**Changes:** ✅ ALREADY COMPLETE
- Has all validations
- Checks max_quantity_per_request
- Validates date_limit
- Prevents duplicates
- Stores request_note

---

### **UTILITY MODULES TO CREATE**

#### **1. Status Helpers**
**File:** `client/src/Client/Services/EIC/utils/statusHelpers.js` (🆕)
```javascript
export const getStatusConfig = (status) => {
  const configs = {
    Pending: { color: 'yellow', icon: 'fa-clock', label: 'Pending' },
    Approved: { color: 'green', icon: 'fa-check-circle', label: 'Approved' },
    Rejected: { color: 'red', icon: 'fa-times-circle', label: 'Rejected' },
    // ... etc
  };
  return configs[status];
};

export const getNextStepGuidance = (request) => {
  // Returns guidance object with title, instructions, deadline
};

export const getAvailableActions = (status) => {
  // Returns array of available actions for status
};

export const canRequestItem = (userRequests, itemId, systemSettings) => {
  // Returns { can: boolean, reason: string }
};
```

#### **2. Validation Helpers**
**File:** `client/src/Client/Services/EIC/utils/validationHelpers.js` (🆕)
```javascript
export const validateQuantity = (quantity, item, systemSettings) => {
  // Check against item limit and global limit
};

export const validateDates = (pickupDate, returnDate, item, systemSettings) => {
  // Check past dates, weekends, advance booking, date_limit
};

export const validateDuplicateRequest = (userRequests, itemId) => {
  // Check for active requests for this item
};

export const checkCooldownPeriod = (userRequests, systemSettings) => {
  // Check if user is in cooldown period
};
```

#### **3. Date Helpers**
**File:** `client/src/Client/Services/EIC/utils/dateHelpers.js` (🆕)
```javascript
export const calculateDaysBetween = (date1, date2) => { };
export const isWeekend = (date) => { };
export const addBusinessDays = (date, days) => { };
export const formatDeadline = (date) => { };
export const getDaysRemaining = (date) => { };
export const isOverdue = (date) => { };
```

---

## 🗂️ Complete File Structure

```
client/src/Client/Services/EIC/
├── EIC.jsx (REFACTOR - remove modal, add validations)
├── PLAN.md (✅ this document)
├── components/
│   ├── EICEquipmentCard.jsx (UPDATE - add restrictions)

| Admin Feature | Client Equivalent | Status |
|---------------|------------------|--------|
| View all requests | View my requests | ✅ Exists |
| Filter by status | Filter my requests | 🆕 Add tabs |
| Approve/Reject | See approval status | ✅ Exists |
| Mark as picked up | Confirm pickup | 🆕 Needed |
| Mark as returned | Confirm return | 🆕 Needed |
| Due tracking | Return reminders | 🆕 Needed |
| Status reasons | View rejection reason | 🆕 Needed |
| Archive view | Request history | 🆕 Needed |
| Bulk actions | N/A | ❌ Not needed |
| Statistics | N/A | ❌ Not needed |

---

## 🔒 Complete Business Rules & Restrictions

### **Server-Side Restrictions (Already Implemented)**

#### 1. **Item Stack Restrictions**
```javascript
ItemStack Schema Fields:
- date_limit: Int? // Max borrowing days (e.g., 7, 14, 30)
- max_quantity_per_request: Int? // Max units per request (e.g., 4)
- quantity: Int // Total available units
```

**Validations:**
- ✅ `quantity > itemStack.quantity` → "Only X units available"
- ✅ `quantity > max_quantity_per_request` → "Maximum Y units per request"
- ✅ `borrowDays > date_limit` → "Maximum borrowing period is Z days"

#### 2. **System Settings Restrictions**
```javascript
System Settings (from systemSettingsService):
- eic_max_simultaneous_borrows: 3 // Max active requests per user
- eic_max_quantity_per_request: 5 // Global quantity limit
- eic_cooldown_days: 7 // Days to wait after return
- allow_weekend_pickups: false // Weekend pickup allowed?
- max_advance_booking_days: 30 // How far in advance to book
- eic_max_pickups_per_day: 10 // Daily pickup slot limit
```

**Middleware Validations:**
- ✅ `checkBorrowLimit` → Validates simultaneous borrows, quantity, cooldown
- ✅ `checkDailyPickupLimit` → Validates pickup schedule, weekends, advance booking

#### 3. **Request-Level Restrictions**
```javascript
Request Validations (addRequest.js):
- ✅ item_id, pickupDate, quantity are required
- ✅ quantity >= 1
- ✅ pickupDate cannot be in the past
- ✅ returnDate must be after pickupDate
- ✅ Admin/Super_Admin cannot borrow items
- ✅ No duplicate pending requests for same item
- ✅ Quantity doesn't exceed item's max_quantity_per_request
- ✅ Borrow period doesn't exceed item's date_limit
```

### **Client-Side Missing Validations** ⚠️

#### 1. **Missing Input Validations**
- ❌ No check for `max_quantity_per_request` before submission
- ❌ No visual indicator showing per-request limit on equipment card
- ❌ No validation for simultaneous borrow limit before request
- ❌ No cooldown period display after return
- ❌ No weekend pickup restriction UI feedback
- ❌ No advance booking limit indicator
- ❌ No daily pickup slot availability display

#### 2. **Missing User Feedback**
- ❌ Request note (request_note) field exists in backend but not in client form
- ❌ No pickup slot availability counter ("X of Y slots available for this date")
- ❌ No "You have X active requests (limit: Y)" display
- ❌ No cooldown timer ("Wait X more days before requesting")
- ❌ No item-specific restriction display (date_limit, max_quantity_per_request)

#### 3. **Missing Duplicate Prevention UI**
- ❌ Equipment card doesn't disable if user has pending/approved request
- ❌ No "Already Requested" badge on cards
- ❌ No "Currently Borrowed" indicator
- ❌ Can click request button even with active request (relies on backend error)

### **Required Client Updates**

#### **Phase 0: Pre-Request Validation (NEW - CRITICAL)**
**Priority: HIGHEST** | **Estimated: 3-4 hours**

##### 0.1 Fetch and Display Item Restrictions
```jsx
// Equipment Card Enhancement
<EICEquipmentCard item={item}>
  <RestrictionsPanel>
    {item.max_quantity_per_request && (
      <Badge>Max {item.max_quantity_per_request} per request</Badge>
    )}
    {item.date_limit && (
      <Badge>Max {item.date_limit} days borrow</Badge>
    )}
    <Badge>{item.quantity} available</Badge>
  </RestrictionsPanel>
</EICEquipmentCard>
```

##### 0.2 Check User Active Requests Before Showing Modal
```javascript
// Before opening request modal:
const activeRequests = userRequests.filter(r => 
  ['Pending', 'Approved'].includes(r.status)
);

const maxSimultaneous = 3; // Fetch from settings API
const hasActiveForItem = activeRequests.some(r => r.itemId === item.id);

if (activeRequests.length >= maxSimultaneous) {
  showErrorAlert(`You have reached the maximum of ${maxSimultaneous} active requests`);
  return;
}

if (hasActiveForItem) {
  showErrorAlert('You already have an active request for this item');
  return;
}
```

##### 0.3 Enhanced Request Form with All Validations
```jsx
<RequestModal item={selectedItem}>
  {/* Quantity with item-specific limit */}
  <QuantityInput
    max={Math.min(
      selectedItem.quantity, 
      selectedItem.max_quantity_per_request || 999
    )}
    label={`Quantity (max ${selectedItem.max_quantity_per_request || selectedItem.quantity} per request)`}
  />
  
  {/* Pickup Date with slots availability */}
  <PickupDateInput
    minDate={tomorrow}
    maxDate={addDays(new Date(), 30)} // max_advance_booking_days
    disableWeekends={!allowWeekendPickups}
    onDateChange={checkPickupSlots}
  />
  <PickupSlotsIndicator slots={availableSlots} total={totalSlots} />
  
  {/* Return Date with item date_limit */}
  <ReturnDateInput
    minDate={addDays(pickupDate, 1)}
    maxDate={addDays(pickupDate, selectedItem.date_limit || 365)}
    helperText={`Maximum ${selectedItem.date_limit || 'unlimited'} days`}
  />
  
  {/* Request Note (MISSING INPUT) */}
  <TextArea
    name="request_note"
    label="Request Note (Optional)"
    placeholder="Any special requests or notes..."
    maxLength={500}
  />
  
  {/* Borrow Period Calculator */}
  <BorrowPeriodDisplay>
    Borrowing for {calculateDays(pickupDate, returnDate)} days
    {selectedItem.date_limit && (
      <span>(Max: {selectedItem.date_limit} days)</span>
    )}
  </BorrowPeriodDisplay>
</RequestModal>
```

##### 0.4 System Settings API Integration
```javascript
// NEW: Fetch system settings for client validation
const { data: systemSettings } = useQuery({
  queryKey: ['eicSettings'],
  queryFn: async () => {
    const response = await fetch('/api/eic/settings');
    return response.json();
  }
});

// Use in validations:
- max_simultaneous_borrows
- max_quantity_per_request (global)
- cooldown_days
- allow_weekend_pickups
- max_advance_booking_days
- max_pickups_per_day
```

### **API Endpoints Needed**

#### Existing Endpoints
- ✅ `GET /api/eic/request/me` (get user requests)
- ✅ `POST /api/eic/request` (submit request)
- ✅ `POST /api/eic/request/cancel` (cancel request)
- ✅ `GET /api/eic/stacks` (get equipment list)

#### New Endpoints Required
- 🆕 `GET /api/eic/settings` - Get system settings for client validation
- 🆕 `GET /api/eic/pickup-slots/:date` - Check available pickup slots for date
- 🆕 `POST /api/eic/request/confirm-pickup/:id` - User confirms pickup
- 🆕 `POST /api/eic/request/confirm-return/:id` - User confirms return
- 🆕 `POST /api/eic/request/extend/:id` - Request extension
- 🆕 `GET /api/eic/request/can-request/:itemId` - Check if user can request item

### **Modified Business Rules**

#### 1. **Request Limits**
- ✅ Max X pending/approved requests per user (from system settings)
- ✅ Max 1 active request per specific item
- ✅ Max Y quantity per request (item-specific OR global limit)
- ✅ Can request again after return or rejection
- ✅ Cooldown period after return (from system settings)

#### 2. **Pickup Deadlines**
- ✅ Auto-expire approved requests if not picked up within X days
- ✅ Send reminders before expiration
- ✅ Check daily pickup limit for selected date
- ✅ Respect weekend restrictions
- ✅ Validate advance booking limit

#### 3. **Return Deadlines**
- ✅ Calculate return date based on pickup + item's date_limit
- ✅ Send reminders 3 days, 1 day before due
- ✅ Mark as late_return if overdue
- ✅ Display countdown timer for active borrows

#### 4. **Extension Requests**
- Allow 1 extension per request
- Extension max = original duration OR item's date_limit
- Must request before due date
- Cannot extend if already overdue

---

---

## 📦 Detailed Module Breakdown

### **CLIENT-SIDE MODULES TO UPDATE**

#### **1. Main Component** 
**File:** `client/src/Client/Services/EIC/EIC.jsx`  
**Current Lines:** 1179  
**Changes Required:** MAJOR REFACTOR

**Issues:**
- ❌ Monolithic component (1179 lines)
- ❌ Request modal embedded in main file
- ❌ No pre-request validation checks
- ❌ Missing request_note input field
- ❌ No system settings integration
- ❌ No pickup slot availability check
- ❌ No duplicate request prevention UI
- ❌ No active request counter display

**Updates Needed:**
```javascript
// Add state for system settings
const [systemSettings, setSystemSettings] = useState(null);
const [pickupSlotInfo, setPickupSlotInfo] = useState(null);

// Add validation before opening modal
const handleRequestClick = async (item) => {
  // 1. Check user active requests count
  const activeCount = userRequests.filter(r => 
    ['Pending', 'Approved'].includes(r.status)
  ).length;
  
  if (activeCount >= systemSettings?.eic_max_simultaneous_borrows) {
    showErrorAlert(`Maximum ${systemSettings.eic_max_simultaneous_borrows} active requests allowed`);
    return;
  }
  
  // 2. Check duplicate for this item
  const hasActiveForItem = userRequests.some(r => 
    r.itemId === item.id && ['Pending', 'Approved'].includes(r.status)
  );
  
  if (hasActiveForItem) {
    showErrorAlert('You already have an active request for this item');
    return;
  }
  
  // 3. Check cooldown period
  const recentReturn = userRequests
    .filter(r => r.status === 'Returned')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  
  if (recentReturn && systemSettings?.eic_cooldown_days) {
    const daysSinceReturn = calculateDaysSince(recentReturn.updatedAt);
    if (daysSinceReturn < systemSettings.eic_cooldown_days) {
      const daysRemaining = systemSettings.eic_cooldown_days - daysSinceReturn;
      showErrorAlert(`Please wait ${daysRemaining} more day(s) before making a new request`);
      return;
    }
  }
  
  // All validations passed, open modal
  setSelectedItem(item);
  setModalOpen(true);
};

// Add request_note to form data
const [requestData, setRequestData] = useState({
  pickupDate: '',
  returnDate: '',
  request_note: '', // NEW FIELD
  quantity: 1,
});

// Enhanced validation
const validateForm = () => {
  // ... existing validations
  
  // Add max_quantity_per_request check
  if (selectedItem.max_quantity_per_request && 
      requestData.quantity > selectedItem.max_quantity_per_request) {
    errors.quantity = `Maximum ${selectedItem.max_quantity_per_request} units per request`;
  }
  
  // Add global limit check
  if (systemSettings?.eic_max_quantity_per_request &&
      requestData.quantity > systemSettings.eic_max_quantity_per_request) {
    errors.quantity = `Maximum ${systemSettings.eic_max_quantity_per_request} units allowed globally`;
  }
  
  // Add date_limit check
  if (selectedItem.date_limit) {
    const borrowDays = calculateDays(requestData.pickupDate, requestData.returnDate);
    if (borrowDays > selectedItem.date_limit) {
      errors.returnDate = `Maximum ${selectedItem.date_limit} days borrowing period`;
    }
  }
  
  // Add weekend check
  if (!systemSettings?.allow_weekend_pickups) {
    const pickupDay = new Date(requestData.pickupDate).getDay();
    if (pickupDay === 0 || pickupDay === 6) {
      errors.pickupDate = 'Weekend pickups are not allowed';
    }
  }
  
  // Add advance booking check
  if (systemSettings?.max_advance_booking_days) {
    const daysInAdvance = calculateDaysBetween(new Date(), requestData.pickupDate);
    if (daysInAdvance > systemSettings.max_advance_booking_days) {
      errors.pickupDate = `Can only book ${systemSettings.max_advance_booking_days} days in advance`;
    }
  }
  
  return errors;
};
```

**Extraction Plan:**
- Extract request modal to separate component
- Extract equipment card to reusable component (already done)
- Extract validation logic to utility functions

---

#### **2. Equipment Card Component**
**File:** `client/src/Client/Services/EIC/components/EICEquipmentCard.jsx`  
**Status:** ✅ EXISTS  
**Changes Required:** MODERATE

**Updates Needed:**
```jsx
// Add restrictions display
<EICEquipmentCard item={item}>
  {/* Add restriction badges */}
  <div className="flex gap-2 flex-wrap mt-2">
    {item.max_quantity_per_request && (
      <Badge color="blue" icon="fa-hashtag">
        Max {item.max_quantity_per_request} per request
      </Badge>
    )}
    {item.date_limit && (
      <Badge color="green" icon="fa-calendar-days">
        Max {item.date_limit} days
      </Badge>
    )}
    <Badge color="gray" icon="fa-cubes">
      {item.quantity} available
    </Badge>
  </div>
  
  {/* Disable request button if user has active request */}
  <RequestButton
    disabled={hasActiveRequest || hasActiveForItem}
    tooltip={
      hasActiveForItem 
        ? 'You already have an active request for this item'
        : hasActiveRequest
        ? `You have ${activeCount}/${maxSimultaneous} active requests`
        : undefined
    }
  >
    {hasActiveForItem ? 'Already Requested' : 'Request Item'}
  </RequestButton>
</EICEquipmentCard>
```

---

#### **3. Request Modal Component** 
**File:** `client/src/Client/Services/EIC/components/RequestModal.jsx` (🆕 NEW)  
**Extracted From:** EIC.jsx  
**Changes Required:** CREATE NEW + ENHANCE

**New Component Structure:**
```jsx
export default function RequestModal({ 
  item, 
  open, 
  onClose, 
  onSubmit,
  userRequests,
  systemSettings 
}) {
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    request_note: '', // NEW
    quantity: 1,
  });
  
  const [pickupSlots, setPickupSlots] = useState(null);
  
  // Check pickup slots when date changes
  const handlePickupDateChange = async (date) => {
    const response = await fetch(`/api/eic/pickup-slots/${date}`);
    const slots = await response.json();
    setPickupSlots(slots);
    setFormData(prev => ({ ...prev, pickupDate: date }));
  };
  
  return (
    <Modal open={open} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        {/* Quantity Input */}
        <QuantityInput
          value={formData.quantity}
          max={Math.min(
            item.quantity,
            item.max_quantity_per_request || systemSettings.eic_max_quantity_per_request
          )}
          label={`Quantity (max ${item.max_quantity_per_request || systemSettings.eic_max_quantity_per_request})`}
        />
        
        {/* Pickup Date with Slots */}
        <DateInput
          value={formData.pickupDate}
          onChange={handlePickupDateChange}
          disableWeekends={!systemSettings.allow_weekend_pickups}
          maxAdvanceDays={systemSettings.max_advance_booking_days}
        />
        {pickupSlots && (
          <SlotIndicator
            available={pickupSlots.available}
            total={pickupSlots.total}
          />
        )}
        
        {/* Return Date with Limit */}
        <DateInput
          value={formData.returnDate}
          minDate={addDays(formData.pickupDate, 1)}
          maxDate={item.date_limit 
            ? addDays(formData.pickupDate, item.date_limit)
            : addDays(formData.pickupDate, 365)
          }
          helperText={item.date_limit && `Max ${item.date_limit} days`}
        />
        
        {/* Request Note (NEW) */}
        <TextArea
          name="request_note"
          label="Request Note (Optional)"
          value={formData.request_note}
          onChange={handleChange}
          placeholder="Any special requests or notes for the admin..."
          maxLength={500}
          rows={3}
        />
        
        {/* Borrow Period Display */}
        {formData.pickupDate && formData.returnDate && (
          <BorrowPeriodCard>
            <span>Borrowing Period: {calculateDays(formData.pickupDate, formData.returnDate)} days</span>
            {item.date_limit && (
              <span className="text-gray-500">(Maximum: {item.date_limit} days)</span>
            )}
          </BorrowPeriodCard>
        )}
        
        <SubmitButton>Submit Request</SubmitButton>
      </Form>
    </Modal>
  );
}
```

---

#### **4. My Requests Modal Component**
**File:** `client/src/Client/Services/EIC/components/MyRequestsModal.jsx` (🆕 NEW)  
**Extracted From:** EIC.jsx (lines 875-1179)  
**Changes Required:** MAJOR REFACTOR + ENHANCE

**Current Issues:**
- ❌ No tabbed interface (Active/History/Cancelled)
- ❌ No status-specific action cards
- ❌ No timeline visualization
- ❌ No next-step guidance
- ❌ Limited action buttons
- ❌ No request detail expansion

**New Component Structure:**
```jsx
export default function MyRequestsModal({ open, onClose, requests, onRefresh }) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const categorizedRequests = {
    active: requests.filter(r => ['Pending', 'Approved'].includes(r.status)),
    history: requests.filter(r => ['Returned'].includes(r.status)),
    cancelled: requests.filter(r => ['Cancelled', 'Rejected', 'No_Pickup'].includes(r.status)),
  };
  
  return (
    <Modal open={open} onClose={onClose} size="xl">
      {/* Tabs */}
      <TabBar>
        <Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
          Active ({categorizedRequests.active.length})
        </Tab>
        <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          History ({categorizedRequests.history.length})
        </Tab>
        <Tab active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')}>
          Cancelled ({categorizedRequests.cancelled.length})
        </Tab>
      </TabBar>
      
      {/* Request List with Action Cards */}
      <RequestList>
        {categorizedRequests[activeTab].map(request => (
          <RequestCard key={request.id} request={request}>
            <RequestStatusBadge status={request.status} />
            <RequestTimeline request={request} />
            <RequestActionPanel 
              request={request}
              onAction={handleAction}
            />
          </RequestCard>
        ))}
      </RequestList>
      
      {/* Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </Modal>
  );
}
```

---

#### **5. New Components to Create**

##### **5.1 RequestStatusBadge.jsx** (🆕)
```jsx
export default function RequestStatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <Badge color={config.color} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
```

##### **5.2 RequestTimeline.jsx** (🆕)
```jsx
export default function RequestTimeline({ request }) {
  const steps = getTimelineSteps(request.status);
  return (
    <Timeline>
      {steps.map((step, idx) => (
        <TimelineStep
          key={idx}
          completed={step.completed}
          active={step.active}
          icon={step.icon}
          label={step.label}
          date={step.date}
        />
      ))}
    </Timeline>
  );
}
```

##### **5.3 RequestActionPanel.jsx** (🆕)
```jsx
export default function RequestActionPanel({ request, onAction }) {
  const actions = getAvailableActions(request.status);
  const guidance = getNextStepGuidance(request);
  
  return (
    <ActionPanel>
      <GuidanceSection>
        <Title>{guidance.title}</Title>
        <Instructions>{guidance.instructions}</Instructions>
        {guidance.deadline && (
          <Deadline urgent={guidance.isUrgent}>
            {guidance.deadline}
          </Deadline>
        )}
      </GuidanceSection>
      
      <ActionButtons>
        {actions.map(action => (
          <Button
            key={action.type}
            variant={action.variant}
            onClick={() => onAction(action.type, request.id)}
          >
            {action.label}
          </Button>
        ))}
      </ActionButtons>
    </ActionPanel>
  );
}
```

##### **5.4 PickupSlotsIndicator.jsx** (🆕)
```jsx
export default function PickupSlotsIndicator({ available, total, date }) {
  const percentage = (available / total) * 100;
  const isFull = available === 0;
  const isLow = available <= 2;
  
  return (
    <Card className={isFull ? 'bg-red-50' : isLow ? 'bg-yellow-50' : 'bg-green-50'}>
      <Icon className={isFull ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-green-600'}>
        <i className="fa-solid fa-calendar-check"></i>
      </Icon>
      <div>
        <p className="font-semibold">
          {available} of {total} pickup slots available
        </p>
        <p className="text-sm text-gray-600">
          for {formatDate(date)}
        </p>
      </div>
      <ProgressBar value={percentage} />
    </Card>
  );
}
```

##### **5.5 ActiveRequestCounter.jsx** (🆕)
```jsx
export default function ActiveRequestCounter({ count, limit }) {
  const isNearLimit = count >= limit - 1;
  const isAtLimit = count >= limit;
  
  return (
    <Badge 
      color={isAtLimit ? 'red' : isNearLimit ? 'yellow' : 'green'}
      size="lg"
    >
      <i className="fa-solid fa-list-check mr-2"></i>
      Active Requests: {count}/{limit}
    </Badge>
  );
}
```

---

### **SERVER-SIDE MODULES TO UPDATE/CREATE**

#### **1. New Controller**
**File:** `server/Controller/EIC/settings/getSettings.js` (🆕)
```javascript
// GET /api/eic/settings
export default async function getSettings(req, res) {
  const settings = {
    eic_max_simultaneous_borrows: await getSetting('eic_max_simultaneous_borrows', 3),
    eic_max_quantity_per_request: await getSetting('eic_max_quantity_per_request', 5),
    eic_cooldown_days: await getSetting('eic_cooldown_days', 7),
    allow_weekend_pickups: await getSetting('allow_weekend_pickups', false),
    max_advance_booking_days: await getSetting('max_advance_booking_days', 30),
    eic_max_pickups_per_day: await getSetting('eic_max_pickups_per_day', 10),
  };
  
  res.json({ success: true, settings });
}
```

#### **2. New Controller**
**File:** `server/Controller/EIC/request/getPickupSlots.js` (🆕)
```javascript
// GET /api/eic/pickup-slots/:date
export default async function getPickupSlots(req, res) {
  const { date } = req.params;
  const selectedDate = new Date(date);
  
  const dailyLimit = await getSetting('eic_max_pickups_per_day', 10);
  
  const existingCount = await prisma.itemTransaction.count({
    where: {
      pickupDate: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      },
      status: { in: ['Pending', 'Approved'] }
    }
  });
  
  res.json({
    available: dailyLimit - existingCount,
    total: dailyLimit,
    date: date,
  });
}
```

#### **3. Update Existing**
**File:** `server/Controller/EIC/request/addRequest.js`  
**Changes:** ✅ ALREADY COMPLETE
- Has all validations
- Checks max_quantity_per_request
- Validates date_limit
- Prevents duplicates
- Stores request_note

---

### **UTILITY MODULES TO CREATE**

#### **1. Status Helpers**
**File:** `client/src/Client/Services/EIC/utils/statusHelpers.js` (🆕)
```javascript
export const getStatusConfig = (status) => {
  const configs = {
    Pending: { color: 'yellow', icon: 'fa-clock', label: 'Pending' },
    Approved: { color: 'green', icon: 'fa-check-circle', label: 'Approved' },
    Rejected: { color: 'red', icon: 'fa-times-circle', label: 'Rejected' },
    // ... etc
  };
  return configs[status];
};

export const getNextStepGuidance = (request) => {
  // Returns guidance object with title, instructions, deadline
};

export const getAvailableActions = (status) => {
  // Returns array of available actions for status
};

export const canRequestItem = (userRequests, itemId, systemSettings) => {
  // Returns { can: boolean, reason: string }
};
```

#### **2. Validation Helpers**
**File:** `client/src/Client/Services/EIC/utils/validationHelpers.js` (🆕)
```javascript
export const validateQuantity = (quantity, item, systemSettings) => {
  // Check against item limit and global limit
};

export const validateDates = (pickupDate, returnDate, item, systemSettings) => {
  // Check past dates, weekends, advance booking, date_limit
};

export const validateDuplicateRequest = (userRequests, itemId) => {
  // Check for active requests for this item
};

export const checkCooldownPeriod = (userRequests, systemSettings) => {
  // Check if user is in cooldown period
};
```

#### **3. Date Helpers**
**File:** `client/src/Client/Services/EIC/utils/dateHelpers.js` (🆕)
```javascript
export const calculateDaysBetween = (date1, date2) => { };
export const isWeekend = (date) => { };
export const addBusinessDays = (date, days) => { };
export const formatDeadline = (date) => { };
export const getDaysRemaining = (date) => { };
export const isOverdue = (date) => { };
```

---

## 🗂️ Complete File Structure

```
client/src/Client/Services/EIC/
├── EIC.jsx (REFACTOR - remove modal, add validations)
├── PLAN.md (✅ this document)
├── components/
│   ├── EICEquipmentCard.jsx (UPDATE - add restrictions)
│   ├── RequestModal.jsx (🆕 CREATE - extract from EIC.jsx)
│   ├── MyRequestsModal.jsx (🆕 CREATE - extract + enhance)
│   ├── RequestCard.jsx (🆕 CREATE)
│   ├── RequestStatusBadge.jsx (🆕 CREATE)
│   ├── RequestTimeline.jsx (🆕 CREATE)
│   ├── RequestActionPanel.jsx (🆕 CREATE)
│   ├── PickupSlotsIndicator.jsx (🆕 CREATE)
│   ├── ActiveRequestCounter.jsx (🆕 CREATE)
│   ├── RestrictionBadge.jsx (🆕 CREATE)
│   └── BorrowPeriodCard.jsx (🆕 CREATE)
├── utils/
│   ├── statusHelpers.js (🆕 CREATE)
│   ├── validationHelpers.js (🆕 CREATE)
│   ├── dateHelpers.js (🆕 CREATE)
│   └── constants.js (🆕 CREATE - status configs, colors)
└── hooks/
    ├── useSystemSettings.js (🆕 CREATE - fetch settings)
    ├── usePickupSlots.js (🆕 CREATE - fetch slots)
    └── useRequestActions.js (🆕 CREATE - handle actions)

server/
├── Controller/EIC/
│   ├── request/
│   │   ├── addRequest.js (✅ NO CHANGES NEEDED)
│   │   ├── getUserRequests.js (UPDATE - include item details)
│   │   ├── confirmPickup.js (🆕 CREATE)
│   │   ├── confirmReturn.js (🆕 CREATE)
│   │   ├── requestExtension.js (🆕 CREATE)
│   │   ├── cancelRequest.js (🆕 CREATE)
│   │   └── canRequestItem.js (🆕 CREATE)
│   ├── settings/
│   │   └── getSettings.js (🆕 CREATE)
│   └── slots/
│       └── getPickupSlots.js (🆕 CREATE)
├── Middlewares/
│   ├── checkBorrowLimit.js (✅ NO CHANGES)
│   └── checkDailyPickupLimit.js (✅ NO CHANGES)
└── Router/
    └── EIC.js (UPDATE - add new routes)
```

---

## 📊 Module Change Summary

| Module | Status | Lines Changed | Complexity | Priority |
|--------|--------|--------------|------------|----------|
| **EIC.jsx** | 🔨 REFACTOR | ~400 | HIGH | P0 |
| **RequestModal.jsx** | 🆕 CREATE | ~250 | MEDIUM | P0 |
| **MyRequestsModal.jsx** | 🆕 CREATE | ~350 | HIGH | P1 |
| **EICEquipmentCard.jsx** | ✏️ UPDATE | ~50 | LOW | P0 |
| **RequestStatusBadge.jsx** | 🆕 CREATE | ~40 | LOW | P1 |
| **RequestTimeline.jsx** | 🆕 CREATE | ~120 | MEDIUM | P1 |
| **RequestActionPanel.jsx** | 🆕 CREATE | ~200 | HIGH | P1 |
| **PickupSlotsIndicator.jsx** | 🆕 CREATE | ~60 | LOW | P0 |
| **ActiveRequestCounter.jsx** | 🆕 CREATE | ~30 | LOW | P0 |
| **statusHelpers.js** | 🆕 CREATE | ~150 | MEDIUM | P1 |
| **validationHelpers.js** | 🆕 CREATE | ~200 | HIGH | P0 |
| **dateHelpers.js** | 🆕 CREATE | ~100 | LOW | P0 |
| **useSystemSettings.js** | 🆕 CREATE | ~40 | LOW | P0 |
| **usePickupSlots.js** | 🆕 CREATE | ~50 | LOW | P0 |
| **getSettings.js** (server) | 🆕 CREATE | ~25 | LOW | P0 |
| **getPickupSlots.js** (server) | 🆕 CREATE | ~30 | LOW | P0 |
| **confirmPickup.js** (server) | 🆕 CREATE | ~40 | MEDIUM | P2 |
| **confirmReturn.js** (server) | 🆕 CREATE | ~40 | MEDIUM | P2 |
| **requestExtension.js** (server) | 🆕 CREATE | ~60 | MEDIUM | P3 |
| **cancelRequest.js** (server) | 🆕 CREATE | ~35 | LOW | P2 |
| **canRequestItem.js** (server) | 🆕 CREATE | ~80 | HIGH | P0 |

**Total:**
- 🆕 New Files: 17
- ✏️ Files to Update: 2
- ✅ No Changes: 3
- **Estimated Lines of Code:** ~2,350

---

## 🎨 Design System

### Status Colors
- 🟡 **Pending:** `bg-yellow-100 text-yellow-800 border-yellow-200`
- 🟢 **Approved:** `bg-green-100 text-green-800 border-green-200`
- 🔵 **Borrowed:** `bg-blue-100 text-blue-800 border-blue-200`
- 🔴 **Late/Rejected:** `bg-red-100 text-red-800 border-red-200`
- ⚪ **Returned/Cancelled:** `bg-gray-100 text-gray-800 border-gray-200`
- 🟠 **No_Pickup:** `bg-orange-100 text-orange-800 border-orange-200`

### Icons (FontAwesome)
- Pending: `fa-clock`
- Approved: `fa-check-circle`
- Borrowed: `fa-hand-holding`
- Late: `fa-exclamation-triangle`
- Returned: `fa-check-double`
- Rejected: `fa-times-circle`
- Cancelled: `fa-ban`
- No_Pickup: `fa-calendar-times`

---

## 📞 Support & Documentation

### User Guide Topics to Add
1. "How to request equipment"
2. "Understanding request status"
3. "What to do when request is approved"
4. "How to return equipment"
5. "What happens if I'm late"
6. "How to cancel a request"
7. "Request limits and rules"

### FAQ Section
- Why can't I request this item?
- How long does approval take?
- Can I request multiple items?
- What if I need an extension?
- What are the late fees?
- How do I contact admin?

---

## ✅ Definition of Done

A feature is considered complete when:
1. ✅ Code is written and tested
2. ✅ Component is responsive (mobile/tablet/desktop)
3. ✅ Dark mode support added
4. ✅ Error handling implemented
5. ✅ Loading states added
6. ✅ User guidance text written
7. ✅ Accessibility tested
8. ✅ Code reviewed
9. ✅ Documentation updated
10. ✅ User testing passed

---

**Document Version:** 1.0  
**Created:** December 4, 2025  
**Last Updated:** December 4, 2025  
**Author:** GitHub Copilot  
**Status:** Ready for Implementation

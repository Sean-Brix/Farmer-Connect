# Inquiry System Schema Documentation

## Overview
This comprehensive schema supports a full-featured inquiry/chat support system for FITS-Tanza, enabling both client-side inquiries and admin management capabilities.

## Core Features Supported

### 🔥 Client-Side Features (Based on UI Analysis)
- **Chat Interface**: Modal chat system with threaded conversations
- **Guest & Registered Users**: Support for both anonymous and logged-in users  
- **Inquiry Categories**: Seminar, Equipment, Account, General, Technical, Feedback, Complaint
- **Priority Levels**: Low, Medium, High, Urgent
- **Real-time Chat**: Live messaging with typing indicators
- **FAQ Integration**: Searchable FAQ with category filtering
- **Inquiry Tracking**: Users can view and continue previous inquiries
- **File Attachments**: Support for document/image uploads (future feature)

### 🎯 Admin-Side Features (Based on UI Analysis)
- **Multi-Tab Management**: Pending, In Progress, Resolved inquiries
- **Assignment System**: Assign inquiries to specific admins
- **Status Management**: Update inquiry status and priority
- **Conversation View**: Full chat history with reply functionality
- **Search & Filtering**: Advanced filtering by status, category, priority
- **FAQ Management**: Create, edit, activate/deactivate FAQs
- **Response Templates**: Pre-built responses for common issues
- **Analytics Dashboard**: Performance metrics and reporting
- **Notification System**: Real-time alerts for new inquiries/replies

## Database Schema Structure

### Core Models

#### 1. Inquiry (Main inquiry/ticket)
```prisma
model Inquiry {
  id          String      @id @default(cuid())
  subject     String      // Inquiry title
  message     String      @db.LongText // Original message
  category    InquiryCategory // GENERAL, SEMINAR, EQUIPMENT, etc.
  priority    InquiryPriority // LOW, MEDIUM, HIGH, URGENT
  status      InquiryStatus   // PENDING, IN_PROGRESS, RESOLVED, etc.
  
  // User Information (supports both registered and guest users)
  userId      String?     // For registered users
  guestName   String?     // For guest users  
  guestEmail  String?     // For guest users
  
  // Assignment & Resolution tracking
  assignedToId    String?  // Which admin is handling this
  resolvedById    String?  // Which admin resolved it
  resolvedAt      DateTime? // When it was resolved
  
  // Relations
  user            Account? // Registered user
  assignedTo      Account? // Assigned admin
  resolvedBy      Account? // Resolving admin
  replies         InquiryReply[] // All conversation messages
  attachments     InquiryAttachment[] // File uploads
  notifications   InquiryNotification[] // Related notifications
}
```

#### 2. InquiryReply (Conversation messages)
```prisma
model InquiryReply {
  id          String      @id @default(cuid())
  message     String      @db.LongText // Reply content
  isInternal  Boolean     @default(false) // Admin-only notes
  
  // Sender information
  senderId    String?     // Who sent this
  senderType  SenderType  // USER, ADMIN, SYSTEM, BOT
  senderName  String?     // Display name
  
  // Threading support (for future nested replies)
  parentReplyId String?   // Parent message
  
  // Read status tracking
  readByUser  Boolean     @default(false)
  readByAdmin Boolean     @default(false)
  readAt      DateTime?
  
  // Relations
  inquiry     Inquiry     // Parent inquiry
  sender      Account?    // Message sender
}
```

#### 3. FAQ (Knowledge base)
```prisma
model FAQ {
  id          String      @id @default(cuid())
  question    String      // FAQ question
  answer      String      @db.LongText // FAQ answer
  category    InquiryCategory // Category classification
  isActive    Boolean     @default(true) // Public visibility
  orderIndex  Int         @default(0) // Display order
  
  // Analytics
  viewCount   Int         @default(0) // Usage tracking
  helpfulCount Int        @default(0) // User feedback
  
  // Management
  createdBy   Account?    // Admin who created it
}
```

#### 4. InquiryTemplate (Response templates)
```prisma
model InquiryTemplate {
  id          String      @id @default(cuid())
  title       String      // Template name
  content     String      @db.LongText // Template content
  category    InquiryCategory // Target category
  isActive    Boolean     @default(true) // Availability
  usageCount  Int         @default(0) // Usage analytics
  
  createdBy   Account?    // Admin who created it
}
```

#### 5. InquiryNotification (Real-time notifications)
```prisma
model InquiryNotification {
  id          String      @id @default(cuid())
  type        NotificationType // NEW_INQUIRY, NEW_REPLY, etc.
  title       String      // Notification title
  message     String      // Notification content
  
  userId      String      // Target user
  inquiryId   String?     // Related inquiry
  isRead      Boolean     @default(false)
  metadata    Json?       // Additional data
  
  // Relations
  user        Account     // Target user
  inquiry     Inquiry?    // Related inquiry
}
```

#### 6. InquiryAnalytics (Performance metrics)
```prisma
model InquiryAnalytics {
  id          String      @id @default(cuid())
  date        DateTime    @db.Date // Analytics date
  
  // Volume metrics
  totalInquiries    Int   @default(0)
  pendingInquiries  Int   @default(0)
  resolvedInquiries Int   @default(0)
  
  // Performance metrics
  avgFirstResponseTime  Float? // Minutes to first response
  avgResolutionTime     Float? // Minutes to resolution
  
  // Category breakdown
  seminarInquiries    Int @default(0)
  equipmentInquiries  Int @default(0)
  accountInquiries    Int @default(0)
  generalInquiries    Int @default(0)
  
  // Priority breakdown
  lowPriorityCount    Int @default(0)
  mediumPriorityCount Int @default(0)
  highPriorityCount   Int @default(0)
  urgentPriorityCount Int @default(0)
  
  adminId     String? // Per-admin analytics
  admin       Account? // Admin performance tracking
}
```

#### 7. InquiryAttachment (File uploads)
```prisma
model InquiryAttachment {
  id          String      @id @default(cuid())
  filename    String      // Original filename
  filepath    String      // Storage path
  filesize    Int         // File size in bytes
  mimetype    String      // File type
  
  inquiryId   String      // Parent inquiry
  uploadedBy  Account?    // Who uploaded it
  
  inquiry     Inquiry     // Parent inquiry relation
}
```

## Enums

### InquiryCategory
- `GENERAL` - General inquiries
- `SEMINAR` - Seminar-related questions
- `EQUIPMENT` - Equipment requests/issues
- `ACCOUNT` - Account/authentication issues
- `TECHNICAL` - Technical support
- `FEEDBACK` - User feedback/suggestions
- `COMPLAINT` - Complaints/issues

### InquiryPriority
- `LOW` - Low priority - can wait
- `MEDIUM` - Medium priority - normal response time
- `HIGH` - High priority - faster response needed
- `URGENT` - Urgent - immediate attention required

### InquiryStatus
- `PENDING` - New inquiry, not yet assigned
- `IN_PROGRESS` - Being worked on by admin
- `WAITING_USER` - Waiting for user response
- `RESOLVED` - Issue resolved
- `CLOSED` - Inquiry closed (resolved + confirmed)
- `CANCELLED` - Cancelled by user

### SenderType
- `USER` - Regular user or guest
- `ADMIN` - Admin/moderator
- `SYSTEM` - System-generated message
- `BOT` - Chatbot response

### NotificationType
- `NEW_INQUIRY` - New inquiry created
- `NEW_REPLY` - New reply to inquiry
- `STATUS_CHANGE` - Inquiry status changed
- `ASSIGNMENT_CHANGE` - Inquiry reassigned
- `INQUIRY_RESOLVED` - Inquiry marked as resolved
- `INQUIRY_CLOSED` - Inquiry closed
- `MENTION` - Admin mentioned in reply
- `REMINDER` - Reminder for pending inquiry

## Key Schema Features

### 🔐 User Support
- **Registered Users**: Full account integration with existing Account model
- **Guest Users**: Support for anonymous inquiries with name/email
- **Admin Assignment**: Track which admin is handling each inquiry

### 📊 Analytics & Reporting
- **Performance Metrics**: Response times, resolution rates
- **Volume Tracking**: Daily/weekly/monthly inquiry counts
- **Category Analysis**: Breakdown by inquiry type
- **Admin Performance**: Individual admin statistics

### 🔔 Real-time Features
- **Notifications**: System-wide notification support
- **Read Status**: Track message read status for both users and admins
- **Threading**: Support for nested replies (future feature)

### 🗂️ Content Management
- **FAQ System**: Full CRUD operations with analytics
- **Templates**: Pre-built response templates
- **File Attachments**: Support for document/image uploads

### 🔍 Search & Filtering
- **Indexed Fields**: Optimized queries for status, category, priority
- **Date Indexing**: Efficient time-based queries
- **User Indexing**: Fast user-specific inquiry retrieval

## Integration with Existing System

The schema integrates seamlessly with your existing Account model by:

1. **Extending Account Relations**: Added inquiry-related fields to Account model
2. **Preserving Existing Structure**: No changes to current account functionality
3. **Role-Based Access**: Utilizes existing access control (Admin, User, Super_Admin)
4. **Audit Trail**: Integrates with existing audit logging system

## Usage Examples

### Creating a Guest Inquiry
```javascript
const inquiry = await prisma.inquiry.create({
  data: {
    subject: "Equipment Request Help",
    message: "I need help with equipment borrowing process",
    category: "EQUIPMENT",
    priority: "MEDIUM",
    guestName: "Juan Dela Cruz",
    guestEmail: "juan@email.com"
  }
});
```

### Admin Reply with Status Update
```javascript
const reply = await prisma.inquiryReply.create({
  data: {
    message: "Hello Juan, I can help you with that...",
    senderType: "ADMIN",
    senderId: adminId,
    inquiryId: inquiryId
  }
});

await prisma.inquiry.update({
  where: { id: inquiryId },
  data: { 
    status: "IN_PROGRESS",
    assignedToId: adminId
  }
});
```

### Fetching Inquiries with Full Context
```javascript
const inquiries = await prisma.inquiry.findMany({
  include: {
    user: true,
    assignedTo: true,
    replies: {
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    }
  },
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' }
});
```

This schema provides a solid foundation for a professional customer service system while maintaining flexibility for future enhancements and scaling.

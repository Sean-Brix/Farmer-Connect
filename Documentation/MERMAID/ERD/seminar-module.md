# Seminar Module ERD

This diagram shows the educational seminar management system for farmer training and knowledge sharing.

## Entities

### Seminar
- **Purpose**: Educational events for farmer capacity building
- **Scheduling**: Complete date/time management with registration deadlines
- **Content**: Rich information including descriptions, speakers, and promotional images
- **Status Management**: Upcoming, Ongoing, Completed, Cancelled

### SeminarParticipant
- **Purpose**: Junction table managing seminar registrations
- **Status Types**: Registered, Attended, Not_Attended, Cancelled
- **Functionality**: Links participants to specific seminars with attendance tracking

## Relationships

- One Seminar can have multiple SeminarParticipants (one-to-many)
- Each Seminar is created by an Account (admin/staff)
- Each SeminarParticipant links to an Account (attendee)

## Key Features

- **Capacity Management**: Registration limits with deadline enforcement
- **Attendance Tracking**: Real-time status updates during events
- **Rich Content**: Support for images, detailed descriptions, and speaker information
- **Admin Control**: Seminar creation and management by authorized users
- **Lifecycle Management**: Complete event status tracking from creation to completion

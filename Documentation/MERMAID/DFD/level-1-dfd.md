# Level 1 DFD - Core System Processes

This diagram breaks down the main system processes into detailed sub-processes showing the internal workings of key system functions.

## User Authentication Process

### Flow Description
1. **Login Request**: User submits credentials (username/password)
2. **Credential Validation**: System checks against stored user data
3. **Decision Point**: Valid credentials trigger token generation
4. **JWT Token Generation**: Secure token created for session management
5. **Session Establishment**: Cookie set for subsequent requests
6. **Response**: Success confirmation or error message

### Security Features
- **Password Hashing**: Secure storage using bcrypt
- **JWT Tokens**: Stateless session management
- **Cookie Security**: HTTPOnly and secure cookies
- **Error Handling**: Secure error messages without information leakage

## Seminar Registration Process

### Flow Description
1. **Seminar Discovery**: Users browse available seminars
2. **Selection**: User chooses specific seminar
3. **Authentication Check**: Verify user login status
4. **Availability Check**: Confirm seminar capacity and deadlines
5. **Registration**: Create participant record
6. **Capacity Update**: Decrement available slots
7. **Confirmation**: Send registration confirmation

### Business Logic
- **Capacity Management**: Prevent over-registration
- **Deadline Enforcement**: Time-based registration control
- **Status Tracking**: Real-time registration status updates

## Item Request Process

### Flow Description
1. **Request Initiation**: User requests specific equipment
2. **Availability Check**: Verify item stock and status
3. **Transaction Creation**: Generate request record
4. **Admin Queue**: Route to administrative review
5. **Decision Processing**: Admin approval or rejection
6. **Status Updates**: Real-time transaction status changes
7. **Pickup Coordination**: Schedule collection for approved requests

### Workflow Management
- **Request Queuing**: Systematic administrative review process
- **Status Tracking**: Complete transaction lifecycle management
- **Inventory Updates**: Real-time stock level adjustments
- **Communication**: Automated user notifications

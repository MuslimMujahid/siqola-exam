# User Invitation System

This module implements the user invitation flow for Examiners and Examinees.

## Overview

The invitation system allows administrators to invite users to join their institution. The system handles both existing users (who already have accounts) and new users (who need to create accounts).

## Flow

### Admin Perspective

1. Admin navigates to the user management page
2. Clicks "Undang Pengguna" (Invite User) button
3. Fills in the invitation form:
   - Email address
   - Role (EXAMINER or EXAMINEE)
4. System creates:
   - User record (if email not registered) with `emailVerified = false`
   - Membership with status `PENDING`
   - InvitationToken (expires in 3 days)
   - Sends invitation email with link

### Invited User Perspective

#### Existing User (Email Already Registered)
1. Opens invitation link
2. Sees invitation details with their existing account information
3. Options:
   - **Accept**: Updates membership status to `ACTIVE`
   - **Reject**: Removes membership

#### New User (Email Not Registered)
1. Opens invitation link
2. Sees account creation form
3. Fills in:
   - Full name
   - Phone number
   - Password
   - Confirm password
4. Options:
   - **Accept & Create Account**: 
     - Updates user with account details
     - Sets `emailVerified = true`
     - Updates membership status to `ACTIVE`
   - **Reject**: 
     - Removes membership
     - Deletes user record

## API Endpoints

### POST `/invitations/invite`
Invite a user to join an institution.

**Headers:**
- `x-institution-id`: The institution ID

**Body:**
```json
{
  "email": "user@example.com",
  "role": "EXAMINER" | "EXAMINEE"
}
```

**Response:**
```json
{
  "message": "Invitation sent successfully",
  "invitationUrl": "http://localhost:3000/invitation/abc123",
  "expiresAt": "2024-11-27T00:00:00.000Z"
}
```

### GET `/invitations/:token`
Get invitation details by token.

**Response:**
```json
{
  "email": "user@example.com",
  "role": "EXAMINER",
  "institution": {
    "id": "inst123",
    "name": "Institution Name",
    "logo": "https://..."
  },
  "isExistingUser": true,
  "userFullName": "John Doe"
}
```

### POST `/invitations/:token/accept`
Accept an invitation.

**Body (for new users only):**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "08123456789",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Invitation accepted successfully"
}
```

### POST `/invitations/:token/reject`
Reject an invitation.

**Response:**
```json
{
  "message": "Invitation rejected successfully"
}
```

## Database Schema

### InvitationToken
- `id`: Unique identifier
- `token`: Unique token string (used in URL)
- `email`: Invited user's email
- `role`: Role for the invitation (EXAMINER/EXAMINEE)
- `userId`: Reference to User (nullable)
- `institutionId`: Reference to Institution
- `expiresAt`: Token expiration date (3 days from creation)
- `used`: Whether token has been used
- `createdAt`: Creation timestamp

### User Updates
- Added `emailVerified` field (boolean, default: false)
- Made `password`, `fullName`, `phoneNumber` nullable

### MembershipStatus Enum
- Added `PENDING` status

## Frontend Components

### InviteUserDialog
Dialog component for inviting users. Located at:
`apps/frontend/app/dashboard/admin/users/_components/invite-user-dialog.tsx`

### Invitation Page
Page for accepting/rejecting invitations. Located at:
`apps/frontend/app/invitation/[token]/page.tsx`

## Email Service

Currently, the email service logs invitation details to the console. To implement actual email sending:

1. Install email service package (e.g., `@nestjs-modules/mailer`, `nodemailer`, or use SendGrid/Mailgun)
2. Update `apps/backend/src/mail/mail.service.ts`
3. Configure email templates
4. Add email service credentials to `.env`

## Environment Variables

### Backend
```env
FRONTEND_URL=http://localhost:3000
```

## Usage Examples

### Invite a User
```typescript
const response = await invitationsApi.inviteUser(
  {
    email: "examiner@example.com",
    role: "EXAMINER"
  },
  "institution-id"
);
```

### Accept Invitation (New User)
```typescript
await invitationsApi.acceptInvitation("token-123", {
  fullName: "John Doe",
  phoneNumber: "08123456789",
  password: "securepass123"
});
```

### Accept Invitation (Existing User)
```typescript
await invitationsApi.acceptInvitation("token-123");
```

### Reject Invitation
```typescript
await invitationsApi.rejectInvitation("token-123");
```

## Security Considerations

1. **Token Expiration**: Tokens expire after 3 days
2. **One-Time Use**: Tokens can only be used once
3. **Password Hashing**: Passwords are hashed using bcrypt
4. **Email Verification**: New users are marked as verified upon acceptance
5. **Authorization**: Only admins can send invitations (implement authorization guards)

## Future Enhancements

1. Implement actual email sending with templates
2. Add invitation resending functionality
3. Add invitation history/audit log
4. Add bulk invitation import (CSV)
5. Add customizable invitation email templates
6. Add invitation expiration notification
7. Add rate limiting for invitation sending

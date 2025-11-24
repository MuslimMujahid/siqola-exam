# Quick Start Guide - User Invitation System

## For Developers

### Running the Application

1. **Start the Backend**
   ```bash
   cd apps/backend
   pnpm dev
   ```

2. **Start the Frontend**
   ```bash
   cd apps/frontend
   pnpm dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## For Administrators

### How to Invite Users

1. **Login as Admin**
   - Go to http://localhost:3000/login
   - Use your admin credentials

2. **Navigate to User Management**
   - Click "Kelola Pengguna" in the sidebar
   - Or go to `/dashboard/admin/users`

3. **Send Invitation**
   - Click the "Undang Pengguna" button (top right)
   - Fill in the form:
     - **Email**: The user's email address
     - **Peran**: Select role (Penguji or Peserta)
   - Click "Kirim Undangan"

4. **Copy Invitation Link**
   - Check the backend console for the invitation URL
   - Example: `http://localhost:3000/invitation/abc123xyz`
   - Share this link with the invited user

### User Types

**Penguji (Examiner)**
- Can create and manage exams
- Can view exam results
- Has administrative privileges

**Peserta (Examinee)**
- Can take exams
- Can view their own results
- Limited to assigned groups

## For Invited Users

### New User (First Time)

1. **Open Invitation Link**
   - Click the link received from admin
   - You'll see invitation details

2. **Fill Account Details**
   - Full Name: Your complete name
   - Phone Number: Your contact number (format: 08xxxxxxxxxx)
   - Password: At least 8 characters
   - Confirm Password: Repeat your password

3. **Accept Invitation**
   - Click "Terima & Buat Akun"
   - Wait for confirmation
   - You'll be redirected to login page

4. **Login**
   - Use your email and password
   - Access your dashboard

### Existing User

1. **Open Invitation Link**
   - Click the link received from admin
   - You'll see your existing account details

2. **Accept Invitation**
   - Click "Terima Undangan"
   - Your membership will be activated
   - You'll be redirected to dashboard

### Rejecting an Invitation

If you don't want to join:
1. Open the invitation link
2. Click "Tolak Undangan"
3. The invitation will be canceled

⚠️ **Note**: Invitation links expire after 3 days

## Troubleshooting

### "Invitation not found"
- The link may have expired (3 days limit)
- The link may have already been used
- Contact the admin for a new invitation

### "Email already registered"
- The admin will see this if trying to invite an existing user
- The system will automatically handle this by creating a pending membership

### "Invalid token"
- The invitation link may be corrupted
- Request a new invitation from the admin

### Email Not Received
- Currently, emails are logged to the console (not sent)
- Ask the admin to check the backend console for the invitation URL
- In production, actual emails will be sent

## API Testing (For Developers)

### Send Invitation
```bash
curl -X POST http://localhost:5000/invitations/invite \
  -H "Content-Type: application/json" \
  -H "x-institution-id: YOUR_INSTITUTION_ID" \
  -d '{
    "email": "user@example.com",
    "role": "EXAMINER"
  }'
```

### Get Invitation Details
```bash
curl http://localhost:5000/invitations/TOKEN
```

### Accept Invitation (New User)
```bash
curl -X POST http://localhost:5000/invitations/TOKEN/accept \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phoneNumber": "08123456789",
    "password": "securepass123"
  }'
```

### Accept Invitation (Existing User)
```bash
curl -X POST http://localhost:5000/invitations/TOKEN/accept \
  -H "Content-Type: application/json"
```

### Reject Invitation
```bash
curl -X POST http://localhost:5000/invitations/TOKEN/reject
```

## Database

### Check Invitation Tokens
```sql
SELECT * FROM invitation_tokens;
```

### Check Pending Memberships
```sql
SELECT * FROM memberships WHERE status = 'PENDING';
```

### Check Unverified Users
```sql
SELECT * FROM users WHERE email_verified = false;
```

## Important Notes

1. **Email Service**: Currently logs to console. Implement actual email service for production.
2. **Authorization**: Add guards to ensure only admins can send invitations.
3. **Token Expiration**: Tokens expire after 3 days.
4. **One-Time Use**: Each invitation link can only be used once.

## Support

For issues or questions:
1. Check the logs (backend console)
2. Review the database tables
3. Consult the full documentation in `INVITATION_SYSTEM.md`

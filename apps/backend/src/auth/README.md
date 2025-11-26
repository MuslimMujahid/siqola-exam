# JWT Authentication & Authorization

This directory contains the JWT-based authentication and role-based authorization implementation for the application.

## Components

### Strategies

- **JwtStrategy** (`strategies/jwt.strategy.ts`): Passport strategy for validating JWT tokens. Extracts the user from the database and attaches it to the request.

### Guards

- **JwtAuthGuard** (`guards/jwt-auth.guard.ts`): Protects routes by requiring a valid JWT token. Apply this guard to any route that requires authentication.
- **RolesGuard** (`guards/roles.guard.ts`): Checks if the authenticated user has the required role(s) to access a route. Must be used together with `JwtAuthGuard`.

### Decorators

- **@Roles(...roles)** (`decorators/roles.decorator.ts`): Specify which roles are allowed to access a route.
- **@CurrentUser()** (`decorators/current-user.decorator.ts`): Parameter decorator to inject the current authenticated user into a controller method.

## Usage

### Protecting Routes with Authentication

Apply the `JwtAuthGuard` to require authentication:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'This route requires authentication' };
  }
}
```

### Role-Based Authorization

Combine `JwtAuthGuard` and `RolesGuard` with the `@Roles` decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles(Role.ADMIN)
  getAllUsers() {
    return { message: 'Only admins can access this' };
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.EXAMINER)
  getStats() {
    return { message: 'Admins and examiners can access this' };
  }
}
```

### Accessing the Current User

Use the `@CurrentUser()` decorator to access the authenticated user:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
```

## Available Roles

The system supports three roles (defined in Prisma schema):

- **ADMIN**: Full access to all resources
- **EXAMINER**: Can create and manage exams
- **EXAMINEE**: Can take exams (default role)

## Authentication Flow

1. User logs in via `/auth/login` endpoint
2. Server validates credentials and returns a JWT token
3. Client includes the token in subsequent requests as a Bearer token:
   ```
   Authorization: Bearer <token>
   ```
4. `JwtStrategy` validates the token and loads the user
5. `RolesGuard` (if applied) checks if the user has the required role(s)

## JWT Token Payload

The JWT token contains:

```typescript
{
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
```

## Configuration

JWT configuration is in `auth.module.ts`:

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: { expiresIn: '7d' },
});
```

**Important**: Set the `JWT_SECRET` environment variable in production!

## Examples

### Users Controller

The users controller demonstrates role-based access control:

- Creating users: `ADMIN` only
- Viewing users: `ADMIN` and `EXAMINER`
- Updating/deleting users: `ADMIN` only
- Managing memberships: `ADMIN` only

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles(Role.ADMIN, Role.EXAMINER)
  findAll() {
    // Both ADMIN and EXAMINER can access
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove() {
    // Only ADMIN can access
  }
}
```

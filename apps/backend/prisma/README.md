# Prisma Database Seeding

This directory contains the database schema and seeding scripts for the Siqola Exam backend.

## Running Seeds

To seed the database with sample data, run:

```bash
# From the backend directory
pnpm prisma db seed

# Or from the root of the monorepo
pnpm --filter backend prisma db seed
```

## Seed Data Overview

The seed script creates the following sample data:

### Institutions (4)

1. **Universitas Indonesia** - Major university
2. **Institut Teknologi Bandung** - Major university
3. **SMA Negeri 1 Jakarta** - High school
4. **Bimbingan Belajar Neutron** - Tutoring center

### Users (16)

- **4 Admins** - One for each institution
- **4 Examiners** - Teachers/instructors (Math, Physics, Chemistry, Biology)
- **8 Students** - Examinees across various institutions

### Memberships (17)

- Links users to institutions with appropriate roles
- Some users (like the Math examiner) have memberships in multiple institutions

### Groups (8)

- 2 groups for Universitas Indonesia
- 2 groups for Institut Teknologi Bandung
- 2 groups for SMA Negeri 1 Jakarta
- 2 groups for Bimbingan Belajar Neutron

### Group Members (12)

- Students assigned to various groups
- Some students belong to multiple groups

## Default Credentials

All seeded users have the same password: **password123**

### Sample User Accounts

| Role     | Email                          | Institution                |
| -------- | ------------------------------ | -------------------------- |
| Admin    | admin.ui@example.com           | Universitas Indonesia      |
| Admin    | admin.itb@example.com          | Institut Teknologi Bandung |
| Admin    | admin.sma1@example.com         | SMA Negeri 1 Jakarta       |
| Admin    | admin.neutron@example.com      | Bimbingan Belajar Neutron  |
| Examiner | examiner.math@example.com      | UI & SMA 1                 |
| Examiner | examiner.physics@example.com   | ITB                        |
| Examiner | examiner.chemistry@example.com | UI                         |
| Examiner | examiner.biology@example.com   | Neutron                    |
| Student  | student1@example.com           | UI                         |
| Student  | student2@example.com           | UI                         |
| Student  | student3@example.com           | ITB                        |
| Student  | student4@example.com           | ITB                        |
| Student  | student5@example.com           | SMA 1                      |
| Student  | student6@example.com           | SMA 1                      |
| Student  | student7@example.com           | Neutron                    |
| Student  | student8@example.com           | Neutron                    |

## Reset and Reseed

To completely reset the database and reseed:

```bash
# From the backend directory
pnpm prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run the seed script
```

## Development Tips

- The seed script clears all existing data before seeding
- All passwords are hashed using bcrypt with a salt round of 10
- Phone numbers use Indonesian format (+628...)
- Institution addresses are real locations in Indonesia

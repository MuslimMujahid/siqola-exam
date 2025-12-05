# Exams Module

This module handles the exam management functionality for examiners.

## Structure

```
exams/
├── components/
│   ├── exams-table.tsx       # Data table component for displaying exams
│   └── index.ts
├── data/
│   └── mock-exams.ts          # Mock data for development
├── pages/
│   ├── exams-list-page.tsx    # Main exam list page
│   └── index.ts
└── types/
    ├── exam.ts                # Type definitions
    └── index.ts
```

## Features

### Exams List Page

- **Display**: Shows all exams in a filterable table
- **Filters**:
  - Search by title/description
  - Filter by status (Draft, Published, On-Going, Closed)
  - Filter by date range (creation date)
- **Actions**:
  - Create new exam
  - Edit exam
  - Delete exam
  - Publish/Unpublish exam
  - View exam details

### Data Displayed

For each exam:

- Title and description
- Status badge
- Number of assigned examinees
- Attempts count (with completed count)
- Total questions
- Duration in minutes
- Creation date

## Usage

The page is automatically imported in the app router:

```tsx
// app/exams/page.tsx
import ExamsListPage from "@/modules/exams/pages/exams-list-page";

export default ExamsListPage;
```

## Mock Data

Currently using mock data from [data/mock-exams.ts](data/mock-exams.ts). Replace with real API calls when backend is ready.

## Status Types

```typescript
enum ExamStatus {
  DRAFT = "DRAFT", // Not yet published
  PUBLISHED = "PUBLISHED", // Published but not started
  ON_GOING = "ON_GOING", // Currently active
  CLOSED = "CLOSED", // Ended
}
```

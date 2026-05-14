# EduPro Admin Portal - Complete Guide

## Quick Access

### How to Login to Admin Portal

1. **Navigate to Login Page**
   - Go to `http://localhost:3000/auth/login`
   - Or click "Login" from the main website

2. **Select Admin Role**
   - You'll see three role options:
     - **Student** (BookOpen icon)
     - **Teacher** (Users icon)
     - **Admin** (Shield icon - third option)
   - Click on the **Admin** button (Shield icon)

3. **Enter Credentials**
   - Email: Any email address (e.g., `admin@edupro.academy`)
   - Password: Any password (e.g., `admin123`)
   - Note: Currently, authentication is not strictly enforced for demo purposes

4. **Access Admin Dashboard**
   - Click "Enter Admin Portal"
   - You'll be redirected to `/admin/dashboard`

---

## Admin Dashboard Overview

### Main Navigation Menu (Sidebar)

The admin portal includes 8 main sections:

#### 1. **Dashboard**
- **URL:** `/admin/dashboard`
- **Overview:** Main admin hub with key statistics
- **Features:**
  - 4 Key Metrics: Students, Teachers, Courses, Revenue
  - Recent activities feed
  - Top performing courses
  - Quick action buttons

#### 2. **Student Management**
- **URL:** `/admin/students`
- **Overview:** Complete student database management
- **Features:**
  - View all registered students
  - Search students by name/email
  - Filter by enrollment status
  - Add new students (slide overlay form)
  - Edit student information
  - Delete student accounts
  - Track student status (Active/Inactive)

**Student Fields:**
- Full Name
- Email Address
- Phone Number
- Enrolled Courses
- Status (Active/Inactive)
- Join Date

#### 3. **Teacher Management**
- **URL:** `/admin/teachers`
- **Overview:** Manage all instructors and educators
- **Features:**
  - View teacher directory
  - Teacher performance ratings (5-star system)
  - Courses taught tracking
  - Student reach metrics
  - Search teachers by name
  - Filter by status
  - Add new teachers
  - Edit teacher profiles

**Teacher Fields:**
- Full Name
- Email Address
- Subject Specialization
- Courses Taught
- Students Taught
- Star Rating
- Status (Active/Inactive)

#### 4. **Course Management**
- **URL:** `/admin/courses`
- **Overview:** Manage entire course catalog
- **Features:**
  - View all courses with details
  - Course pricing information
  - Revenue tracking per course
  - Student enrollment counts
  - Difficulty level indicators
  - Course status management
  - Create new courses
  - Edit course details
  - Delete courses

**Course Fields:**
- Course Title
- Instructor/Teacher
- Difficulty Level (Beginner/Intermediate/Advanced)
- Price
- Student Count
- Revenue
- Status (Active/Inactive)

#### 5. **Payment Management**
- **URL:** `/admin/payments`
- **Overview:** Track all financial transactions
- **Features:**
  - Complete transaction history
  - Payment method tracking
  - Transaction status management
  - Revenue summary
  - Pending payments alerts
  - Search transactions
  - Filter by payment method/status

**Transaction Fields:**
- Transaction ID
- Student Name
- Course Purchased
- Amount Paid
- Payment Method (Bank Transfer, JazzCash, EasyPaisa)
- Status (Completed, Pending, Failed)
- Date

#### 6. **Results & Grades**
- **URL:** `/admin/results`
- **Overview:** Manage student examination results
- **Features:**
  - View all exam results
  - Grade assignment and tracking
  - Automatic grade calculation
  - Result status management (Published/Draft)
  - Add new results (slide overlay form)
  - Search results by student
  - Filter by course/grade

**Result Fields:**
- Student Name
- Course
- Exam Date
- Score (0-100)
- Auto-Calculated Grade (A+, A, B+, B, C, D, F)
- Status (Published/Draft)

**Grading System:**
- A+ : 95-100
- A : 90-94
- B+ : 85-89
- B : 80-84
- C : 70-79
- D : 60-69
- F : Below 60

#### 7. **Certificate Management**
- **URL:** `/admin/certificates`
- **Overview:** Manage student certificates and credentials
- **Features:**
  - View issued certificates
  - Certificate issuance tracking
  - Unique certificate ID generation
  - View certificate details
  - Issue status management
  - Search certificates
  - Statistics dashboard

**Certificate Fields:**
- Certificate ID (Auto-generated)
- Student Name
- Course Completed
- Issue Date
- Certificate Link
- Status (Issued/Pending)

#### 8. **Analytics**
- **URL:** `/admin/analytics`
- **Overview:** Platform performance and insights
- **Features:**
  - Student growth trends
  - Revenue growth tracking
  - Completion rate metrics
  - Monthly data visualization
  - Course enrollment trends
  - Platform statistics

---

## How to Use Each Feature

### Adding a New Student

1. Go to **Student Management** (`/admin/students`)
2. Click **"Add Student"** button in the header
3. A slide-in form appears from the right
4. Fill in the required fields:
   - Full Name
   - Email Address
   - Phone Number
   - Select Enrolled Courses
5. Click **"Add Student"** button in the form
6. Student will be added to the database

### Adding a New Teacher

1. Go to **Teacher Management** (`/admin/teachers`)
2. Click **"Add Teacher"** button
3. Slide-in form appears
4. Fill in the teacher details:
   - Full Name
   - Email Address
   - Subject/Specialization
   - Qualification
5. Click **"Save Teacher"**
6. New teacher is now active in the system

### Adding a New Course

1. Go to **Course Management** (`/admin/courses`)
2. Click **"Create Course"** button
3. Fill in course information:
   - Course Title
   - Select Instructor
   - Set Difficulty Level
   - Set Price
   - Add Course Outline/Modules
4. Click **"Create Course"**
5. Course is now available for student enrollment

### Recording Student Results

1. Go to **Results & Grades** (`/admin/results`)
2. Click **"Add Result"** button
3. Fill in:
   - Select Student
   - Select Course/Exam
   - Enter Score (0-100)
   - Set Result Status
4. Grade is automatically calculated
5. Click **"Add Result"**
6. Result appears in the results table

### Processing Payments

1. Go to **Payment Management** (`/admin/payments`)
2. View all pending transactions
3. Click on a transaction to view details
4. Update payment status:
   - Mark as Completed (payment received)
   - Mark as Failed (payment failed)
   - Keep as Pending (awaiting payment)
5. Payment status updates in real-time

### Issuing Certificates

1. Go to **Certificate Management** (`/admin/certificates`)
2. Click **"Issue Certificate"** button
3. Select Student and Course
4. Certificate ID is auto-generated
5. Click **"Issue Certificate"**
6. Certificate is now issued and visible to student

---

## Admin Features Summary

### Search & Filter
- All pages have search functionality
- Filter by status, category, date ranges
- Real-time search results

### Slide Overlay Forms
- Click any "Add" button to open forms
- Smooth slide-in animation from right
- Click outside or "Cancel" to close

### Data Tables
- Sortable columns (click header to sort)
- Hover effects for better UX
- Quick action buttons (Edit, Delete, View)
- Responsive design for all screen sizes

### Statistics Dashboard
- Real-time metrics on dashboard
- Gradient cards with icon indicators
- Quick statistics for:
  - Total Students
  - Active Teachers
  - Available Courses
  - Revenue Generated

---

## Color Scheme

The admin portal uses a professional gradient color scheme:

- **Primary Blue:** Main actions and highlights
- **Emerald Green:** Success states and achievements
- **Amber/Orange:** Warnings and pending items
- **Violet/Purple:** Secondary actions

Each data type has associated colors for quick visual recognition.

---

## Mobile Responsiveness

- All pages are fully responsive
- Sidebar collapses on mobile devices
- Touch-friendly button sizes
- Optimized for tablets and phones

---

## Keyboard Shortcuts (Coming Soon)

- `Ctrl + K` : Global search
- `Ctrl + A` : Add new item (context-dependent)
- `Ctrl + E` : Edit selected item
- `Escape` : Close forms and modals

---

## Support & Troubleshooting

### Can't Login?
- Clear browser cookies and cache
- Try private/incognito mode
- Check that you selected the "Admin" role

### Forms Not Working?
- Ensure all required fields are filled
- Check for browser console errors (F12)
- Try refreshing the page

### Data Not Updating?
- Clear browser cache
- Refresh the page (Ctrl + R)
- Check your internet connection

---

## Security Notes

**Important:** This is a demo system. In production:
- Implement proper authentication (JWT, OAuth, etc.)
- Use secure password hashing
- Enable role-based access control (RBAC)
- Add activity logging and audit trails
- Implement data encryption

---

## Future Enhancements

Planned features for the admin portal:

- [ ] Advanced analytics and reports
- [ ] Bulk student import/export
- [ ] Email notifications to students/teachers
- [ ] Grade appeal system
- [ ] Refund management
- [ ] Announcement system
- [ ] Messaging between admin and users
- [ ] Attendance tracking
- [ ] Custom report generation
- [ ] Two-factor authentication

---

## Support

For issues or questions about the admin portal, please contact the development team or check the main documentation.

---

**Last Updated:** May 7, 2026
**Version:** 1.0
**Status:** Active Development

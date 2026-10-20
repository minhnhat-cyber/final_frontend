# How to Test the App

## Student Information

- **Student Name:** Nguyen Nhat Minh
- **Student ID:** 6632058

## Test Credentials

All passwords are stored as bcrypt hashes in MongoDB.

| Role | Username / Email | Password |
|---|---|---|
| Teacher | teacher1 / teacher1@gmail.com | teacher123 |
| Teacher | teacher2 / teacher2@gmail.com | teacher123 |
| Teacher | teacher3 / teacher3@gmail.com | teacher123 |
| Student | student1 / student1@gmail.com | student123 |
| Student | student2 / student2@gmail.com | student123 |
| Student | student3 / student3@gmail.com | student123 |

**Note:** These are test accounts only. The credentials assume the database was seeded with the passwords shown above.

## Prerequisites

- Node.js and npm
- MongoDB Atlas or a running MongoDB instance
- A valid MongoDB connection string
- A modern web browser
- Internet access if using MongoDB Atlas

## How to Run & Test

### 1. Backend Setup (`next-backend/`)

1. Open a terminal in the `next-backend` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file containing:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=online_course
   JWT_SECRET=your_secure_random_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. Ensure the `online_course` database contains a `users` collection with the six test accounts listed above.

5. Start the backend:

   ```bash
   npm run dev
   ```

6. The backend should be available at:

   `http://localhost:3000`

### 2. Frontend Setup (`react-frontend/`)

1. Open a second terminal in the `react-frontend` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open the URL displayed by Vite, usually:

   `http://localhost:5173`

### 3. Testing Walkthrough

#### Test 1: Authentication

1. Open the application.
2. Sign in with `teacher1` and the test password.
3. Verify that the Teacher Dashboard opens.
4. Log out.
5. Sign in using `student1`.
6. Verify that the Student Dashboard opens.
7. Test an incorrect password and confirm that access is denied.

#### Test 2: Teacher Course Management

1. Sign in as `teacher1`.
2. Select **Create Course**.
3. Enter a course name, duration, topics, price, maximum student capacity, and status.
4. Save the course.
5. Verify that the course appears in the Teacher Dashboard.
6. Open the course details and edit the information.
7. Verify that the changes are saved.
8. Delete a course with no enrolled students.
9. Verify that a course with enrolled students cannot be deleted.

#### Test 3: Student Course Browsing

1. Sign in as `student1`.
2. View the available courses.
3. Confirm that Open and Close courses are visible.
4. Confirm that Cancel courses are not displayed in the general course list.
5. Search by course name.
6. Search by teacher name.
7. Open a course to view its details.

#### Test 4: Student Enrollment

1. Sign in as `student1`.
2. Select an Open course with available capacity.
3. Click **Enroll**.
4. Confirm successful enrollment.
5. Visit **My Enrollments** and verify that the course appears.
6. Attempt to enroll in the same course again and verify that duplicate enrollment is rejected.
7. Attempt to enroll in a Close course and verify that enrollment is rejected.
8. Fill a course to its maximum capacity using test students and verify that further enrollment is rejected.

#### Test 5: Authorization and Security

1. Verify that a Student cannot create, edit, or delete courses.
2. Verify that a Teacher can only modify courses they own.
3. Sign in as `teacher2` and attempt to modify a course owned by `teacher1`; the backend must reject the request.
4. Attempt to access protected API endpoints without authentication and verify that access is denied.
5. Confirm that course enrollment restrictions are enforced by the backend rather than relying only on frontend controls.

#### Test 6: Code Quality and Build

Run these commands in both project directories:

```bash
npm run lint
npm run build
```

Confirm that both applications pass linting and production build checks.

## Expected Result

The application should allow Teachers to manage their own courses and Students to browse and enroll in eligible courses. Authentication, authorization, enrollment capacity limits, and course deletion restrictions should be enforced by the backend.

## Deployment Links

- **Frontend URL:** [Add deployed frontend URL]
- **Backend URL:** [Add deployed backend URL]
- **GitHub Repository:** [Add repository URL]
- **Demo Recording:** [Add recording URL]

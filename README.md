# 📚 Library Management System API

A production-ready RESTful backend application for managing books, members, and borrowing activities in a library.

### Live URL: https://library-management-system-fxdj.onrender.com/

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Role-Based Authorization

### Librarian
- Add Books
- Update Books
- Delete Books
- View All Members

### Member
- View Books
- Borrow Books
- Return Books
- View Borrowed Books

### General
- Input Validation
- Centralized Error Handling
- RESTful APIs
- MySQL Database Integration

---

# 🛠 Tech Stack

| Technology | Version |
|------------|----------|
| Node.js | v18+ |
| Express.js | Latest |
| MySQL | 8.x |
| JWT | Authentication |
| bcrypt | Password Hashing |
| express-validator | Validation |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |

---

# 📂 Project Structure

```
library-management-system/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── memberController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorMiddleware.js
│   └── asyncHandler.js
│
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Borrow.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── memberRoutes.js
│
├── validators/
│   ├── authValidator.js
│   └── bookValidator.js
│
├── utils/
│   ├── ApiResponse.js
│   └── generateToken.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/library-management-system.git
```

Go to project directory

```bash
cd library-management-system
```

Install dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management

JWT_SECRET=your_jwt_secret
```

---

# 🗄 Database

Database Name

```
library_management
```

### Users Table

| Column | Type |
|---------|------|
| id | INT |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | ENUM(member,librarian) |
| created_at | TIMESTAMP |

---

### Books Table

| Column | Type |
|---------|------|
| id | INT |
| title | VARCHAR |
| author | VARCHAR |
| isbn | VARCHAR |
| category | VARCHAR |
| quantity | INT |
| available_quantity | INT |
| created_at | TIMESTAMP |

---

### Borrow Table

| Column | Type |
|---------|------|
| id | INT |
| member_id | INT |
| book_id | INT |
| borrow_date | DATETIME |
| return_date | DATETIME |
| status | ENUM(borrowed,returned) |

---

# 🔑 Authentication

JWT Token Authentication

Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint | Access |
|----------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |

---

## Books

| Method | Endpoint | Access |
|----------|----------|--------|
| POST | /api/books | Librarian |
| GET | /api/books | Authenticated |
| GET | /api/books/:id | Authenticated |
| PUT | /api/books/:id | Librarian |
| DELETE | /api/books/:id | Librarian |

---

## Members

| Method | Endpoint | Access |
|----------|----------|--------|
| GET | /api/members | Librarian |
| DELETE | /api/members/:id | Librarian |
| GET | /api/members/me/books | Member |

---

## Borrow

| Method | Endpoint | Access |
|----------|----------|--------|
| POST | /api/books/:id/borrow | Member |
| POST | /api/books/:id/return | Member |

---

# 📮 Postman Collection

Import the provided Postman collection to test all APIs.

---

# ✅ Validation

- Valid Email Format
- Password Minimum 6 Characters
- Required Fields Validation
- Quantity Cannot Be Negative
- Duplicate ISBN Validation

---

# 🛡 Security

- JWT Authentication
- Password Hashing with bcrypt
- Role-Based Authorization
- Input Validation
- Secure Environment Variables

---

# 🚀 Deployment

The project can be deployed on:

- Render
- Railway
- Cyclic

---

# 📷 Screen Recording

A 3–5 minute walkthrough video demonstrating:

- Project structure
- Authentication
- Book management
- Borrow and return functionality
- API testing using Postman

---

# 👨‍💻 Author

**Ayush Raj**

GitHub: https://github.com/your-github-username

LinkedIn: https://linkedin.com/in/your-linkedin-profile

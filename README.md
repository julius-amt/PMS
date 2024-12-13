# E-Commerce Product Management System

This is a **medium-complexity project** designed to build an e-commerce product management system using the **Express.js** framework. The project integrates **MongoDB** as the database and implements essential features like authentication, product categorization, and file handling for product images.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Project Objectives](#project-objectives)
4. [Implementation Details](#implementation-details)
    - [Views](#views)
    - [NoSQL Database Management](#nosql-database-management)
    - [Authentication and Session Management](#authentication-and-session-management)
    - [File Handling](#file-handling)
    - [Product Management Features](#product-management-features)
5. [Folder Structure](#folder-structure)
6. [Installation and Setup](#installation-and-setup)
7. [Usage](#usage)
8. [API Routes](#api-routes)
9. [Environment Variables](#environment-variables)
10. [Future Enhancements](#future-enhancements)
11. [License](#license)

---

## Overview

The e-commerce product management system provides the foundational functionality for an online store, including:

-   Product creation and categorization.
-   Secure user authentication.
-   Image uploads for products.
-   Dynamic rendering of pages using **EJS templating engine**.

This application is designed with scalability and extensibility in mind, allowing easy integration of advanced features in the future.

---

## Features

-   **User Authentication**:
    Secure user registration and login using **JWT tokens** for session management.

-   **Product Management**:
    CRUD operations for products with efficient categorization using nested document structures in MongoDB.

-   **Image Uploads**:
    Product images are uploaded and stored using **Multer** with server-side validation.

-   **Search Functionality**:
    Ability to search for products using advanced querying and filtering.

-   **Responsive Views**:
    User-friendly interfaces built with the **EJS templating engine**.

---

## Project Objectives

1. Build a scalable **e-commerce product management system**.
2. Utilize **MongoDB** for entity storage and advanced querying.
3. Secure user data using **bcrypt** for password hashing and **JWT** for authentication.
4. Handle **file uploads** for product images securely.
5. Implement an intuitive UI with **EJS** views.

---

## Implementation Details

### Views

-   **Templating Engine**: **EJS** is used for creating dynamic views.
-   **UI Pages**:
    -   Authentication (Login, Signup, Forgot Password).
    -   Product management (Create, List, Detail).
    -   Category management.
-   **Layouts and Partials**: Reusable components like header, footer, and layout templates.

---

### NoSQL Database Management

-   **Database**: **MongoDB**.
-   **ODM**: **Mongoose** for schema definitions and data validation.
-   **Features**:
    -   Nested documents for categories.
    -   Advanced querying and filtering for products.
    -   Document relationships for users, products, and categories.

---

### Authentication and Session Management

-   **User Registration and Login**:

    -   **JWT** for token-based authentication.
    -   **Bcrypt** for hashing passwords.

-   **Session Security**:
    Middleware to protect routes and handle token verification.

---

### File Handling

-   **File Uploads**:
    -   **Multer** for handling multipart/form-data.
    -   Server-side validation for images (e.g., size and format).
-   **Directory Structure**: Uploaded files are stored in structured directories for easy retrieval.

---

### Product Management Features

-   **Categorization**:

    -   Products are categorized using a nested document model.

-   **Search and Filters**:

    -   Implemented advanced querying for efficient product search.

-   **CRUD Operations**:
    -   Fully functional Create, Read, Update, and Delete features for products and categories.

---

## Folder Structure

```bash
.
├── public                # Static assets (images, icons, etc.)
├── src                   # Application source code
│   ├── controllers       # Business logic for routes
│   ├── models            # Mongoose schemas
│   ├── routes            # API routes
│   ├── utils             # Utilities and middleware
│   └── views             # EJS templates for UI
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

---

## Installation and Setup

### Prerequisites

-   **Node.js** (v18+)
-   **MongoDB** (local or cloud instance)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/julius-amt/PMS.git
    cd PMS/
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file and configure the required environment variables (see [Environment Variables](#environment-variables)).

4. Start the development server:

    ```bash
    npm start
    ```

5. Access the application at `http://localhost:3000`.

---

## Usage

-   **Navigate to `/signup`** to register a new user.
-   **Log in via `/login`** and access the dashboard.
-   **Add products** via the product management page.
-   **Categorize products** to organize the inventory.
-   **View, edit, or delete products** through the product listing page.

---

## Some API Routes

| Route               | Method | Description              | Auth Required |
| ------------------- | ------ | ------------------------ | ------------- |
| `/api/auth/signup`  | POST   | Register a new user      | No            |
| `/api/auth/login`   | POST   | Log in a user            | No            |
| `/api/products`     | GET    | Fetch all products       | Yes           |
| `/api/products/:id` | GET    | Fetch a specific product | Yes           |
| `/api/products`     | POST   | Create a new product     | Yes           |
| `/api/categories`   | GET    | Fetch all categories     | Yes           |

---

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
MONGO_URI=<your_mongo_database_uri>
JWT_SECRET=<your_jwt_secret_key>
EMAIL_HOST=<your_email
EMAIL_PORT=####
EMAIL_SECURE=<boolean>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_password>
BASE_URL=<your_base_url>
```

---

## Future Enhancements

-   Implement payment gateway integration.
-   Add support for multiple user roles (e.g., admin, customer).
-   Develop a RESTful API for third-party integrations.
-   Introduce advanced search capabilities using text indexing.

---

## License

This project is licensed under the MIT License.

Feel free to contribute and report issues in the repository!

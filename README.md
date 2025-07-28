Of course. Here is the complete content ready to be pasted into your `README.md` file.

````markdown
# E-Commerce API (Node.js)

A comprehensive backend API for an e-commerce platform built with Node.js, Express, and MongoDB. This project provides all the essential features for running an online store, from user authentication to order processing.

---

## ✨ Features

* **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
* **Password Encryption**: Uses `bcrypt.js` to hash and protect user passwords.
* **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
* **Cart Management**: Users can add, update, and view products in their shopping cart.
* **Order Management**: Users can place orders, and admins can manage them.
* **Admin Controls**: Middleware to protect routes, ensuring only authorized admins can manage products, users, and orders.

---

## 🛠️ Technology Stack

* **Node.js**: JavaScript runtime environment.
* **Express**: Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB**: NoSQL database for storing data.
* **Mongoose**: Elegant MongoDB object modeling for Node.js.
* **JSON Web Token (JWT)**: For secure user authentication and authorization.
* **bcrypt.js**: Library for hashing passwords.
* **dotenv**: Module to load environment variables from a `.env` file.
* **nodemon**: Utility that automatically restarts the server on file changes during development.

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### **Prerequisites**

* Node.js installed on your machine.
* MongoDB installed and running (or a MongoDB Atlas connection string).

### **Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Ahmed-Naeim/e-commerce-api.git](https://github.com/Ahmed-Naeim/e-commerce-api.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd e-commerce-api
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Create a `.env` file** in the root of the project and add the following environment variables:
    ```env
    MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
    JWT_SEC=YOUR_SUPER_SECRET_KEY
    ```

5.  **Run the server:**
    * For development (with auto-reloading):
        ```sh
        npm run dev
        ```
    * For production:
        ```sh
        npm start
        ```

The server will start on `http://localhost:5000` (or the port you configure).

---

## 📖 API Endpoints

Here is a summary of the available API routes. For detailed request/response examples, you can use a tool like Postman or Insomnia.

### **Authentication (`/api/auth`)**

* `POST /register`: Register a new user.
* `POST /login`: Log in an existing user and receive a JWT.

### **Users (`/api/users`)**

* `PUT /:id`: Update a user's details (requires token, admin or self).
* `DELETE /:id`: Delete a user (requires token, admin or self).
* `GET /find/:id`: Get a specific user's details (admin only).
* `GET /`: Get all users (admin only).

### **Products (`/api/products`)**

* `POST /`: Create a new product (admin only).
* `PUT /:id`: Update a product (admin only).
* `DELETE /:id`: Delete a product (admin only).
* `GET /find/:id`: Get a single product.
* `GET /`: Get all products (or filter by category).

### **Cart (`/api/carts`)**

* `POST /`: Create a new cart for a user (requires token).
* `PUT /:id`: Update a user's cart (requires token, admin or self).
* `DELETE /:id`: Delete a cart (requires token, admin or self).
* `GET /find/:userId`: Get a user's cart (requires token, admin or self).
* `GET /`: Get all carts (admin only).

### **Orders (`/api/orders`)**

* `POST /`: Create a new order (requires token).
* `PUT /:id`: Update an order (admin only).
* `DELETE /:id`: Delete an order (admin only).
* `GET /find/:userId`: Get a user's orders (requires token, admin or self).
* `GET /`: Get all orders (admin only).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a new feature branch, and submit a pull request.

1.  **Fork** the Project.
2.  **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the Branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

````

# E-com-web
E-commerce website built using React, Node.js, Express, MySQL and Razorpay.


# 🛒 E-Commerce Web App

This is a full-stack e-commerce web application built with **React**, **Node.js**, **Express**, and **MySQL**. It includes secure **Razorpay payment gateway integration**.

## 🚀 Features

- User registration and login
- Product listing
- Add to cart functionality
- Checkout page with payment via Razorpay
- Order history
- Admin panel (optional)

## 💻 Tech Stack

**Frontend**:
- React
- Tailwind CSS (or your CSS framework)
- Axios

**Backend**:
- Node.js
- Express
- MySQL
- Razorpay

## ⚙️ Setup Instructions

### 1. Clone the repository

bash
git clone https://github.com/sidhrashid/E-com-web.git

2. Backend Setup
bash
Copy
Edit
cd server
npm install

Create a .env file inside the server folder:

3. .env
PORT=5000
DB_HOST=your-database-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=e_com
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret


4. Run the backend server:
npm start



3. Frontend Setup
cd client
npm install
npm run dev
  

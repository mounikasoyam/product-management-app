# 🛍️ Product Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) project to manage products like an e-commerce app.  
Features include Add, Delete, Search, Sort, Dark Mode, and Image Support (local & external URLs).

---

## 🚀 Features
- ➕ Add new products with name, price, category, description, and image  
- ❌ Delete products  
- 🔍 Search products by name  
- ↕️ Sort products by price (Low → High, High → Low)  
- 🌙 Dark/Light mode toggle  
- 🖼️ Local & external image support (via `/public/images/`)  

---

## 🛠️ Tech Stack
- **Frontend**: React (Create React App)  
- **Backend**: Node.js, Express  
- **Database**: MongoDB (Atlas or local)  
- **Styling**: Custom CSS  

---

## ⚙️ Setup Instructions

```bash
# 1️⃣ Clone the repository
git clone https://github.com/mounikasoyam/product-management-app.git
cd product-management-app

# 2️⃣ Setup Backend
cd product-management-backend
npm install

# Create a .env file inside product-management-backend and add:
# MONGO_URI=your-mongodb-uri-here
# PORT=5000

# Start backend
npm run dev

# 3️⃣ Setup Frontend
cd ../product-management-frontend
npm install
npm start

# Local Store E-commerce Platform

A full-stack e-commerce web application for local stores, enabling customers to browse products, manage shopping carts, and place orders online.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Methods:** Cash on Delivery (COD) + Manual Payment (UPI/Bank Transfer)

## Features

### Customer Features
- ✅ User registration and authentication
- ✅ Browse products with search, filters, and sorting
- ✅ Product details with images, descriptions, and reviews
- ✅ Shopping cart management
- ✅ Checkout with shipping address
- ✅ Multiple payment options (COD and Manual Payment)
- ✅ Order tracking and history
- ✅ Product reviews and ratings

### Admin Features
- ✅ Dashboard with analytics (total orders, revenue, products)
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Image upload for products
- ✅ Order management with status updates
- ✅ Manual payment confirmation
- ✅ View all orders and customer details

## Project Structure

```
PRODIGY_FS_03/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderDetail.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── ProductManagement.jsx
    │   │       └── OrderManagement.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with default values. Update if needed:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Admin User

To create an admin user, you need to manually update the database or register a user and then update their role:

1. Register a new user through the UI
2. Access the SQLite database at `backend/database.sqlite`
3. Update the user's role to 'admin':
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Customer Workflow

1. **Register/Login** - Create an account or login
2. **Browse Products** - View products, use filters and search
3. **View Product Details** - See product information and reviews
4. **Add to Cart** - Add desired products to cart
5. **Checkout** - Enter shipping address and select payment method
6. **Place Order** - Complete the order
7. **Track Orders** - View order history and status

### Admin Workflow

1. **Login as Admin** - Use admin credentials
2. **Dashboard** - View sales statistics and recent orders
3. **Manage Products** - Add, edit, or delete products
4. **Manage Orders** - Update order status and confirm payments
5. **Confirm Manual Payments** - Verify and confirm manual payments

## Payment Methods

### Cash on Delivery (COD)
- Customer selects COD at checkout
- Order is created with "COD" payment status
- Payment is collected upon delivery

### Manual Payment
- Customer selects Manual Payment at checkout
- Payment instructions (UPI ID, Bank details) are displayed
- Customer makes payment and enters transaction ID
- Order is created with "Pending" payment status
- Admin verifies and confirms the payment
- Order status updates to "Confirmed"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add to cart (protected)
- `PUT /api/cart/update/:id` - Update cart item (protected)
- `DELETE /api/cart/remove/:id` - Remove from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders/create` - Create order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/confirm-payment` - Confirm payment (admin only)
- `GET /api/orders/admin/all` - Get all orders (admin only)

### Reviews
- `POST /api/reviews` - Add review (protected)
- `GET /api/reviews/product/:id` - Get product reviews
- `DELETE /api/reviews/:id` - Delete review (protected)

## Database Schema

### Users
- id, email, password, name, phone, role, created_at

### Products
- id, name, description, price, category, stock, image, rating, reviews_count, created_at

### Orders
- id, user_id, total_amount, payment_method, payment_status, order_status, shipping_address, transaction_id, created_at, updated_at

### Order Items
- id, order_id, product_id, quantity, price

### Reviews
- id, product_id, user_id, rating, comment, created_at

### Cart
- id, user_id, product_id, quantity

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs Vite dev server with HMR
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## License

MIT

## Author

Prodigy InfoTech - Task 03

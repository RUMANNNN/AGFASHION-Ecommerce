# FOREVER FASHION STORE — COMPLETE PROJECT

This version is designed to run immediately as a frontend demo without MongoDB, Cloudinary or payment credentials.

## 1. Customer website

Open terminal in:

`frontend`

Run:

```bash
npm install
npm run dev
```

Open the Vite URL, normally:

`http://localhost:5173`

The store includes:
- Home / hero section
- Latest collections
- Best sellers
- Product listing with search
- Category and type filters
- Price sorting
- Product details and gallery
- Size selection
- Persistent cart using localStorage
- Login / sign-up demo authentication
- Checkout and address form
- COD / UPI demo / Card demo payment choices
- Order history
- Contact page
- About page
- Newsletter subscription
- Responsive mobile layout
- Admin dashboard at `/admin`

## 2. Admin dashboard

Use:

`http://localhost:5173/admin`

Demo credentials:

- Email: `admin@forever.store`
- Password: `admin123`

Admin features:
- Dashboard statistics
- Add products
- Edit products
- Delete products
- Bestseller flag
- Product categories and sizes
- View customer orders
- Change order status

Product changes are stored in browser localStorage, so the demo works without a database.

## 3. Original backend

The original MongoDB/Cloudinary/Razorpay/Stripe backend is still included in `backend/` for deployment/integration later.

If you configure its `.env` values, you can run it separately:

```bash
cd backend
npm install
npm run server
```

The frontend demo does NOT require the backend to display products or place demo orders.

## Important

Do not run `npm run dev` from the outer project folder. Run it from `frontend`.

Correct:

```text
Forever-Fashion-Store-Complete/forever-full-stack/frontend
```

Then:

```bash
npm install
npm run dev
```

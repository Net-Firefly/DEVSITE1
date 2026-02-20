# Admin & User Booking System - Setup Complete

## ✅ Completed Setup

### Backend API Endpoints Created

All PHP endpoints are now available at `http://localhost/tripple-kay-api/`:

#### User Endpoints
- **GET** `/bookings/user.php` - Fetch user's bookings
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of user's bookings with status

- **POST** `/bookings/cancel.php?order_id={orderId}` - Cancel a booking
  - Headers: `Authorization: Bearer {token}`
  - Query Param: `order_id` (required)
  - Returns: Success/failure message

#### Admin Endpoints (requires `role='admin'`)
- **GET** `/admin/bookings.php` - Fetch all bookings
  - Headers: `Authorization: Bearer {token}`
  - Returns: All bookings with user and service info

- **PUT** `/admin/bookings.php` - Update booking payment status
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "order_id": "...", "payment_status": "paid|pending|failed" }`

- **GET** `/admin/services.php` - Fetch all services
  - Headers: `Authorization: Bearer {token}`

- **POST** `/admin/services.php` - Add new service
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "name": "...", "price": 500, "category": "...", "duration": "30 min" }`

- **DELETE** `/admin/services.php?id={id}` - Delete service
  - Headers: `Authorization: Bearer {token}`
  - Query Param: `id` (required)

- **GET** `/admin/users.php` - Fetch all users
  - Headers: `Authorization: Bearer {token}`
  - Returns: All users with their roles

### Frontend Pages Created

#### 1. **My Bookings** (`/my-bookings`)
- User-facing booking management page
- Shows all user appointments with status badges
- Color-coded payment status (green=paid, yellow=pending, red=failed)
- Cancel booking functionality with confirmation
- Auto-refreshes after cancellations

#### 2. **Admin Dashboard** (`/admin`)
- Comprehensive admin control panel with three tabs:
  - **Bookings Tab**: View all customer bookings, mark as paid
  - **Services Tab**: Add new services, view all services, delete services
  - **Users Tab**: View all registered users and their roles

### Navigation Updates
- Conditional buttons based on user role
- Admin users see "Admin" button → `/admin`
- Regular users see "My Bookings" button → `/my-bookings`
- Mobile and desktop navigation updated

## 🔧 Setup Instructions

### Step 1: Create Admin User

Run this SQL command in your MySQL database (`tripplekay`):

```sql
-- Option A: Make an existing user admin (replace user_id with actual ID)
UPDATE users SET role = 'admin' WHERE user_id = 1;

-- Option B: Verify role was set correctly
SELECT user_id, email, name, role FROM users ORDER BY user_id DESC LIMIT 5;
```

To find a user_id to promote:
```sql
SELECT user_id, email, name FROM users LIMIT 5;
```

### Step 2: Test the System

1. **Create two test accounts:**
   - One admin user (role='admin')
   - One regular user (role='user')

2. **Login as admin user:**
   - Navigate to `http://localhost:5173/` (your frontend)
   - Click "Sign Up" and create account with email like `admin@tripple-kay.com`
   - After signup, promote this user via SQL:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'admin@tripple-kay.com';
     ```
   - Logout and login again
   - You should see "Admin" button in navigation

3. **Access Admin Dashboard:**
   - Click "Admin" button → navigate to `/admin`
   - You'll see three tabs: Bookings, Services, Users
   - Try adding a service
   - Create a booking as a regular user to test the bookings view

4. **Test User Booking View:**
   - Logout and login as regular user
   - Click "My Bookings" button → navigate to `/my-bookings`
   - View and manage your bookings

## 📋 Features Summary

### Admin Capabilities
- ✅ View all customer bookings
- ✅ Mark bookings as paid/pending/failed
- ✅ Add new services
- ✅ Delete services
- ✅ View all registered users and their roles

### User Capabilities
- ✅ View their own bookings
- ✅ Cancel bookings with confirmation
- ✅ See booking status (paid/pending/failed)
- ✅ View booking details (date, time, service, price)

## 🔐 Security Features

All admin endpoints include:
- JWT token verification
- Admin role checking
- User ownership verification (bookings)
- Error handling and logging

All user endpoints include:
- JWT token verification
- User ownership verification
- Proper error responses

## 📝 Database Notes

The system uses these database tables:
- `users` - Now includes `role` field (admin/user)
- `bookings` - Stores all customer appointments
- `services` - Manages available salon services

### Required Unique Constraint
Make sure your `users` table has this index:
```sql
ALTER TABLE users ADD UNIQUE INDEX uq_users_email (email);
```

## 🚀 Next Steps

1. ✅ Backend API endpoints created
2. ✅ Frontend pages created
3. **→ Set admin user in database** (see SQL above)
4. **→ Test the system**
5. (Optional) Add filters/search to admin dashboard
6. (Optional) Add editing capabilities for services
7. (Optional) Add user deletion/role management to admin

## 📞 Troubleshooting

**Issue: "Admin access required" error**
- Solution: Make sure the user has `role='admin'` in the database
- Run: `SELECT role FROM users WHERE user_id = YOUR_ID;`

**Issue: Bookings not loading**
- Check console for API errors
- Verify token is in localStorage
- Ensure backend server is running at `http://localhost/tripple-kay-api`

**Issue: "Unauthorized" error on any endpoint**
- Make sure token is valid and not expired
- Logout and login again to get a fresh token

---

**All systems are now ready for testing!** 🎉

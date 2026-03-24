-- XAMPP MySQL local database setup for Tripple Kay Cutts Spa
-- Run this in phpMyAdmin or MySQL CLI after creating database

CREATE DATABASE IF NOT EXISTS tripple_kay;
USE tripple_kay;

-- Users / Admins
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Demo default credentials (admin123@gmail.com/admin) - store hashed password in PHP
-- For local quick test, you can insert plain values then use login logic that checks these

INSERT IGNORE INTO users (name, email, phone, password_hash, role)
VALUES
  ('Admin', 'admin123@gmail.com', '0700000000', '$2y$10$ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdef', 'admin');

-- Services (products)
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration VARCHAR(64) DEFAULT '30 min',
  category VARCHAR(64) DEFAULT 'Haircuts',
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO services (name, description, price, duration, category, popular)
VALUES
  ('Classic Cut', 'Precision haircut with wash and styling', 3500.00, '45 min', 'Haircuts', TRUE),
  ('Premium Fade', 'Modern fade with clean edges and styling', 4500.00, '60 min', 'Haircuts', TRUE),
  ('Beard Sculpt', 'Beard shaping and grooming', 3000.00, '30 min', 'Grooming', FALSE);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  service_id INT NULL,
  order_id VARCHAR(100) NOT NULL,
  customer_name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(30),
  service_name VARCHAR(120),
  date DATE NOT NULL,
  time VARCHAR(16) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status ENUM('pending','paid','cancelled') DEFAULT 'pending',
  payment_method VARCHAR(80) DEFAULT NULL,
  checkout_request_id VARCHAR(150) DEFAULT NULL,
  transaction_receipt VARCHAR(250) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example booking
INSERT IGNORE INTO bookings (order_id, customer_name, email, phone, service_name, date, time, price, payment_status)
VALUES ('ORD-101', 'Jane Doe', 'jane@example.com', '0700123456', 'Classic Cut', '2026-04-01', '14:00', 3500.00, 'pending');

-- Optional: Add admin token table if needed
CREATE TABLE IF NOT EXISTS api_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

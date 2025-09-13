-- Workshop Booking System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS workshop_booking;
USE workshop_booking;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Workshops table
CREATE TABLE workshops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_capacity INT NOT NULL,
    current_bookings INT DEFAULT 0,
    image_url VARCHAR(500),
    category VARCHAR(100),
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workshop_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_workshop (user_id, workshop_id)
);

-- Create indexes for better performance
CREATE INDEX idx_workshops_date ON workshops(date);
CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_workshop ON bookings(workshop_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES 
('admin@workshop.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'admin');

-- Insert sample workshops
INSERT INTO workshops (title, description, instructor, date, start_time, end_time, location, price, max_capacity, category) VALUES
('Web Development Fundamentals', 'Learn the basics of HTML, CSS, and JavaScript', 'John Smith', '2025-10-15', '09:00:00', '17:00:00', 'Conference Room A', 299.99, 20, 'Technology'),
('Digital Marketing Strategy', 'Master digital marketing techniques and tools', 'Sarah Johnson', '2025-10-22', '10:00:00', '16:00:00', 'Training Center', 199.99, 15, 'Marketing'),
('Data Analysis with Python', 'Introduction to data analysis using Python and pandas', 'Mike Davis', '2025-11-05', '09:30:00', '17:30:00', 'Tech Lab', 399.99, 12, 'Technology'),
('Leadership Skills Workshop', 'Develop essential leadership and management skills', 'Emily Brown', '2025-11-12', '09:00:00', '15:00:00', 'Executive Room', 249.99, 25, 'Management');

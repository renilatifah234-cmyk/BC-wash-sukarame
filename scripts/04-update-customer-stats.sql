-- Update customer statistics based on bookings
UPDATE customers 
SET 
  total_bookings = (
    SELECT COUNT(*) 
    FROM bookings 
    WHERE bookings.customer_phone = customers.phone
  ),
  total_loyalty_points = (
    SELECT COALESCE(SUM(loyalty_points_earned), 0) - COALESCE(SUM(loyalty_points_used), 0)
    FROM bookings 
    WHERE bookings.customer_phone = customers.phone
  );

-- Add some additional customers who don't have bookings yet
INSERT INTO customers (id, name, phone, email, vehicle_plate_numbers, total_loyalty_points, total_bookings, join_date) VALUES
('customer-007', 'Budi Hartono', '08555666777', 'budi.hartono@email.com', ARRAY['B 9999 VWX'], 75, 1, '2024-01-10'),
('customer-008', 'Siti Nurhaliza', '08333444555', 'siti.nurhaliza@email.com', ARRAY['BE 4444 YZA'], 45, 1, '2024-01-12'),
('customer-009', 'Dedi Setiawan', '08666777888', 'dedi.setiawan@email.com', ARRAY['BE 6666 BCD'], 30, 1, '2024-01-14'),
('customer-010', 'Lina Marlina', '08999000111', 'lina.marlina@email.com', ARRAY['B 2222 EFG'], 35, 1, '2024-01-16')
ON CONFLICT (id) DO NOTHING;

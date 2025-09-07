-- Seed services data
INSERT INTO services (id, name, category, price, description, duration, features, supports_pickup, pickup_fee) VALUES
-- Car Regular Services
('car-small-regular', 'Cuci Mobil Kecil Non-Hidrolik', 'car-regular', 35000, 'Cuci mobil kecil dengan metode manual tanpa hidrolik', 45, NULL, true, 15000),
('car-large-regular', 'Cuci Mobil Sedang/Besar Non-Hidrolik', 'car-regular', 40000, 'Cuci mobil sedang hingga besar dengan metode manual tanpa hidrolik', 60, NULL, true, 20000),
('car-steam-quick', 'Cuci Steam Cepat', 'car-regular', 30000, 'Cuci cepat menggunakan steam untuk hasil yang bersih', 30, NULL, true, 15000),

-- Car Premium Services
('car-small-premium', 'Cuci Mobil Kecil Hidrolik', 'car-premium', 45000, 'Cuci mobil kecil dengan sistem hidrolik profesional', 60, ARRAY['Gratis 1 Minuman'], true, 20000),
('car-large-premium', 'Cuci Mobil Sedang/Besar Hidrolik', 'car-premium', 50000, 'Cuci mobil sedang hingga besar dengan sistem hidrolik profesional', 75, ARRAY['Gratis 1 Minuman'], true, 25000),
('anti-bacterial', 'Fogging Anti Bakteri', 'car-premium', 75000, 'Layanan fogging untuk membunuh bakteri dan virus di dalam mobil', 30, NULL, true, 30000),
('glass-spot-removal', 'Penghilang Noda Kaca', 'car-premium', 75000, 'Penghilangan noda membandel pada kaca mobil', 45, NULL, true, 25000),

-- Motorcycle Services
('motorcycle-small', 'Cuci Motor Kecil Steam', 'motorcycle', 13000, 'Cuci motor kecil menggunakan steam', 20, NULL, true, 10000),
('motorcycle-medium', 'Cuci Motor Sedang Steam', 'motorcycle', 15000, 'Cuci motor sedang menggunakan steam', 25, NULL, true, 10000),
('motorcycle-large', 'Cuci Motor Besar Steam', 'motorcycle', 18000, 'Cuci motor besar menggunakan steam', 30, NULL, true, 12000)
ON CONFLICT (id) DO NOTHING;

-- Seed branches data
INSERT INTO branches (id, name, address, phone, bank_name, bank_account_number, bank_account_name, operating_hours_open, operating_hours_close, pickup_coverage_radius, status, manager, staff_count) VALUES
('sukarame-main', 'BC Wash Sukarame Utama', 'Jl. Jend. Sudirman No. 1, Kranji, Bekasi Barat', '021-123456', 'BCA', '4061524783', 'Muhamad Akbar Afriansyah', '08:00', '18:00', 10, 'active', 'Muhamad Akbar Afriansyah', 8),
('sukarame-branch2', 'BC Wash Sukarame Cabang 2', 'Jl. Pulo Ribung Raya No. 100, Pekayon Jaya, Bekasi Selatan', '021-654321', 'BRI', '084101037308530', 'Muhamad Akbar Afriansyah', '08:00', '18:00', 8, 'active', 'Muhamad Akbar Afriansyah', 6),
('sukarame-branch3', 'BC Wash Sukarame Cabang 3', 'Jl. Cut Mutia No. 50, Margahayu, Bekasi Timur', '021-111222', 'BRI', '1122334455', 'BC Wash Sukarame Cab 3', '08:00', '18:00', 12, 'inactive', 'Akbar', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, name, phone, email, vehicle_plate_numbers, total_loyalty_points, total_bookings, join_date) VALUES
('customer-001', 'Ahmad Rizki', '08123456789', 'ahmad.rizki@email.com', ARRAY['B 1234 ABC', 'B 5678 DEF'], 150, 8, '2023-06-15'),
('customer-002', 'Sari Dewi', '08987654321', 'sari.dewi@email.com', ARRAY['BE 9876 XYZ'], 75, 4, '2023-08-20'),
('customer-003', 'Joko Susilo', '08111222333', 'joko.susilo@email.com', ARRAY['BE 5555 GHI', 'B 7777 JKL'], 320, 15, '2023-03-10'),
('customer-004', 'Maya Putri', '08444555666', 'maya.putri@email.com', ARRAY['BE 1111 MNO'], 45, 2, '2023-12-05'),
('customer-005', 'Andi Wijaya', '08777888999', 'andi.wijaya@email.com', ARRAY['B 3333 PQR'], 180, 9, '2023-07-22'),
('customer-006', 'Rina Sari', '08222333444', 'rina.sari@email.com', ARRAY['BE 8888 STU'], 95, 5, '2023-09-18')
ON CONFLICT (id) DO NOTHING;

-- Seed bookings data
INSERT INTO bookings (id, booking_code, customer_name, customer_phone, customer_email, service_id, branch_id, booking_date, booking_time, total_price, status, is_pickup_service, pickup_address, pickup_notes, vehicle_plate_number, loyalty_points_earned, loyalty_points_used, booking_source, created_by_admin, payment_method, notes, created_at, updated_at) VALUES
('booking-001', 'BCW001', 'Ahmad Rizki', '08123456789', 'ahmad.rizki@email.com', 'car-small-premium', 'sukarame-main', '2024-01-15', '10:00', 45000, 'confirmed', false, NULL, NULL, 'B 1234 ABC', 45, 0, 'online', false, 'transfer', NULL, '2024-01-14T10:00:00Z', '2024-01-14T10:30:00Z'),

('booking-002', 'BCW002', 'Sari Dewi', '08987654321', 'sari.dewi@email.com', 'motorcycle-medium', 'sukarame-branch2', '2024-01-15', '14:00', 25000, 'pending', true, 'Jl. Raden Intan No. 789, Bandar Lampung', 'Rumah cat hijau, pagar putih', 'BE 9876 XYZ', 25, 0, 'online', false, 'transfer', NULL, '2024-01-14T14:00:00Z', '2024-01-14T14:00:00Z'),

('booking-003', 'BCW003', 'Joko Susilo', '08111222333', 'joko.susilo@email.com', 'car-large-regular', 'sukarame-main', '2024-01-16', '09:00', 40000, 'completed', false, NULL, NULL, 'BE 5555 GHI', 40, 0, 'offline', true, 'cash', 'Walk-in customer, paid cash', '2024-01-16T08:30:00Z', '2024-01-16T10:15:00Z'),

('booking-004', 'BCW004', 'Maya Putri', '08444555666', 'maya.putri@email.com', 'anti-bacterial', 'sukarame-main', '2024-01-16', '11:30', 75000, 'in-progress', false, NULL, NULL, 'BE 1111 MNO', 75, 0, 'online', false, 'qris', NULL, '2024-01-16T09:00:00Z', '2024-01-16T11:30:00Z'),

('booking-005', 'BCW005', 'Andi Wijaya', '08777888999', 'andi.wijaya@email.com', 'motorcycle-small', 'sukarame-branch2', '2024-01-16', '15:00', 23000, 'cancelled', true, 'Jl. Ahmad Yani No. 456, Bandar Lampung', 'Komplek perumahan, blok C no. 12', 'B 3333 PQR', 0, 0, 'online', false, 'transfer', 'Customer cancelled due to rain', '2024-01-15T12:00:00Z', '2024-01-16T08:00:00Z'),

('booking-006', 'BCW006', 'Rina Sari', '08222333444', 'rina.sari@email.com', 'car-large-premium', 'sukarame-branch2', '2024-01-17', '08:30', 50000, 'confirmed', false, NULL, NULL, 'BE 8888 STU', 50, 0, 'online', false, 'transfer', NULL, '2024-01-16T15:30:00Z', '2024-01-16T16:00:00Z'),

('booking-007', 'BCW007', 'Budi Hartono', '08555666777', 'budi.hartono@email.com', 'glass-spot-removal', 'sukarame-main', '2024-01-17', '10:00', 75000, 'confirmed', false, NULL, NULL, 'B 9999 VWX', 75, 0, 'offline', true, 'cash', 'Regular customer, requested specific staff member', '2024-01-17T07:00:00Z', '2024-01-17T07:15:00Z'),

('booking-008', 'BCW008', 'Siti Nurhaliza', '08333444555', 'siti.nurhaliza@email.com', 'car-steam-quick', 'sukarame-branch2', '2024-01-17', '13:00', 45000, 'picked-up', true, 'Jl. Diponegoro No. 123, Bandar Lampung', 'Kantor, gedung biru lantai 2', 'BE 4444 YZA', 45, 0, 'online', false, 'transfer', NULL, '2024-01-17T08:30:00Z', '2024-01-17T08:30:00Z'),

('booking-009', 'BCW009', 'Dedi Setiawan', '08666777888', 'dedi.setiawan@email.com', 'motorcycle-large', 'sukarame-main', '2024-01-17', '16:30', 30000, 'completed', true, 'Jl. Gatot Subroto No. 789, Bandar Lampung', 'Rumah sudut, cat kuning', 'BE 6666 BCD', 30, 0, 'offline', true, 'card', 'Customer paid with debit card, service completed on time', '2024-01-17T14:00:00Z', '2024-01-17T17:00:00Z'),

('booking-010', 'BCW010', 'Lina Marlina', '08999000111', 'lina.marlina@email.com', 'car-small-regular', 'sukarame-branch2', '2024-01-18', '09:30', 35000, 'confirmed', false, NULL, NULL, 'B 2222 EFG', 35, 0, 'online', false, 'transfer', NULL, '2024-01-17T18:00:00Z', '2024-01-17T18:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- Removed sequence update commands since tables use TEXT primary keys, not auto-incrementing sequences

//Company Roles (only the original 3)
INSERT INTO company_roles (company_role_id, company_role_name) VALUES
(1, 'Admin'),
(2, 'Employee'),
(3, 'Manager')
ON DUPLICATE KEY UPDATE company_role_name = VALUES(company_role_name);

//Employees (15 records)
INSERT INTO employee (employee_email, employee_active_status) VALUES
('john.doe@abiegaraj.com', 1),
('jane.smith@abiegaraj.com', 1),
('mike.johnson@abiegaraj.com', 1),
('sarah.williams@abiegaraj.com', 1),
('david.brown@abiegaraj.com', 0),
('lisa.jones@abiegaraj.com', 1),
('robert.garcia@abiegaraj.com', 1),
('emily.miller@abiegaraj.com', 1),
('william.davis@abiegaraj.com', 1),
('olivia.rodriguez@abiegaraj.com', 0),
('james.wilson@abiegaraj.com', 1),
('sophia.martinez@abiegaraj.com', 1),
('benjamin.anderson@abiegaraj.com', 1),
('ava.taylor@abiegaraj.com', 1),
('ethan.thomas@abiegaraj.com', 1);

//Employee Info (15 records)
INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES
(1, 'John', 'Doe', '555-0101'),
(2, 'Jane', 'Smith', '555-0102'),
(3, 'Mike', 'Johnson', '555-0103'),
(4, 'Sarah', 'Williams', '555-0104'),
(5, 'David', 'Brown', '555-0105'),
(6, 'Lisa', 'Jones', '555-0106'),
(7, 'Robert', 'Garcia', '555-0107'),
(8, 'Emily', 'Miller', '555-0108'),
(9, 'William', 'Davis', '555-0109'),
(10, 'Olivia', 'Rodriguez', '555-0110'),
(11, 'James', 'Wilson', '555-0111'),
(12, 'Sophia', 'Martinez', '555-0112'),
(13, 'Benjamin', 'Anderson', '555-0113'),
(14, 'Ava', 'Taylor', '555-0114'),
(15, 'Ethan', 'Thomas', '555-0115');

//Employee Passwords (15 records)
INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES
(1, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(4, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(6, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(7, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(8, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(9, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(10, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(11, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(12, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(13, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(14, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(15, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

//Employee Roles (15 records - using only original 3 roles)
INSERT INTO employee_role (employee_id, company_role_id) VALUES
(1, 1), (2, 3), (3, 2), (4, 2), (5, 2),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 3), (12, 2), (13, 2), (14, 2), (15, 2);

//Customers (15 records)
INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES
('customer1@gmail.com', '555-0201', 'a1b2c3d4e5'),
('customer2@gmail.com', '555-0202', 'f6g7h8i9j0'),
('customer3@gmail.com', '555-0203', 'k1l2m3n4o5'),
('customer4@gmail.com', '555-0204', 'p6q7r8s9t0'),
('customer5@gmail.com', '555-0205', 'u1v2w3x4y5'),
('customer6@gmail.com', '555-0206', 'z6a7b8c9d0'),
('customer7@gmail.com', '555-0207', 'e1f2g3h4i5'),
('customer8@gmail.com', '555-0208', 'j6k7l8m9n0'),
('customer9@gmail.com', '555-0209', 'o1p2q3r4s5'),
('customer10@gmail.com', '555-0210', 't6u7v8w9x0'),
('customer11@gmail.com', '555-0211', 'y1z2a3b4c5'),
('customer12@gmail.com', '555-0212', 'd6e7f8g9h0'),
('customer13@gmail.com', '555-0213', 'i1j2k3l4m5'),
('customer14@gmail.com', '555-0214', 'n6o7p8q9r0'),
('customer15@gmail.com', '555-0215', 's1t2u3v4w5');

//Customer Info (15 records)
INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, customer_active_status) VALUES
(1, 'Robert', 'Wilson', 1),
(2, 'Emily', 'Davis', 1),
(3, 'Michael', 'Taylor', 1),
(4, 'Jessica', 'Anderson', 1),
(5, 'Daniel', 'Thomas', 0),
(6, 'Jennifer', 'Jackson', 1),
(7, 'Christopher', 'White', 1),
(8, 'Amanda', 'Harris', 1),
(9, 'Matthew', 'Martin', 1),
(10, 'Ashley', 'Thompson', 0),
(11, 'Joshua', 'Garcia', 1),
(12, 'Stephanie', 'Martinez', 1),
(13, 'Andrew', 'Robinson', 1),
(14, 'Nicole', 'Clark', 1),
(15, 'Kevin', 'Rodriguez', 1);

//Customer Vehicles (20 records)
INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial_number, vehicle_color) VALUES
(1, 2018, 'Toyota', 'Camry', 'Sedan', 45000, 'ABC123', 'JT2BF22K8W0123456', 'Silver'),
(1, 2020, 'Honda', 'CR-V', 'SUV', 22000, 'DEF456', '5J6RE4H43L0123456', 'Black'),
(2, 2015, 'Ford', 'F-150', 'Truck', 78000, 'GHI789', '1FTFW1ET5EF012345', 'Red'),
(3, 2019, 'Chevrolet', 'Malibu', 'Sedan', 32000, 'JKL012', '1G1ZD5ST7KF012345', 'Blue'),
(4, 2017, 'Nissan', 'Rogue', 'SUV', 51000, 'MNO345', '5N1AT2MV7HC012345', 'White'),
(5, 2021, 'Hyundai', 'Elantra', 'Sedan', 15000, 'PQR678', 'KMHDH4AE3MU012345', 'Gray'),
(6, 2016, 'Jeep', 'Wrangler', 'SUV', 65000, 'STU901', '1C4BJWFG6GL012345', 'Green'),
(7, 2018, 'Subaru', 'Outback', 'Wagon', 42000, 'VWX234', '4S4BSANC8J3123456', 'Blue'),
(8, 2020, 'Volkswagen', 'Golf', 'Hatchback', 18000, 'YZA567', '3VW5T7AU9LM012345', 'Red'),
(9, 2019, 'BMW', 'X5', 'SUV', 35000, 'BCD890', '5UXCR6C56K9L12345', 'Black'),
(10, 2014, 'Mercedes', 'C-Class', 'Sedan', 88000, 'EFG123', 'WDDWF5EB4ER123456', 'Silver'),
(11, 2022, 'Tesla', 'Model 3', 'Sedan', 8000, 'HIJ456', '5YJ3E1EB1NF123456', 'White'),
(12, 2017, 'Audi', 'A4', 'Sedan', 48000, 'KLM789', 'WAUBNBF44HA123456', 'Gray'),
(13, 2016, 'Lexus', 'RX 350', 'SUV', 52000, 'NOP012', '2T2HZMDA9GC123456', 'Red'),
(14, 2020, 'Mazda', 'CX-5', 'SUV', 25000, 'QRS345', 'JM3KFBDM9L0123456', 'Blue'),
(15, 2018, 'Kia', 'Sorento', 'SUV', 41000, 'TUV678', '5XYKT4A68JG123456', 'Black'),
(3, 2015, 'Toyota', 'Tacoma', 'Truck', 65000, 'WXY901', '5TFNY5F11BX123456', 'White'),
(6, 2021, 'Ford', 'Mustang', 'Coupe', 12000, 'ZAB234', '1FA6P8CF9M5123456', 'Red'),
(9, 2017, 'Honda', 'Accord', 'Sedan', 57000, 'CDE567', '1HGCR2F73HA123456', 'Silver'),
(12, 2019, 'Volvo', 'XC60', 'SUV', 38000, 'FGH890', 'YV4A22PK5K1123456', 'Blue');

//Common Services (15 records)
INSERT INTO common_services (service_name, service_description) VALUES
('Oil Change', 'Standard oil and filter change'),
('Tire Rotation', 'Rotating tires for even wear'),
('Brake Inspection', 'Complete brake system inspection'),
('Brake Pad Replacement', 'Replace front and/or rear brake pads'),
('Battery Replacement', 'Remove and install new battery'),
('Engine Diagnostic', 'Computer diagnostic for check engine light'),
('Transmission Service', 'Transmission fluid change'),
('Coolant Flush', 'Complete coolant system flush'),
('Air Filter Replacement', 'Engine air filter replacement'),
('Wheel Alignment', 'Four-wheel alignment'),
('Spark Plug Replacement', 'Replace all spark plugs'),
('Timing Belt Replacement', 'Replace timing belt and components'),
('AC Recharge', 'Recharge air conditioning system'),
('Fuel System Cleaning', 'Complete fuel system cleaning'),
('Differential Service', 'Differential fluid change');

//Orders (20 records)
INSERT INTO orders (customer_id, employee_id, vehicle_id, order_status) VALUES
(1, 3, 1, 'completed'),
(2, 6, 3, 'in_progress'),
(3, 3, 4, 'pending'),
(4, 6, 5, 'completed'),
(5, 3, 6, 'cancelled'),
(6, 6, 7, 'in_progress'),
(7, 3, 8, 'completed'),
(8, 6, 9, 'pending'),
(1, 3, 2, 'completed'),
(2, 6, 3, 'in_progress'),
(9, 7, 10, 'completed'),
(10, 8, 11, 'pending'),
(11, 9, 12, 'completed'),
(12, 10, 13, 'in_progress'),
(13, 11, 14, 'completed'),
(14, 12, 15, 'pending'),
(15, 13, 16, 'completed'),
(3, 14, 17, 'in_progress'),
(6, 15, 18, 'completed'),
(9, 3, 19, 'pending');

//Order Info (20 records)
INSERT INTO order_info (order_id, order_total_price, order_estimated_completion_date, order_completion_date, order_additional_requests) VALUES
(1, 89.99, '2023-05-15 16:00:00', '2023-05-15 15:45:00', 'Customer requested synthetic oil'),
(2, 245.50, '2023-05-16 17:00:00', NULL, 'Check for vibration at highway speeds'),
(3, 59.99, '2023-05-17 11:00:00', NULL, NULL),
(4, 129.99, '2023-05-14 14:00:00', '2023-05-14 13:30:00', NULL),
(5, 75.00, '2023-05-18 10:00:00', NULL, 'Customer cancelled appointment'),
(6, 199.99, '2023-05-16 15:30:00', NULL, 'Customer will wait in lobby'),
(7, 89.99, '2023-05-13 12:00:00', '2023-05-13 11:45:00', NULL),
(8, 159.99, '2023-05-17 09:00:00', NULL, 'Needs loaner car if work takes more than 2 hours'),
(9, 49.99, '2023-05-15 13:00:00', '2023-05-15 12:30:00', NULL),
(10, 299.99, '2023-05-16 16:30:00', NULL, 'Check all fluids'),
(11, 189.99, '2023-05-18 14:00:00', '2023-05-18 13:20:00', 'Customer requested premium oil'),
(12, 349.99, '2023-05-19 10:30:00', NULL, 'Needs new tires - waiting on delivery'),
(13, 99.99, '2023-05-20 11:00:00', '2023-05-20 10:15:00', NULL),
(14, 229.99, '2023-05-21 15:00:00', NULL, 'Check engine light is on'),
(15, 79.99, '2023-05-22 09:30:00', '2023-05-22 09:00:00', NULL),
(16, 399.99, '2023-05-23 13:30:00', NULL, 'Major service - customer will drop off'),
(17, 119.99, '2023-05-24 16:00:00', '2023-05-24 15:30:00', NULL),
(18, 279.99, '2023-05-25 10:00:00', NULL, 'Diagnose AC issue'),
(19, 89.99, '2023-05-26 14:30:00', '2023-05-26 14:00:00', NULL),
(20, 169.99, '2023-05-27 11:30:00', NULL, 'Check brakes and alignment');

//Order Services (30 records)
INSERT INTO order_services (order_id, service_id, service_completed) VALUES
(1, 1, 1), (1, 2, 1),
(2, 3, 0), (2, 4, 0),
(3, 1, 0),
(4, 1, 1), (4, 2, 1), (4, 9, 1),
(5, 1, 0),
(6, 7, 0), (6, 8, 0),
(7, 1, 1), (7, 2, 1),
(8, 6, 0),
(9, 1, 1),
(10, 3, 0), (10, 4, 0), (10, 10, 0),
(11, 1, 1), (11, 2, 1), (11, 9, 1),
(12, 10, 0), (12, 14, 0),
(13, 1, 1), (13, 5, 1),
(14, 6, 0),
(15, 1, 1), (15, 2, 1),
(16, 7, 0), (16, 8, 0), (16, 12, 0),
(17, 1, 1),
(18, 13, 0),
(19, 1, 1), (19, 2, 1),
(20, 3, 0), (20, 10, 0);

//Order Status (20 records)
INSERT INTO order_status (order_id, order_status) VALUES
(1, 3), (2, 2), (3, 1), (4, 3), (5, 4),
(6, 2), (7, 3), (8, 1), (9, 3), (10, 2),
(11, 3), (12, 2), (13, 3), (14, 2), (15, 3),
(16, 1), (17, 3), (18, 2), (19, 3), (20, 1);
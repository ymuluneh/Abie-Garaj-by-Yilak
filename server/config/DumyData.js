-- Insert Company Roles
INSERT INTO `company_roles` (`company_role_id`, `company_role_name`) VALUES
(1, 'Admin'),
(2, 'Employee'),
(3, 'Manager');

-- Insert Employees (5 employees)
INSERT INTO `employee` (`employee_id`, `employee_email`, `employee_active_status`) VALUES
(1, 'john.doe@abiegaraj.com', 1),
(2, 'jane.smith@abiegaraj.com', 1),
(3, 'mike.johnson@abiegaraj.com', 1),
(4, 'sarah.wilson@abiegaraj.com', 0),
(5, 'robert.brown@abiegaraj.com', 1);

-- Insert Employee Info
INSERT INTO `employee_info` (`employee_info_id`, `employee_id`, `employee_first_name`, `employee_last_name`, `employee_phone`) VALUES
(1, 1, 'John', 'Doe', '555-1001'),
(2, 2, 'Jane', 'Smith', '555-1002'),
(3, 3, 'Mike', 'Johnson', '555-1003'),
(4, 4, 'Sarah', 'Wilson', '555-1004'),
(5, 5, 'Robert', 'Brown', '555-1005');

-- Insert Employee Passwords
INSERT INTO `employee_pass` (`employee_pass_id`, `employee_id`, `employee_password_hashed`) VALUES
(1, 1, '$2y$10$E2Z6.1dL2k8F0L0Jc8q1.uJz0e8q0Z0e8q0Z0e8q0Z0e8q0Z0e8q0Z0'),
(2, 2, '$2y$10$E2Z6.1dL2k8F0L0Jc8q1.uJz0e8q0Z0e8q0Z0e8q0Z0e8q0Z0e8q0Z0'),
(3, 3, '$2y$10$E2Z6.1dL2k8F0L0Jc8q1.uJz0e8q0Z0e8q0Z0e8q0Z0e8q0Z0e8q0Z0'),
(4, 4, '$2y$10$E2Z6.1dL2k8F0L0Jc8q1.uJz0e8q0Z0e8q0Z0e8q0Z0e8q0Z0e8q0Z0'),
(5, 5, '$2y$10$E2Z6.1dL2k8F0L0Jc8q1.uJz0e8q0Z0e8q0Z0e8q0Z0e8q0Z0e8q0Z0');

-- Assign Roles
INSERT INTO `employee_role` (`employee_role_id`, `employee_id`, `company_role_id`) VALUES
(1, 1, 1),  -- John = Admin
(2, 2, 3),  -- Jane = Manager
(3, 3, 2),  -- Mike = Employee
(4, 4, 2),  -- Sarah = Employee
(5, 5, 2);  -- Robert = Employee

-- Insert Customers (10 customers)
INSERT INTO `customer_identifier` (`customer_id`, `customer_email`, `customer_phone_number`, `customer_hash`) VALUES
(1, 'customer1@email.com', '555-2001', 'hash1'),
(2, 'customer2@email.com', '555-2002', 'hash2'),
(3, 'customer3@email.com', '555-2003', 'hash3'),
(4, 'customer4@email.com', '555-2004', 'hash4'),
(5, 'customer5@email.com', '555-2005', 'hash5'),
(6, 'customer6@email.com', '555-2006', 'hash6'),
(7, 'customer7@email.com', '555-2007', 'hash7'),
(8, 'customer8@email.com', '555-2008', 'hash8'),
(9, 'customer9@email.com', '555-2009', 'hash9'),
(10, 'customer10@email.com', '555-2010', 'hash10');

-- Insert Customer Info
INSERT INTO `customer_info` (`customer_info_id`, `customer_id`, `customer_first_name`, `customer_last_name`, `customer_active_status`) VALUES
(1, 1, 'Alice', 'Johnson', 1),
(2, 2, 'Bob', 'Williams', 1),
(3, 3, 'Charlie', 'Davis', 1),
(4, 4, 'Diana', 'Miller', 1),
(5, 5, 'Ethan', 'Taylor', 0),
(6, 6, 'Fiona', 'Anderson', 1),
(7, 7, 'George', 'Thomas', 1),
(8, 8, 'Hannah', 'Jackson', 1),
(9, 9, 'Ian', 'White', 1),
(10, 10, 'Jessica', 'Harris', 1);

-- Insert Vehicles (12 vehicles)
INSERT INTO `customer_vehicle_info` (`vehicle_id`, `customer_id`, `vehicle_year`, `vehicle_make`, `vehicle_model`, `vehicle_type`, `vehicle_mileage`, `vehicle_tag`, `vehicle_serial_number`, `vehicle_color`) VALUES
(1, 1, 2020, 'Toyota', 'Camry', 'Sedan', 35000, 'ABC123', '1HGBH41JXMN109186', 'Blue'),
(2, 1, 2018, 'Honda', 'CR-V', 'SUV', 42000, 'DEF456', '5XYZH4AG4JH012345', 'Silver'),
(3, 2, 2022, 'Ford', 'F-150', 'Truck', 15000, 'GHI789', '1FTFW1ET0EFC12345', 'Black'),
(4, 2, 2019, 'Chevrolet', 'Malibu', 'Sedan', 38000, 'JKL012', '3GCPKSE79BG100001', 'White'),
(5, 3, 2021, 'Tesla', 'Model 3', 'Sedan', 22000, 'MNO345', '5YJ3E1EA0MF000001', 'Red'),
(6, 4, 2017, 'Nissan', 'Rogue', 'SUV', 55000, 'PQR678', '5N1AT2MV6HC800001', 'Gray'),
(7, 5, 2020, 'BMW', 'X5', 'SUV', 30000, 'STU901', '5UXCR6C0XLG000001', 'Black'),
(8, 6, 2015, 'Hyundai', 'Elantra', 'Sedan', 68000, 'VWX234', 'KMHDH4AE3FU000001', 'Green'),
(9, 7, 2023, 'Kia', 'Sportage', 'SUV', 5000, 'YZA567', 'KNDPMCAC5P7000001', 'Blue'),
(10, 8, 2019, 'Subaru', 'Outback', 'Wagon', 49000, 'BCD890', '4S4BSANC0K3200001', 'Brown'),
(11, 9, 2021, 'Mazda', 'CX-5', 'SUV', 26000, 'EFG123', 'JM3KFBDM0M0500001', 'Red'),
(12, 10, 2018, 'Volkswagen', 'Golf', 'Hatchback', 71000, 'HIJ456', '3VW2K7AJ1JM000001', 'White');

-- Insert Common Services
INSERT INTO `common_services` (`service_id`, `service_name`, `service_description`, `service_price`) VALUES
(1, 'Oil Change', 'Full synthetic oil change with filter replacement', 49.99),
(2, 'Tire Rotation', 'Tire rotation and pressure check', 29.99),
(3, 'Brake Service', 'Brake pad replacement and rotor inspection', 149.99),
(4, 'Battery Replacement', 'Car battery replacement and testing', 129.99),
(5, 'AC Recharge', 'Air conditioning system recharge', 89.99),
(6, 'Engine Diagnostic', 'Computer diagnostic service', 79.99),
(7, 'Transmission Flush', 'Full transmission fluid replacement', 159.99);

-- Insert Orders (10 orders)
INSERT INTO `orders` (`order_id`, `customer_id`, `employee_id`, `vehicle_id`, `order_status`) VALUES
(1, 1, 2, 1, 'in-progress'),
(2, 2, 3, 3, 'completed'),
(3, 3, 2, 5, 'pending'),
(4, 4, 3, 6, 'completed'),
(5, 5, 4, 7, 'cancelled'),
(6, 6, 3, 8, 'in-progress'),
(7, 7, 5, 9, 'pending'),
(8, 8, 5, 10, 'completed'),
(9, 9, 3, 11, 'in-progress'),
(10, 10, 4, 12, 'pending');

-- Insert Order Info
INSERT INTO `order_info` (`order_info_id`, `order_id`, `order_total_price`, `order_estimated_completion_date`, `order_completion_date`, `order_additional_requests`) VALUES
(1, 1, 129.98, '2023-10-15 14:00:00', NULL, 'Check tire pressure'),
(2, 2, 179.98, '2023-10-10 11:00:00', '2023-10-10 10:45:00', 'Clean interior after service'),
(3, 3, 79.99, '2023-10-18 16:00:00', NULL, NULL),
(4, 4, 239.98, '2023-10-08 13:00:00', '2023-10-08 12:30:00', 'Urgent - need car by 1 PM'),
(5, 5, 89.99, '2023-10-05 15:00:00', NULL, NULL),
(6, 6, 209.97, '2023-10-17 10:00:00', NULL, 'Check brake fluid'),
(7, 7, 49.99, '2023-10-19 09:00:00', NULL, 'Use synthetic oil'),
(8, 8, 309.97, '2023-10-07 12:00:00', '2023-10-07 11:20:00', 'Detailed wash requested'),
(9, 9, 159.99, '2023-10-16 15:00:00', NULL, NULL),
(10, 10, 99.98, '2023-10-20 11:00:00', NULL, 'Check for unusual noises');

-- Insert Order Services
INSERT INTO `order_services` (`order_service_id`, `order_id`, `service_id`, `service_completed`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 0),
(3, 2, 3, 1),
(4, 2, 4, 1),
(5, 3, 6, 0),
(6, 4, 1, 1),
(7, 4, 7, 1),
(8, 5, 5, 0),
(9, 6, 1, 1),
(10, 6, 3, 0),
(11, 6, 6, 0),
(12, 7, 1, 0),
(13, 8, 1, 1),
(14, 8, 2, 1),
(15, 8, 7, 1),
(16, 9, 7, 0),
(17, 10, 1, 0),
(18, 10, 5, 0);

-- Insert Order Status
INSERT INTO `order_status` (`order_status_id`, `order_id`, `order_status`) VALUES
(1, 1, 2),
(2, 2, 3),
(3, 3, 1),
(4, 4, 3),
(5, 5, 4),
(6, 6, 2),
(7, 7, 1),
(8, 8, 3),
(9, 9, 2),
(10, 10, 1);
-- 1. Dummy Data for `employee`
INSERT INTO `employee` (`employee_id`, `employee_email`, `employee_active_status`, `employee_added_date`) VALUES
(1, 'alice.smith@abiegaraj.com', 1, '2024-01-10 09:00:00'),
(2, 'bob.johnson@abiegaraj.com', 1, '2024-02-15 10:30:00'),
(3, 'charlie.brown@abiegaraj.com', 1, '2024-03-20 11:45:00'),
(4, 'diana.prince@abiegaraj.com', 1, '2024-04-01 08:00:00'),
(5, 'yilakmuluneh@gmail.com', 1, '2024-05-05 13:15:00')
ON DUPLICATE KEY UPDATE employee_email=VALUES(employee_email);

-- 2. Dummy Data for `employee_info`
INSERT INTO `employee_info` (`employee_info_id`, `employee_id`, `employee_first_name`, `employee_last_name`, `employee_phone`) VALUES
(1, 1, 'Alice', 'Smith', '251911234567'),
(2, 2, 'Bob', 'Johnson', '251922345678'),
(3, 3, 'Charlie', 'Brown', '251933456789'),
(4, 4, 'Diana', 'Prince', '251944567890'),
(5, 5, 'yilak', 'muluneh', '251955678901')
ON DUPLICATE KEY UPDATE employee_first_name=VALUES(employee_first_name);

-- 3. Dummy Data for `employee_pass`
INSERT INTO `employee_pass` (`employee_pass_id`, `employee_id`, `employee_password_hashed`) VALUES
(1, 1, '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890/hash1'),
(2, 2, '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890/hash2'),
(3, 3, '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890/hash3'),
(4, 4, '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890/hash4'),
(5, 5, '12345678')
ON DUPLICATE KEY UPDATE employee_password_hashed=VALUES(employee_password_hashed);

-- 4. Dummy Data for `company_roles`
INSERT INTO `company_roles` (`company_role_id`, `company_role_name`) VALUES
(1, 'Admin'),
(2, 'Employee'),
(3, 'Manager')
ON DUPLICATE KEY UPDATE company_role_name = VALUES(company_role_name);

-- 5. Dummy Data for `employee_role`
INSERT INTO `employee_role` (`employee_role_id`, `employee_id`, `company_role_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 2)
ON DUPLICATE KEY UPDATE company_role_id=VALUES(company_role_id);

-- 6. Dummy Data for `customer_identifier`
INSERT INTO `customer_identifier` (`customer_id`, `customer_email`, `customer_phone_number`, `customer_added_date`, `customer_hash`) VALUES
(1, 'customer1@example.com', '251966123456', '2025-01-20 14:00:00', 'hash_customer_1'),
(2, 'customer2@example.com', '251966234567', '2025-02-01 10:15:00', 'hash_customer_2'),
(3, 'customer3@example.com', '251966345678', '2025-03-10 16:30:00', 'hash_customer_3')
ON DUPLICATE KEY UPDATE customer_email=VALUES(customer_email);

-- 7. Dummy Data for `customer_info`
INSERT INTO `customer_info` (`customer_info_id`, `customer_id`, `customer_first_name`, `customer_last_name`, `customer_active_status`) VALUES
(1, 1, 'John', 'Doe', 1),
(2, 2, 'Jane', 'Miller', 1),
(3, 3, 'Peter', 'Jones', 1)
ON DUPLICATE KEY UPDATE customer_first_name=VALUES(customer_first_name);

-- 8. Dummy Data for `customer_vehicle_info`
INSERT INTO `customer_vehicle_info` (`vehicle_id`, `customer_id`, `vehicle_year`, `vehicle_make`, `vehicle_model`, `vehicle_type`, `vehicle_mileage`, `vehicle_tag`, `vehicle_serial_number`, `vehicle_color`) VALUES
(1, 1, 2018, 'Toyota', 'Corolla', 'Sedan', 85000, 'AA-12345', 'VIN12345ABCDE', 'Silver'),
(2, 2, 2020, 'Honda', 'CRV', 'SUV', 45000, 'BB-67890', 'VIN67890FGHIJ', 'Blue'),
(3, 3, 2015, 'Mercedes-Benz', 'C-Class', 'Sedan', 120000, 'CC-11223', 'VIN11223KLMNO', 'Black')
ON DUPLICATE KEY UPDATE vehicle_make=VALUES(vehicle_make);

-- 9. Dummy Data for `common_services`
INSERT INTO `common_services` (`service_id`, `service_name`, `service_description`, `service_price`, `is_active`) VALUES
(1, 'Oil Change', 'Standard engine oil and filter replacement.', 850.00, 1),
(2, 'Tire Rotation', 'Rotate all four tires for even wear.', 300.00, 1),
(3, 'Brake Pad Replacement (Front)', 'Replace front brake pads and inspect system.', 1500.00, 1),
(4, 'Full Diagnostic Check', 'Comprehensive electronic and mechanical system check.', 1000.00, 1),
(5, 'AC Recharge', 'Recharge vehicle air conditioning system with refrigerant.', 700.00, 1)
ON DUPLICATE KEY UPDATE service_name=VALUES(service_name);

-- 10. Dummy Data for `inventory_items` (with item_price)
INSERT INTO `inventory_items` (`item_id`, `item_name`, `item_description`, `unit_of_measure`, `current_quantity`, `minimum_quantity`, `item_price`, `is_active`, `created_at`) VALUES
(1, 'Engine Oil (5W-30)', 'High-performance synthetic engine oil', 'liters', 150.00, 20.00, 350.00, 1, '2025-01-01 10:00:00'),
(2, 'Oil Filter (Type A)', 'Standard oil filter for common sedans', 'pieces', 75.00, 10.00, 250.00, 1, '2025-01-01 10:05:00'),
(3, 'Brake Pads (Front)', 'Ceramic front brake pads', 'sets', 30.00, 5.00, 1200.00, 1, '2025-01-01 10:10:00'),
(4, 'AC Refrigerant (R-134a)', 'Standard automotive refrigerant', 'grams', 5000.00, 500.00, 0.50, 1, '2025-01-01 10:15:00'),
(5, 'Windshield Wiper Blades (22 inch)', 'Standard size wiper blades', 'pieces', 40.00, 8.00, 450.00, 1, '2025-01-01 10:20:00'),
(6, 'Tire Valve Stems', 'Rubber tire valve stems', 'pieces', 200.00, 50.00, 50.00, 1, '2025-01-01 10:25:00')
ON DUPLICATE KEY UPDATE 
  item_name=VALUES(item_name),
  item_price=VALUES(item_price);

-- 11. Dummy Data for `service_inventory`
INSERT INTO `service_inventory` (`service_id`, `item_id`, `quantity_used`) VALUES
(1, 1, 4.5),
(1, 2, 1.0),
(3, 3, 1.0),
(5, 4, 750.0)
ON DUPLICATE KEY UPDATE quantity_used=VALUES(quantity_used);

-- 12. Dummy Data for `orders`
INSERT INTO `orders` (`order_id`, `customer_id`, `employee_id`, `vehicle_id`, `order_date`, `order_status`) VALUES
(1, 1, 1, 1, '2025-07-20 10:00:00', 'completed'),
(2, 2, 2, 2, '2025-07-21 11:30:00', 'pending'),
(3, 3, 3, 3, '2025-07-22 14:00:00', 'completed'),
(4, 1, 1, 1, '2025-07-23 09:30:00', 'pending')
ON DUPLICATE KEY UPDATE order_date=VALUES(order_date);

-- 13. Dummy Data for `order_info`
INSERT INTO `order_info` (`order_info_id`, `order_id`, `order_total_price`, `order_estimated_completion_date`, `order_completion_date`, `order_additional_requests`) VALUES
(1, 1, 850.00, '2025-07-20 12:00:00', '2025-07-20 11:45:00', 'Customer requested full synthetic oil.'),
(2, 2, 300.00, '2025-07-21 13:00:00', NULL, 'Check tire pressure.'),
(3, 3, 1500.00, '2025-07-22 16:00:00', '2025-07-22 15:30:00', 'Customer requested premium pads.'),
(4, 4, 700.00, '2025-07-23 11:00:00', NULL, 'Customer complained of weak AC.')
ON DUPLICATE KEY UPDATE order_total_price=VALUES(order_total_price);

-- 14. Dummy Data for `order_services`
INSERT INTO `order_services` (`order_service_id`, `order_id`, `service_id`, `service_completed`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 0),
(3, 3, 3, 1),
(4, 4, 5, 0)
ON DUPLICATE KEY UPDATE service_id=VALUES(service_id);

-- 15. Dummy Data for `order_status`
INSERT INTO `order_status` (`order_status_id`, `order_id`, `order_status`) VALUES
(1, 1, 1),
(2, 2, 0),
(3, 3, 1),
(4, 4, 0)
ON DUPLICATE KEY UPDATE order_status=VALUES(order_status);

-- 16. Dummy Data for `inventory_transactions`
INSERT INTO `inventory_transactions` (`item_id`, `transaction_type`, `quantity`, `transaction_date`, `employee_id`, `customer_id`, `order_id`, `notes`, `resulting_quantity`) VALUES
(1, 'inward', 150.00, '2025-01-01 10:00:00', 1, NULL, NULL, 'Initial Stock', 150.00),
(2, 'inward', 75.00, '2025-01-01 10:05:00', 1, NULL, NULL, 'Initial Stock', 75.00),
(3, 'inward', 30.00, '2025-01-01 10:10:00', 1, NULL, NULL, 'Initial Stock', 30.00),
(4, 'inward', 5000.00, '2025-01-01 10:15:00', 1, NULL, NULL, 'Initial Stock', 5000.00),
(5, 'inward', 40.00, '2025-01-01 10:20:00', 1, NULL, NULL, 'Initial Stock', 40.00),
(6, 'inward', 200.00, '2025-01-01 10:25:00', 1, NULL, NULL, 'Initial Stock', 200.00),
(1, 'outward', 4.50, '2025-07-20 11:00:00', 1, 1, 1, 'Used in Order ID: 1 (Oil Change)', 145.50),
(2, 'outward', 1.00, '2025-07-20 11:00:00', 1, 1, 1, 'Used in Order ID: 1 (Oil Change)', 74.00),
(3, 'outward', 1.00, '2025-07-22 14:45:00', 3, 3, 3, 'Used in Order ID: 3 (Brake Pad Replacement)', 29.00),
(4, 'outward', 750.00, '2025-07-23 10:00:00', 1, 1, 4, 'Used in Order ID: 4 (AC Recharge)', 4250.00),
(1, 'inward', 50.00, '2025-07-24 09:00:00', 4, NULL, NULL, 'Restock by Manager Diana', 195.50),
(3, 'inward', 10.00, '2025-07-25 10:00:00', 4, NULL, NULL, 'Restock by Manager Diana', 39.00);

-- Update current quantities in inventory
UPDATE `inventory_items` SET `current_quantity` = 195.50 WHERE `item_id` = 1;
UPDATE `inventory_items` SET `current_quantity` = 74.00 WHERE `item_id` = 2;
UPDATE `inventory_items` SET `current_quantity` = 39.00 WHERE `item_id` = 3;
UPDATE `inventory_items` SET `current_quantity` = 4250.00 WHERE `item_id` = 4;
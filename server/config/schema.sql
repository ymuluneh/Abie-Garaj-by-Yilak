CREATE DATABASE IF NOT EXISTS abiegaraj_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE abiegaraj_db;

-- Employee Tables --
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_email` VARCHAR(255) NOT NULL,
  `employee_active_status` INT(11) NOT NULL,
  `employee_added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE (`employee_email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employee_info` (
  `employee_info_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL UNIQUE,
  `employee_first_name` VARCHAR(255),
  `employee_last_name` VARCHAR(255),
  `employee_phone` VARCHAR(255),
  PRIMARY KEY (`employee_info_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employee_pass` (
  `employee_pass_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL UNIQUE,
  `employee_password_hashed` VARCHAR(255),
  PRIMARY KEY (`employee_pass_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `company_roles` (
  `company_role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_role_name` VARCHAR(255),
  PRIMARY KEY (`company_role_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employee_role` (
  `employee_role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL UNIQUE,
  `company_role_id` INT(11) NOT NULL,
  PRIMARY KEY (`employee_role_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`),
  FOREIGN KEY (`company_role_id`) REFERENCES `company_roles`(`company_role_id`)
) ENGINE=InnoDB;


-- Customer Tables --

CREATE TABLE IF NOT EXISTS `customer_identifier` (
  `customer_id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone_number` VARCHAR(255) NOT NULL,
  `customer_added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `customer_hash` VARCHAR(255),
  PRIMARY KEY (`customer_id`),
  UNIQUE (`customer_email`),
  UNIQUE (`customer_phone_number`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `customer_info` (
  `customer_info_id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL UNIQUE,
  `customer_first_name` VARCHAR(255),
  `customer_last_name` VARCHAR(255),
  `customer_active_status` INT(11),
  PRIMARY KEY (`customer_info_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier`(`customer_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `customer_vehicle_info` (
  `vehicle_id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL UNIQUE,
  `vehicle_year` INT(11),
  `vehicle_make` VARCHAR(255),
  `vehicle_model` VARCHAR(255),
  `vehicle_type` VARCHAR(255),
  `vehicle_mileage` INT(11),
  `vehicle_tag` VARCHAR(255),
  `vehicle_serial_number` VARCHAR(255),
  `vehicle_color` VARCHAR(255),
  PRIMARY KEY (`vehicle_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier`(`customer_id`)
) ENGINE=InnoDB;


-- Common Services and Orders --
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL,
  `employee_id` INT(11) NOT NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `order_hash` VARCHAR(255),
  `order_status` VARCHAR(255),
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier`(`customer_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `order_info` (
  `order_info_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL UNIQUE,
  `order_total_price` INT(11),
  `order_estimated_completion_date` DATETIME,
  `order_completion_date` DATETIME,
  `order_additional_requests` VARCHAR(255),
  `order_additional_requests_completed` INT(11),
  PRIMARY KEY (`order_info_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `common_services` (
  `service_id` INT(11) NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(255),
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `order_services` (
  `order_service_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `service_id` INT(11) NOT NULL,
  `service_completed` INT(11),
  PRIMARY KEY (`order_service_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`),
  FOREIGN KEY (`service_id`) REFERENCES `common_services`(`service_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `order_status` (
  `order_status_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL UNIQUE,
  `order_status` INT(11),
  PRIMARY KEY (`order_status_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB;

INSERT INTO company_roles (company_role_id, company_role_name) VALUES
  (1, 'Admin'),
  (2, 'Employee'),
  (3, 'Manager')
ON DUPLICATE KEY UPDATE company_role_name = VALUES(company_role_name);




-- Run this script once before starting your backend server or integrate it in your server start script
-- node dbSetup.js


garage-backend/
├── config/
│   ├── db.js
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── employeeController.js
│   ├── errorController.js
│   ├── orderController.js
│   ├── serviceController.js
│   └── vehicleController.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── customer.js
│   ├── employee.js
│   ├── order.js
│   ├── service.js
│   └── vehicle.js
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── employeeRoutes.js
│   ├── orderRoutes.js
│   ├── serviceRoutes.js
│   └── vehicleRoutes.js
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   └── hashGenerator.js
├── app.js
├
└── package.json


API Documentation
The API follows RESTful principles and includes endpoints for:

Authentication

POST /api/v1/auth/login

Employees (Admin only)

GET /api/v1/employees - Get all employees

POST /api/v1/employees - Create new employee

GET /api/v1/employees/:id - Get single employee

PATCH /api/v1/employees/:id - Update employee

GET /api/v1/employees/roles - Get all roles

Customers

GET /api/v1/customers - Get all customers

POST /api/v1/customers - Create new customer

GET /api/v1/customers/:id - Get single customer

PATCH /api/v1/customers/:id - Update customer

GET /api/v1/customers/:customerId/vehicles - Get customer vehicles

POST /api/v1/customers/:customerId/vehicles - Add vehicle

PATCH /api/v1/customers/:customerId/vehicles/:vehicleId - Update vehicle

Services (Admin and Manager only)

GET /api/v1/services - Get all services

POST /api/v1/services - Create new service

GET /api/v1/services/:id - Get single service

PATCH /api/v1/services/:id - Update service

Orders

GET /api/v1/orders - Get all orders

POST /api/v1/orders - Create new order

GET /api/v1/orders/:id - Get single order

PATCH /api/v1/orders/:id - Update order

PATCH /api/v1/orders/:orderId/services/:serviceId - Update service status

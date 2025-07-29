import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../../components/ProtectedRout/ProtectedRoute";
import {
  getAllOrdersForDashboard,
  getCustomers,
  getAllEmployees,
  getAllVehicles,
  getServices,
} from "../../../../services/api";
import {
  Users,
  Car,
  ClipboardList,
  Wrench,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCcw,
  Home,
  PlusCircle,
  Eye,
  Settings,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

// Import the CSS module
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalEmployees: 0,
    totalCustomers: 0,
    totalVehicles: 0,
    serviceOrderSummary: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          ordersData,
          customersRes,
          employeesData,
          vehiclesData,
          servicesData,
        ] = await Promise.all([
          getAllOrdersForDashboard(),
          getCustomers(1, 99999, ""), // Fetch all customers for dashboard count
          getAllEmployees(),
          getAllVehicles(),
          getServices(),
        ]);

        // console.log("AdminDashboard.jsx: ordersData received:", ordersData);
        // console.log("AdminDashboard.jsx: customersRes received:", customersRes);
        // console.log(
        //   "AdminDashboard.jsx: employeesData received:",
        //   employeesData
        // );
        // console.log("AdminDashboard.jsx: vehiclesData received:", vehiclesData);
        // console.log("AdminDashboard.jsx: servicesData received:", servicesData);

        const allOrders = ordersData || [];
        // Ensure customers are accessed correctly from response.data.customers
        const allCustomers = customersRes.data?.customers || [];
        const allEmployees = employeesData || [];
        const allVehicles = vehiclesData || [];
        const allServices = servicesData || [];

        const serviceOrderMap = {};
        allServices.forEach((service) => {
          serviceOrderMap[service.service_id] = {
            service_name: service.service_name,
            pending: 0,
            in_progress: 0,
            completed: 0,
            cancelled: 0,
          };
        });

        const statusMap = {
          pending: "pending",
          "in progress": "in_progress",
          "in-progress": "in_progress",
          completed: "completed",
          complete: "completed",
          cancelled: "cancelled",
          canceled: "cancelled",
        };

        allOrders.forEach((order) => {
          if (order.services && Array.isArray(order.services)) {
            order.services.forEach((orderService) => {
              const serviceId = orderService.service_id;
              if (serviceOrderMap[serviceId]) {
                const rawStatus = order.order_status
                  ? String(order.order_status).toLowerCase()
                  : "";
                const mappedStatus = statusMap[rawStatus];

                if (
                  mappedStatus &&
                  serviceOrderMap[serviceId][mappedStatus] !== undefined
                ) {
                  serviceOrderMap[serviceId][mappedStatus]++;
                }
              }
            });
          }
        });

        setDashboardData({
          totalOrders: allOrders.length,
          totalEmployees: allEmployees.length,
          // Robustly check for active status (1 or true)
          totalCustomers: allCustomers.filter(
            (cust) =>
              cust.customer_active_status === 1 ||
              cust.customer_active_status === true
          ).length,
          totalVehicles: allVehicles.length,
          serviceOrderSummary: Object.values(serviceOrderMap),
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("you are not authorized to view this page.");
        toast.error("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`${styles.dashboardContainer} ${styles.loadingState}`}>
        <CircularProgress className={styles.circularProgress} size={60} />
        <p className={styles.loadingText}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.dashboardContainer} ${styles.errorState}`}>
        <div className={styles.errorMessage} role="alert">
          <strong className={styles.errorMessageBold}>Error!</strong>
          <span className={styles.errorMessageText}> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={[1]}>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.adminMenuTitle}>ADMIN MENU</div>
          <nav className={styles.sidebarNav}>
            <ul>
          
              <SidebarCategory title="ORDERS" />
              <SidebarLink
                to="/admin/orders"
                icon={<Eye />}
                text="All Orders"
              />
              <SidebarLink
                to="/admin/order"
                icon={<PlusCircle />}
                text="New Order"
              />
              <SidebarCategory title="EMPLOYEES" />
              <SidebarLink
                to="/admin/employees"
                icon={<Eye />}
                text="All Employees"
              />
              <SidebarLink
                to="/admin/add-employee"
                icon={<PlusCircle />}
                text="Add Employee"
              />
              <SidebarCategory title="CUSTOMERS" />
              <SidebarLink
                to="/admin/customers"
                icon={<Eye />}
                text="All Customers"
              />
              <SidebarLink
                to="/admin/add-customer"
                icon={<PlusCircle />}
                text="Add Customer"
              />
              <SidebarCategory title="SERVICES" />
              <SidebarLink
                to="/admin/services"
                icon={<Settings />}
                text="Manage Services"
              />
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.maxWidthContainer}>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>

            {/* Overview Cards */}
            <div className={styles.overviewCardsGrid}>
              <DashboardCard
                icon={<ClipboardList />}
                title="Total Orders"
                value={dashboardData.totalOrders}
                bgColor={styles.bgBlue50}
                textColor={styles.textBlue800}
              />
              <DashboardCard
                icon={<Users />}
                title="Active Customers"
                value={dashboardData.totalCustomers}
                bgColor={styles.bgGreen50}
                textColor={styles.textGreen800}
              />
              <DashboardCard
                icon={<Briefcase />}
                title="Total Employees"
                value={dashboardData.totalEmployees}
                bgColor={styles.bgPurple50}
                textColor={styles.textPurple800}
              />
              <DashboardCard
                icon={<Car />}
                title="Total Vehicles"
                value={dashboardData.totalVehicles}
                bgColor={styles.bgOrange50}
                textColor={styles.textOrange800}
              />
            </div>

            {/* Management Sections Links */}
            <h2 className={styles.managementSectionsTitle}>
              Management Sections
            </h2>
            <div className={styles.managementSectionsGrid}>
              <DashboardActionCard
                title="Service Management"
                description="Configure and manage available services including their prices."
                link="/admin/services"
                linkText="Manage Services"
                icon={<Wrench />}
              />
              <DashboardActionCard
                title="Order Management"
                description="Track existing orders or create new service requests for customers."
                link="/admin/orders"
                linkText="View All Orders"
                secondaryLink="/admin/order"
                secondaryLinkText="Create New Order"
                icon={<FileText />}
              />
              <DashboardActionCard
                title="Employee Management"
                description="Manage employee accounts, roles, and access permissions."
                link="/admin/employees"
                linkText="View All Employees"
                secondaryLink="/admin/add-employee"
                secondaryLinkText="Add New Employee"
                icon={<Users />}
              />
              <DashboardActionCard
                title="Customer Management"
                description="Oversee customer profiles, contact details, and vehicle information."
                link="/admin/customers"
                linkText="View All Customers"
                secondaryLink="/admin/add-customer"
                secondaryLinkText="Add New Customer"
                icon={<Users />}
              />
            </div>

            {/* Order Status by Service Type */}
            <h2 className={styles.orderStatusTitle}>
              Order Status by Service Type
            </h2>
            <div className={styles.orderStatusTableContainer}>
              {dashboardData.serviceOrderSummary.length > 0 ? (
                <div className={styles.overflowXAuto}>
                  <table className={styles.orderStatusTable}>
                    <thead>
                      <tr>
                        <th className={styles.tableHeader}>Service Name</th>
                        <th
                          className={`${styles.tableHeader} ${styles.textCenter}`}
                        >
                          <Clock className={styles.textYellow500} /> Pending
                        </th>
                        <th
                          className={`${styles.tableHeader} ${styles.textCenter}`}
                        >
                          <RefreshCcw className={styles.textBlue500} /> In
                          Progress
                        </th>
                        <th
                          className={`${styles.tableHeader} ${styles.textCenter}`}
                        >
                          <CheckCircle className={styles.textGreen500} />{" "}
                          Completed
                        </th>
                        <th
                          className={`${styles.tableHeader} ${styles.textCenter}`}
                        >
                          <XCircle className={styles.textRed500} /> Cancelled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.serviceOrderSummary.map(
                        (summary, index) => (
                          <tr key={index}>
                            <td
                              className={`${styles.tableCell} ${styles.fontMedium}`}
                            >
                              {summary.service_name}
                            </td>
                            <td
                              className={`${styles.tableCell} ${styles.textCenter}`}
                            >
                              {summary.pending}
                            </td>
                            <td
                              className={`${styles.tableCell} ${styles.textCenter}`}
                            >
                              {summary.in_progress}
                            </td>
                            <td
                              className={`${styles.tableCell} ${styles.textCenter}`}
                            >
                              {summary.completed}
                            </td>
                            <td
                              className={`${styles.tableCell} ${styles.textCenter}`}
                            >
                              {summary.cancelled}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noDataMessage}>
                  No service order data available.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

// Reusable Dashboard Card Component
const DashboardCard = ({ icon, title, value, bgColor, textColor }) => (
  <div className={`${styles.dashboardCard} ${bgColor}`}>
    <div
      className={styles.dashboardCardIconWrapper}
      style={{ backgroundColor: bgColor }}
    >
      {icon}
    </div>
    <div>
      <p className={`${styles.dashboardCardTitle} ${textColor}`}>{title}</p>
      <p className={`${styles.dashboardCardValue} ${textColor}`}>{value}</p>
    </div>
  </div>
);

// Reusable Dashboard Action Card Component
const DashboardActionCard = ({
  icon,
  title,
  description,
  link,
  linkText,
  secondaryLink,
  secondaryLinkText,
}) => (
  <div className={styles.dashboardActionCard}>
    <div className={styles.actionCardHeader}>
      <div className={styles.actionCardIconWrapper}>{icon}</div>
      <h3 className={styles.actionCardTitle}>{title}</h3>
    </div>
    <p className={styles.actionCardDescription}>{description}</p>
    <div className={styles.actionCardLinks}>
      <Link to={link} className={styles.actionButtonPrimary}>
        {linkText}
      </Link>
      {secondaryLink && (
        <Link to={secondaryLink} className={styles.actionButtonSecondary}>
          {secondaryLinkText}
        </Link>
      )}
    </div>
  </div>
);

// Sidebar Link Component
const SidebarLink = ({ to, icon, text }) => (
  <li className={styles.sidebarListItem}>
    <Link to={to} className={styles.sidebarLink}>
      {icon}
      <span>{text}</span>
    </Link>
  </li>
);

// Sidebar Category Component
const SidebarCategory = ({ title }) => (
  <li className={styles.sidebarCategory}>{title}</li>
);

export default AdminDashboard;

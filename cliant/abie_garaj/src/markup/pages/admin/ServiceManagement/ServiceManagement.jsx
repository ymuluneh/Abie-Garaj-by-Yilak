// src/pages/admin/ServiceManagement/ServiceManagement.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../../../services/api"; // Adjust path as needed
import styles from "./ServiceManagement.module.css"; // Create this CSS module for styling
import AdminMenu from "../../../components/Admin/AdminMenu/AdminMenu";


const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingServiceName, setEditingServiceName] = useState("");
  const [editingServiceDescription, setEditingServiceDescription] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError("Failed to fetch services. Please try again.");
      toast.error("Failed to fetch services.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      toast.error("Service Name cannot be empty.");
      return;
    }

    try {
      await createService({
        service_name: newServiceName,
        service_description: newServiceDescription,
      });
      toast.success("Service added successfully!");
      setNewServiceName("");
      setNewServiceDescription("");
      fetchServices(); // Refresh the list
    } catch (err) {
      toast.error("Failed to add service.");
      console.error(err);
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service.service_id);
    setEditingServiceName(service.service_name);
    setEditingServiceDescription(service.service_description);
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditingServiceName("");
    setEditingServiceDescription("");
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingServiceName.trim()) {
      toast.error("Service Name cannot be empty.");
      return;
    }

    try {
      await updateService(editingServiceId, {
        service_name: editingServiceName,
        service_description: editingServiceDescription,
      });
      toast.success("Service updated successfully!");
      handleCancelEdit(); // Exit editing mode
      fetchServices(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update service.");
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        toast.success("Service deleted successfully!");
        fetchServices(); // Refresh the list
      } catch (err) {
        toast.error("Failed to delete service.");
        console.error(err);
      }
    }
  };

  return (
    <AdminMenu>
      <div className={styles.serviceManagementContainer}>
        <h1>Services We Provide</h1>

        {loading && <p>Loading services...</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        {!loading && !error && (
          <div className={styles.serviceList}>
            {services.length === 0 ? (
              <p>No services available. Add a new service below.</p>
            ) : (
              services.map((service) => (
                <div key={service.service_id} className={styles.serviceItem}>
                  {editingServiceId === service.service_id ? (
                    <form
                      onSubmit={handleUpdateService}
                      className={styles.editServiceForm}
                    >
                      <input
                        type="text"
                        value={editingServiceName}
                        onChange={(e) => setEditingServiceName(e.target.value)}
                        placeholder="Service Name"
                        className={styles.editInput}
                      />
                      <textarea
                        value={editingServiceDescription}
                        onChange={(e) =>
                          setEditingServiceDescription(e.target.value)
                        }
                        placeholder="Service Description"
                        className={styles.editInput}
                      />
                      <div className={styles.editActions}>
                        <button type="submit" className={styles.saveButton}>
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className={styles.serviceDetails}>
                        <h3>{service.service_name}</h3>
                        <p>{service.service_description}</p>
                      </div>
                      <div className={styles.serviceActions}>
                        <button
                          onClick={() => handleEditClick(service)}
                          className={styles.editButton}
                        >
                          <img
                            src="/icons/edit-icon.png"
                            alt="Edit"
                            className={styles.actionIcon}
                          />{" "}
                          {/* Replace with actual icon path */}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteService(service.service_id)
                          }
                          className={styles.deleteButton}
                        >
                          <img
                            src="/icons/delete-icon.png"
                            alt="Delete"
                            className={styles.actionIcon}
                          />{" "}
                          {/* Replace with actual icon path */}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className={styles.addServiceSection}>
          <h2>Add a new service</h2>
          <form onSubmit={handleAddService} className={styles.addServiceForm}>
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Service Name"
              required
              className={styles.addInput}
            />
            <textarea
              value={newServiceDescription}
              onChange={(e) => setNewServiceDescription(e.target.value)}
              placeholder="Service Description (Optional)"
              className={styles.addInput}
            ></textarea>
            <button type="submit" className={styles.addButton}>
              ADD SERVICE
            </button>
          </form>
        </div>
      </div>
    </AdminMenu>
  );
};

export default ServiceManagement;

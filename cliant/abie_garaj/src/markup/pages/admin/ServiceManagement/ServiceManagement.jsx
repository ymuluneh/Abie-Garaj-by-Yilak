
import React, { useState, useEffect } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../../../services/api"; 

import { toast } from "react-toastify"; 

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentService, setCurrentService] = useState({
    service_id: null,
    service_name: "",
    service_description: "",
  });
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

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
      console.error("Failed to fetch services:", err);
      setError("Failed to load services. Please try again.");
      toast.error("Failed to load services!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      toast.error("Service name cannot be empty.");
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
      setShowAddForm(false);
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error("Failed to add service:", err);
      toast.error("Failed to add service. Please try again.");
    }
  };

  const handleEditClick = (service) => {
    setCurrentService({
      service_id: service.service_id,
      service_name: service.service_name,
      service_description: service.service_description,
    });
    setShowEditForm(true);
    setShowAddForm(false); // Hide add form if showing
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!currentService.service_name.trim()) {
      toast.error("Service name cannot be empty.");
      return;
    }
    try {
      await updateService(currentService.service_id, {
        service_name: currentService.service_name,
        service_description: currentService.service_description,
      });
      toast.success("Service updated successfully!");
      setShowEditForm(false);
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error("Failed to update service:", err);
      toast.error("Failed to update service. Please try again.");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        toast.success("Service deleted successfully!");
        fetchServices(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete service:", err);
        toast.error("Failed to delete service. Please try again.");
      }
    }
  };

  // Remove the ProtectedRoute wrapper from here
  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title text-center mb-4">
              <h2>Service Management</h2>
            </div>
            <div className="text-right mb-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowEditForm(false); // Hide edit form when showing add form
                }}
              >
                {showAddForm ? "Cancel Add Service" : "Add New Service"}
              </button>
            </div>

            {showAddForm && (
              <div className="card mb-4">
                <div className="card-header">Add New Service</div>
                <div className="card-body">
                  <form onSubmit={handleAddService}>
                    <div className="form-group mb-3">
                      <label htmlFor="newServiceName">Service Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="newServiceName"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="newServiceDescription">
                        Service Description
                      </label>
                      <textarea
                        className="form-control"
                        id="newServiceDescription"
                        rows="3"
                        value={newServiceDescription}
                        onChange={(e) =>
                          setNewServiceDescription(e.target.value)
                        }
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">
                      Add Service
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {showEditForm && currentService.service_id && (
              <div className="card mb-4">
                <div className="card-header">
                  Edit Service (ID: {currentService.service_id})
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateService}>
                    <div className="form-group mb-3">
                      <label htmlFor="editServiceName">Service Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editServiceName"
                        value={currentService.service_name}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            service_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="editServiceDescription">
                        Service Description
                      </label>
                      <textarea
                        className="form-control"
                        id="editServiceDescription"
                        rows="3"
                        value={currentService.service_description}
                        onChange={(e) =>
                          setCurrentService({
                            ...currentService,
                            service_description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">
                      Update Service
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Loading and Error messages are now conditional inside the component */}
            {loading && (
              <div className="text-center mt-5">
                <p>Loading services...</p>
              </div>
            )}
            {error && (
              <div className="text-center mt-5">
                <p className="text-danger">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No services found.
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.service_id}>
                          <td>{service.service_id}</td>
                          <td>{service.service_name}</td>
                          <td>{service.service_description || "N/A"}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-info mr-2"
                              onClick={() => handleEditClick(service)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDeleteService(service.service_id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceManagement;

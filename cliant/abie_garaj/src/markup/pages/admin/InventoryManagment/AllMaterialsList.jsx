import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllInventoryItems } from "../../../../services/api";
import styles from "./common.module.css";

const AllMaterialsList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [filteredItems, setFilteredItems] = useState([]); // New state for filtered items

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const items = await getAllInventoryItems();
        setInventoryItems(items);
        setFilteredItems(items); // Initialize filtered items with all items
      } catch (err) {
        setError("Failed to load inventory items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Effect to filter items whenever searchTerm or inventoryItems change
  useEffect(() => {
    const results = inventoryItems.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.unit_of_measure.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, inventoryItems]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorAlert}>
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Stock Status</h1>
          <Link to="/admin/services" className={styles.addButton}>
            <span>+</span> Add New Item
          </Link>
        </div>
      </div>

      {/* Search Input Field */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by item name, description, or unit..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th className={styles.nameColumn}>Item Name</th>
              <th className={styles.priceColumn}>Price</th>
              <th className={styles.descriptionColumn}>Description</th>
              <th className={styles.unitColumn}>Unit</th>
              <th className={styles.stockColumn}>Current Stock</th>
              <th className={styles.statusColumn}>Status</th>
              <th className={styles.actionsColumn}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.item_id} className={styles.tableRow}>
                  <td className={styles.nameCell}>
                    <span className={styles.itemName}>{item.item_name}</span>
                  </td>
                  <td className={styles.priceCell}>
                    ${parseFloat(item.item_price || 0).toFixed(2)}
                  </td>
                  <td className={styles.descriptionCell}>
                    {item.item_description || (
                      <span className={styles.noDescription}>
                        No description
                      </span>
                    )}
                  </td>
                  <td className={styles.unitCell}>{item.unit_of_measure}</td>
                  <td className={styles.stockCell}>
                    <div className={styles.stockValue}>
                      {item.current_quantity}
                      {item.minimum_quantity && (
                        <span className={styles.minQuantity}>
                          (min: {item.minimum_quantity})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={styles.statusCell}>
                    <div
                      className={`${styles.statusIndicator} ${
                        item.current_quantity <= 0
                          ? styles.outOfStock
                          : item.current_quantity <= item.minimum_quantity
                          ? styles.lowStock
                          : styles.inStock
                      }`}
                    >
                      {item.current_quantity <= 0
                        ? "Out of Stock"
                        : item.current_quantity <= item.minimum_quantity
                        ? "Low Stock"
                        : "In Stock"}
                    </div>
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/admin/inventory/item/${item.item_id}`}
                      className={styles.viewButton}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noResults}>
                  No items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMaterialsList;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getItemTransactionHistory,
  updateStockTransaction,
  getAllInventoryItems,
} from "../../../../services/api";
import styles from "./common.module.css";

const ItemTransactions = () => {
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStockForm, setShowAddStockForm] = useState(false);
  const [formData, setFormData] = useState({
    transaction_type: "inward",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const [history, items] = await Promise.all([
          getItemTransactionHistory(itemId),
          getAllInventoryItems(),
        ]);

        const item = items.find((i) => i.item_id === parseInt(itemId));
        if (!item) throw new Error("Item not found");

        setItemDetails(item);
        setTransactions(history);
      } catch (err) {
        setError(err.message || "Failed to load item details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [itemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employee = JSON.parse(localStorage.getItem("employee"));
      await updateStockTransaction({
        item_id: itemId,
        transaction_type: formData.transaction_type,
        quantity: parseFloat(formData.quantity),
        employee_id: employee.employee_id,
        notes: formData.notes,
      });

      // Refresh data
      const [history, items] = await Promise.all([
        getItemTransactionHistory(itemId),
        getAllInventoryItems(),
      ]);
      setItemDetails(items.find((i) => i.item_id === parseInt(itemId)));
      setTransactions(history);
      setShowAddStockForm(false);
      setFormData({
        transaction_type: "inward",
        quantity: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update stock");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading item details...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorAlert}>
          <span>⚠️</span>
          <p>{error}</p>
        </div>
        <Link to="/admin/inventory" className={styles.backButton}>
          &larr; Back to Inventory
        </Link>
      </div>
    );

  if (!itemDetails)
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorAlert}>
          <span>⚠️</span>
          <p>Item not found</p>
        </div>
        <Link to="/admin/inventory" className={styles.backButton}>
          &larr; Back to Inventory
        </Link>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/admin/inventory" className={styles.backButton}>
            &larr; Back to Inventory
          </Link>
          <div className={styles.titleContainer}>
            <h1>{itemDetails.item_name}</h1>
            <button
              onClick={() => setShowAddStockForm(!showAddStockForm)}
              className={styles.addStockButton}
            >
              {showAddStockForm ? "Cancel" : "✚ Adjust Stock"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.itemSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Description:</span>
            <span className={styles.summaryValue}>
              {itemDetails.item_description || "—"}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Unit:</span>
            <span className={styles.summaryValue}>
              {itemDetails.unit_of_measure}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Current Stock:</span>
            <span className={styles.summaryValue}>
              {itemDetails.current_quantity}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Minimum Required:</span>
            <span className={styles.summaryValue}>
              {itemDetails.minimum_quantity}
            </span>
          </div>
        </div>
      </div>

      {showAddStockForm && (
        <div className={styles.stockFormContainer}>
          <div className={styles.stockForm}>
            <h3>Adjust Stock Level</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Transaction Type
                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="inward">Add Stock (Inward)</option>
                    <option value="outward">Remove Stock (Outward)</option>
                  </select>
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Notes
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows="3"
                  />
                </label>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.transactionSection}>
        <div className={styles.sectionHeader}>
          <h2>Transaction History</h2>
          <div className={styles.tableControls}>
            <span className={styles.totalTransactions}>
              Total: {transactions.length} records
            </span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th className={styles.dateColumn}>Date</th>
                <th className={styles.typeColumn}>Type</th>
                <th className={styles.quantityColumn}>Quantity</th>
                <th className={styles.resultColumn}>Result</th>
                <th className={styles.employeeColumn}>Employee</th>
                <th className={styles.customerColumn}>Customer</th>
                <th className={styles.orderColumn}>Order</th>
                <th className={styles.notesColumn}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.transaction_id} className={styles.tableRow}>
                    <td className={styles.dateCell}>
                      {new Date(tx.transaction_date).toLocaleString()}
                    </td>
                    <td className={styles.typeCell}>
                      <span
                        className={`${styles.typeBadge} ${
                          tx.transaction_type === "inward"
                            ? styles.inward
                            : styles.outward
                        }`}
                      >
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className={styles.quantityCell}>{tx.quantity}</td>
                    <td className={styles.resultCell}>
                      {tx.resulting_quantity}
                    </td>
                    <td className={styles.employeeCell}>
                      {tx.employee_name || "System"}
                    </td>
                    <td className={styles.customerCell}>
                      {tx.customer_name ? (
                        <Link
                          to={`/admin/customers/${tx.customer_id}`}
                          className={styles.customerLink}
                        >
                          {tx.customer_name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={styles.orderCell}>
                      {tx.order_id ? (
                        <Link
                          to={`/admin/orders/${tx.order_id}`}
                          className={styles.orderLink}
                        >
                          #{tx.order_id}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={styles.notesCell}>{tx.notes || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr className={styles.emptyRow}>
                  <td colSpan="8" className={styles.emptyCell}>
                    No transaction history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemTransactions;

// inventoryService.js
const { pool } = require("../config/config");

exports.getAllInventoryItems = async () => {
  const [rows] = await pool.query(`
    SELECT
      item_id,
      item_name,
      item_description, -- Add this line to include the description
      unit_of_measure,
      current_quantity,
      minimum_quantity,
      CASE
        WHEN current_quantity <= minimum_quantity THEN 'Low Stock'
        WHEN current_quantity = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
      END AS stock_status
    FROM inventory_items
    WHERE is_active = 1
  `);
  return rows;
};

exports.getItemTransactionHistory = async (itemId) => {
  const [rows] = await pool.query(
    `
    SELECT
      it.transaction_id,
      it.transaction_date,
      it.transaction_type,
      it.quantity,
      it.resulting_quantity,
      -- Join customer_info to get customer's first and last names, then concatenate
      COALESCE(CONCAT(ci.customer_first_name, ' ', ci.customer_last_name), 'N/A') AS customer_name,
      it.customer_id, -- Keep customer_id for linking in the frontend
      -- Join employee_info to get employee's first and last names, then concatenate
      COALESCE(CONCAT(ei.employee_first_name, ' ', ei.employee_last_name), 'System') AS employee_name,
      it.employee_id, -- Keep employee_id for any future linking
      it.order_id,
      it.notes
    FROM inventory_transactions it
    LEFT JOIN customer_info ci ON it.customer_id = ci.customer_id
    LEFT JOIN employee_info ei ON it.employee_id = ei.employee_id
    WHERE it.item_id = ?
    ORDER BY it.transaction_date DESC
  `,
    [itemId]
  );
  return rows;
};

exports.addInventoryItem = async ({
  item_name,
  item_description,
  unit_of_measure,
  current_quantity,
  minimum_quantity,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO inventory_items (item_name, item_description, unit_of_measure, current_quantity, minimum_quantity)
    VALUES (?, ?, ?, ?, ?)
  `,
    [
      item_name,
      item_description,
      unit_of_measure,
      current_quantity,
      minimum_quantity,
    ]
  );
  return { item_id: result.insertId };
};exports.updateStockTransaction = async ({
  item_id,
  transaction_type,
  quantity,
  employee_id,
  customer_id = null,
  order_id = null,
  notes = "",
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Log incoming data for debugging
    console.log("Incoming transaction data:", {
      item_id,
      transaction_type,
      quantity,
      employee_id,
      customer_id,
      order_id,
      notes,
    });

    const [itemRow] = await conn.query(
      `SELECT current_quantity FROM inventory_items WHERE item_id = ?`,
      [item_id]
    );

    if (itemRow.length === 0) {
      console.error(`Error: Item with ID ${item_id} not found.`);
      throw new Error("Item not found");
    }

    // FIX IS HERE: Ensure currentQty is treated as a number
    let currentQty = parseFloat(itemRow[0].current_quantity); // <--- Add parseFloat here
    console.log(`Current quantity for item ${item_id}: ${currentQty}`);

    // Ensure quantity is a number
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      console.error(`Error: Invalid quantity provided: ${quantity}`);
      throw new Error("Invalid quantity provided. Must be a positive number.");
    }

    let newQty =
      transaction_type === "inward"
        ? currentQty + parsedQuantity // Now both are numbers, so addition will occur
        : currentQty - parsedQuantity;

    console.log(`Calculated new quantity: ${newQty}`); // This should now show a correct sum/difference

    if (newQty < 0) {
      console.error(
        `Error: Stock cannot go negative. Item ${item_id}, Current: ${currentQty}, Attempted change: ${parsedQuantity}`
      );
      throw new Error("Stock cannot go negative");
    }

    await conn.query(
      `UPDATE inventory_items SET current_quantity = ? WHERE item_id = ?`,
      [newQty, item_id] // Pass newQty as a number; MySQL will handle the conversion
    );
    console.log(`Updated inventory_items for item ${item_id} to ${newQty}`);

    await conn.query(
      `
            INSERT INTO inventory_transactions (
                item_id, transaction_type, quantity, employee_id,
                customer_id, order_id, notes, resulting_quantity
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      [
        item_id,
        transaction_type,
        parsedQuantity,
        employee_id,
        customer_id,
        order_id,
        notes,
        newQty, // Pass newQty as a number
      ]
    );
    console.log(`Inserted transaction for item ${item_id}`);

    await conn.commit();
    console.log("Transaction committed successfully.");

    return {
      message: "Stock updated successfully",
      resulting_quantity: newQty,
    };
  } catch (error) {
    await conn.rollback();
    console.error("Error during updateStockTransaction (backend):", error);
    throw error;
  } finally {
    conn.release();
  }
};
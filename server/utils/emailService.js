const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use service name instead of host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true, // Always use TLS
  tls: {
    rejectUnauthorized: true, // Important for production
  },
  // Connection pool settings
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

// Test transporter connection
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

/**
 * Creates a standardized HTML email template for order completion.
 * @param {object} options - The options for the email content.
 * @param {string} options.customerName - The customer's name.
 * @param {string} options.orderId - The order ID.
 * @param {string} options.orderLink - The link to view order details.
 * @param {string} options.completionDate - The order completion date.
 * @returns {string} The complete HTML for the email.
 */
function createOrderCompletionTemplate({
  customerName,
  orderId,
  orderLink,
  completionDate,
}) {
  return `
    <div style="background-color: #f4f7f6; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="padding: 30px; color: #1e3a5f;">
          <h2 style="margin-top: 0; font-weight: 700; font-size: 24px;">Your Vehicle Service is Complete!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Dear ${customerName},<br/><br/>
            We're pleased to inform you that your vehicle service (Order #${orderId}) has been completed on ${completionDate}.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${orderLink}" style="display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #1e3a5f 60%, #007bff 100%); color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(30,58,95,0.15); transition: transform 0.2s;">
              View Order Details
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">
            You can pick up your vehicle at your convenience. If you have any questions, please reply to this email.
          </p>
        </div>
        <div style="background-color: #eef2f5; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          &copy; ${new Date().getFullYear()} Abie Garage Service. All rights reserved.
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends an order completion notification email to the customer.
 * @param {string} email - Customer's email address.
 * @param {string} customerName - Customer's full name.
 * @param {string} orderId - The order ID.
 * @param {string} completionDate - The order completion date.
 * @returns {Promise<boolean>} True if email was sent successfully.
 */
async function sendOrderCompletionEmail(
  email,
  customerName,
  orderId,
  completionDate
) {
  try {
    const orderLink = `http://localhost:5173/admin/orders/${orderId}`;

    const emailHtml = createOrderCompletionTemplate({
      customerName,
      orderId,
      orderLink,
      completionDate,
    });

    await transporter.sendMail({
      from: `"Your Garage Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Vehicle Service #${orderId} is Complete`,
      html: emailHtml,
    });

    return true;
  } catch (error) {
    console.error("Error sending order completion email:", error);
    return false;
  }
}

module.exports = {
  transporter,
  sendOrderCompletionEmail,
  
};

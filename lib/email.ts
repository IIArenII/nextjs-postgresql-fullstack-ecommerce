import nodemailer from "nodemailer";

// Using Nodemailer for Gmail.
// Make sure to use GMAIL_USER and GMAIL_APP_PASS in your .env.local
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: unknown }> {
  try {
    // We always log the verification code to the console for easy debugging
    console.log("\n========================================================");
    console.log("📧 VERIFICATION CODE");
    console.log(`To: ${email}`);
    console.log(`Your 6-digit verification code is:`);
    console.log(`         *** ${token} ***`);
    console.log("========================================================\n");

    // If no App Password is provided, we simulate sending the email in the console.
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      console.log("Skipping real email sending because GMAIL_USER or GMAIL_APP_PASS is not set.");
      return { success: true };
    }

    const mailOptions = {
      from: `"Your Shop" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `<p>Your 6-digit verification code is: <strong>${token}</strong></p><p>This code will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { success: false, error: err };
  }
}

export async function sendOrderNotificationToSeller({
  sellerEmail,
  buyerName,
  buyerEmail,
  productName,
  productId,
  quantity,
  remainingStock
}: {
  sellerEmail: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  productId: number;
  quantity: number;
  remainingStock: number;
}) {
  try {
    console.log("\n========================================================");
    console.log("📧 ORDER NOTIFICATION");
    console.log(`To Seller: ${sellerEmail}`);
    console.log(`Buyer: ${buyerName} (${buyerEmail})`);
    console.log(`Product: [${productId}] ${productName}`);
    console.log(`Quantity: ${quantity}`);
    console.log(`Stock Remaining: ${remainingStock}`);
    console.log("========================================================\n");

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      console.log("Skipping real email sending because GMAIL_USER or GMAIL_APP_PASS is not set.");
      return { success: true };
    }

    const mailOptions = {
      from: `"Your Store" <${process.env.GMAIL_USER}>`,
      to: sellerEmail,
      subject: `New Order Received: ${productName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Order Received!</h2>
          <p>User <strong>${buyerName}</strong> (${buyerEmail}) has purchased your product.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Product Details:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>ID:</strong> ${productId}</li>
            <li><strong>Name:</strong> ${productName}</li>
            <li><strong>Quantity Bought:</strong> ${quantity}</li>
          </ul>
          <p style="margin-top: 20px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
            <strong>Updated Stock Level:</strong> ${remainingStock} items remaining.
          </p>
          <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
            You can manage your orders in the Seller Dashboard.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Failed to send order notification:", err);
    return { success: false, error: err };
  }
}

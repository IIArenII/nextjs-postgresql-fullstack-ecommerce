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

export async function sendProductPendingEmail(sellerEmail: string, productName: string) {
  try {
    console.log("\n========================================================");
    console.log("📧 PRODUCT PENDING APPROVAL");
    console.log(`To Seller: ${sellerEmail}`);
    console.log(`Product: ${productName}`);
    console.log("========================================================\n");

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) return { success: true };

    const mailOptions = {
      from: `"Storefront" <${process.env.GMAIL_USER}>`,
      to: sellerEmail,
      subject: `Product Received: ${productName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Product Under Review</h2>
          <p>We've received your product listing for <strong>${productName}</strong>.</p>
          <p>Our team is currently reviewing it to ensure it meets our quality and safety standards.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 14px; color: #64748b;">
            This usually takes less than 24 hours. You'll receive another email as soon as it's approved and live on the marketplace.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
            Thank you for selling with Storefront!
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Failed to send pending email:", err);
    return { success: false, error: err };
  }
}

export async function sendProductStatusEmail(sellerEmail: string, productName: string, status: 'approved' | 'rejected') {
  try {
    const isApproved = status === 'approved';
    console.log("\n========================================================");
    console.log(`📧 PRODUCT ${status.toUpperCase()}`);
    console.log(`To Seller: ${sellerEmail}`);
    console.log(`Product: ${productName}`);
    console.log("========================================================\n");

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) return { success: true };

    const mailOptions = {
      from: `"Storefront" <${process.env.GMAIL_USER}>`,
      to: sellerEmail,
      subject: isApproved ? `Product Published: ${productName}` : `Action Required: Product ${productName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: ${isApproved ? '#10b981' : '#ef4444'};">${isApproved ? 'Great news! Your product is live.' : 'Update on your product submission'}</h2>
          <p>Your product <strong>${productName}</strong> has been ${status} by our moderation team.</p>
          ${isApproved 
            ? `<p>It's now visible to all customers on the marketplace. Check it out and start sharing the link!</p>`
            : `<p>Unfortunately, your product could not be published at this time. Please review our guidelines and update your listing via the Seller Dashboard.</p>`
          }
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/seller" 
             style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Visit Seller Dashboard
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Failed to send status email:", err);
    return { success: false, error: err };
  }
}

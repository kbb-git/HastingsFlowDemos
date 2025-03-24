const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API Keys and Configuration
const CHECKOUT_SECRET_KEY = process.env.CHECKOUT_SECRET_KEY || "sk_sbox_3ih4tvdq7byb3b2akct5n64va4h";
const CHECKOUT_PUBLIC_KEY = process.env.CHECKOUT_PUBLIC_KEY || "pk_sbox_e5v4rg3sztzmdusp47pvdg53kmc";
const DEFAULT_PROCESSING_CHANNEL_ID = process.env.DEFAULT_PROCESSING_CHANNEL_ID || "pc_eonbfv5qtimefo2mizmgmy3c5y";
const ALTERNATIVE_PROCESSING_CHANNEL_ID = process.env.ALTERNATIVE_PROCESSING_CHANNEL_ID || "pc_cvw6lv3jnsduhpqewkoum2eugi";
const ENVIRONMENT = process.env.ENVIRONMENT || "sandbox";

// Store latest session ID for reference
let latestSessionId = null;
// Store latest payment response for reference
let latestPaymentResponse = null;

// Create a Payment Session Endpoint
app.post("/api/create-payment-session", async (req, res) => {
  try {
    const {
      amount,
      currency,
      items,
      customer,
      billing,
      shipping,
      payment_method_configuration,
      enabled_payment_methods,
      disabled_payment_methods,
      locale,
      brand // Added brand parameter to customise the appearance
    } = req.body;

    // Choose an appropriate fallback billing address based on currency or locale
    let fallbackBilling = {
      address: {
        address_line1: "123 Test Street",
        city: "London",
        state: "LDN",
        zip: "W1T 4TJ",
        country: "GB"
      }
    };

    // Select processing channel ID (may vary based on country)
    let processingChannelId = DEFAULT_PROCESSING_CHANNEL_ID;
    if (
      (billing && billing.address && (billing.address.country === "FR" || billing.address.country === "PT" || billing.address.country === "SA")) ||
      (!billing && fallbackBilling && fallbackBilling.address && (fallbackBilling.address.country === "FR" || fallbackBilling.address.country === "PT" || fallbackBilling.address.country === "SA"))
    ) {
      processingChannelId = ALTERNATIVE_PROCESSING_CHANNEL_ID;
    }

    // Create the session request object
    const sessionRequest = {
      amount,
      currency,
      payment_type: "Regular",
      display_name: "Hastings Direct",
      reference: "ORD-" + Date.now(),
      description: "Hastings Direct Insurance Payment",
      billing: billing || fallbackBilling,
      shipping: shipping || fallbackBilling,
      customer: {
        email: customer && customer.email ? customer.email : "john.doe@example.com",
        name: customer && customer.name ? customer.name : "John Doe"
      },
      success_url: brand ? `${req.protocol}://${req.get('host')}/success.html?brand=${brand}` : `${req.protocol}://${req.get('host')}/success.html`,
      failure_url: brand ? `${req.protocol}://${req.get('host')}/index.html?brand=${brand}` : `${req.protocol}://${req.get('host')}/index.html`,
      capture: true,
      locale: locale || "en-GB",
      processing_channel_id: processingChannelId,
      "3ds": {
        enabled: true,
        attempt_n3d: false
      },
      items: items || [],
      enabled_payment_methods: enabled_payment_methods || ["card"],
      disabled_payment_methods: disabled_payment_methods || [],
      payment_method_configuration: payment_method_configuration || {}
    };

    // Call Checkout.com API to create the payment session
    const response = await axios.post(
      "https://api.sandbox.checkout.com/payment-sessions",
      sessionRequest,
      {
        headers: {
          Authorization: `Bearer ${CHECKOUT_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Store the latest session ID
    latestSessionId = response.data.id;

    res.json(response.data);

  } catch (error) {
    console.error("Payment session error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({
      error: "Failed to create payment session",
      details: error.response?.data || error.message
    });
  }
});

// Get Payment Session Details Endpoint
app.get("/api/payment-session/:sessionId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.sandbox.checkout.com/payment-sessions/${req.params.sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${CHECKOUT_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Session fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch session details" });
  }
});

// Get Payment Details Endpoint
app.get("/api/payment/:paymentId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.sandbox.checkout.com/payments/${req.params.paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${CHECKOUT_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Payment fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
});

// Get Latest Session ID Endpoint
app.get("/api/latest-session", (req, res) => {
  if (latestSessionId) {
    res.json({ id: latestSessionId });
  } else {
    res.status(404).json({ error: "No session ID available" });
  }
});

// Store Payment Response Endpoint
app.post("/api/store-payment-response", (req, res) => {
  try {
    latestPaymentResponse = req.body;
    res.json({ success: true });
  } catch (error) {
    console.error("Error storing payment response:", error);
    res.status(500).json({ error: "Failed to store payment response" });
  }
});

// Get Latest Payment Response Endpoint
app.get("/api/latest-payment-response", (req, res) => {
  if (latestPaymentResponse) {
    res.json(latestPaymentResponse);
  } else {
    res.status(404).json({ error: "No payment response available" });
  }
});

// Serve the landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
  },
});

/**
 * Send booking confirmation email with ticket details
 * @param {Object} bookingDetails - Contains user email, event info, and booking data
 */
exports.sendBookingConfirmation = async (bookingDetails) => {
  const {
    userEmail,
    userName,
    eventName,
    eventDate,
    eventLocation,
    ticketType,
    quantity,
    amount,
    orderId,
    bookingId,
  } = bookingDetails;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
            }
            .content {
                padding: 30px;
            }
            .booking-card {
                background-color: #f9f9f9;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: 600;
                color: #333;
            }
            .detail-value {
                color: #666;
            }
            .ticket-info {
                background-color: #667eea;
                color: white;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
                text-align: center;
            }
            .ticket-id {
                font-size: 18px;
                font-weight: bold;
                word-break: break-all;
            }
            .total-amount {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            .button {
                display: inline-block;
                background-color: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✓ Booking Confirmed!</h1>
                <p>Your ticket has been successfully booked</p>
            </div>
            
            <div class="content">
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Thank you for your booking! Your event ticket is confirmed and ready to use.</p>
                
                <div class="booking-card">
                    <div class="detail-row">
                        <span class="detail-label">Event:</span>
                        <span class="detail-value">${eventName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${eventDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${eventLocation}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ticket Type:</span>
                        <span class="detail-value">${ticketType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Number of Tickets:</span>
                        <span class="detail-value">${quantity}</span>
                    </div>
                </div>
                
                <div class="total-amount">₹ ${amount.toLocaleString('en-IN')}</div>
                
                <div class="ticket-info">
                    <p>Your Ticket ID:</p>
                    <div class="ticket-id">${bookingId}</div>
                </div>
                
                <p><strong>Order ID:</strong> ${orderId}</p>
                
                <p>Please save this email for your records. You will need your Ticket ID at the event entrance.</p>
                
                <div style="background-color: #fffacd; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <strong>Important:</strong> Screenshot or print this confirmation email and show it at the event check-in along with a valid ID.
                </div>
                
                <p>If you have any questions, please contact our support team.</p>
                
                <p>Thank you for choosing our event platform!</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2024 Event Ticketing Platform. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this address.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Ticket Confirmation - ${eventName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${userEmail}:`, error);
    throw error;
  }
};

/**
 * Send ticket verification email
 */
exports.sendTicketVerification = async (userEmail, eventName, orderId) => {
  const htmlContent = `
    <p>Your ticket for <strong>${eventName}</strong> has been verified.</p>
    <p>Order ID: ${orderId}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Ticket Verified - ${eventName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Ticket verification email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending verification email:`, error);
    throw error;
  }
};

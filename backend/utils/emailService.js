const nodemailer = require("nodemailer")

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendEmail(options) {
    try {
      const message = {
        from: `${process.env.FROM_NAME || "Hulet Fish Tourism"} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }

      const info = await this.transporter.sendMail(message)
      console.log("Email sent: ", info.messageId)
      return info
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  }

  // Booking confirmation email to tourist
  async sendBookingConfirmation(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-size: 20px;
            font-weight: bold;
          }
          .booking-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .status-pending {
            background: #fef3cd;
            color: #856404;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">Booking Request Submitted!</h1>
          </div>
          
          <h2>Hello ${booking.tourist.name}!</h2>
          
          <p>Thank you for your booking request with Hulet Fish Tourism. Your request has been submitted and is awaiting confirmation from your host.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Experience:</strong>
              <span>${booking.culturalOffering.title}</span>
            </div>
            <div class="detail-row">
              <strong>Host:</strong>
              <span>${booking.host.name}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong>
              <span>${new Date(booking.bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Time:</strong>
              <span>${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}</span>
            </div>
            <div class="detail-row">
              <strong>Guests:</strong>
              <span>${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "person" : "people"}</span>
            </div>
            <div class="detail-row">
              <strong>Total Amount:</strong>
              <span>${booking.totalAmount} ${booking.currency}</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong>
              <span class="status-pending">Pending Host Approval</span>
            </div>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Your host will review your booking request within 24 hours</li>
            <li>You'll receive an email notification once they respond</li>
            <li>If approved, you'll receive payment instructions</li>
            <li>If you have questions, contact your host directly</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" class="btn">View Booking Details</a>
          </div>
          
          <div class="footer">
            <p><strong>Host Contact Information:</strong></p>
            <p>📧 ${booking.host.email}</p>
            <p>📱 ${booking.host.phone || "Not provided"}</p>
            <p>📍 ${booking.host.location?.city || "Location not specified"}</p>
            
            <hr style="margin: 20px 0;">
            
            <p>Need help? Contact our support team at <a href="mailto:support@huletfish.com">support@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: booking.tourist.email,
      subject: `Booking Request Submitted - ${booking.culturalOffering.title}`,
      html,
    })
  }

  // Booking request notification to host
  async sendBookingRequestToHost(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f59e0b, #10b981);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            font-size: 20px;
            font-weight: bold;
          }
          .booking-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
            font-weight: bold;
            text-align: center;
          }
          .btn-approve {
            background: linear-gradient(135deg, #10b981, #059669);
          }
          .btn-reject {
            background: linear-gradient(135deg, #ef4444, #dc2626);
          }
          .guest-details {
            background: #e6f7ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">New Booking Request!</h1>
          </div>
          
          <h2>Hello ${booking.host.name}!</h2>
          
          <p>You have received a new booking request for your cultural experience. Please review the details below and respond within 24 hours.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Experience:</strong>
              <span>${booking.culturalOffering.title}</span>
            </div>
            <div class="detail-row">
              <strong>Tourist:</strong>
              <span>${booking.tourist.name}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong>
              <span>${new Date(booking.bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Time:</strong>
              <span>${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}</span>
            </div>
            <div class="detail-row">
              <strong>Guests:</strong>
              <span>${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "person" : "people"}</span>
            </div>
            <div class="detail-row">
              <strong>Total Amount:</strong>
              <span>${booking.totalAmount} ${booking.currency}</span>
            </div>
          </div>
          
          <div class="guest-details">
            <h4>Guest Information</h4>
            <p><strong>Contact:</strong> ${booking.contactInfo.email} | ${booking.contactInfo.phone}</p>
            ${booking.guestDetails
              .map(
                (guest) => `
              <p><strong>${guest.name}</strong> ${guest.age ? `(Age: ${guest.age})` : ""}</p>
              ${guest.specialRequests ? `<p><em>Special Request: ${guest.specialRequests}</em></p>` : ""}
            `,
              )
              .join("")}
            ${
              booking.touristMessage
                ? `
              <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>Message from Tourist:</strong>
                <p style="margin: 5px 0 0 0;">"${booking.touristMessage}"</p>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/host/bookings/${booking._id}/approve" class="btn btn-approve">Accept Booking</a>
            <a href="${process.env.FRONTEND_URL}/host/bookings/${booking._id}/reject" class="btn btn-reject">Decline Booking</a>
          </div>
          
          <p><strong>Important:</strong> Please respond within 24 hours to maintain your host rating. Late responses may affect your visibility on the platform.</p>
          
          <div class="footer">
            <p><strong>Tourist Contact Information:</strong></p>
            <p>📧 ${booking.tourist.email}</p>
            <p>📱 ${booking.contactInfo.phone}</p>
            ${
              booking.contactInfo.emergencyContact?.name
                ? `
              <p><strong>Emergency Contact:</strong> ${booking.contactInfo.emergencyContact.name} (${booking.contactInfo.emergencyContact.phone})</p>
            `
                : ""
            }
            
            <hr style="margin: 20px 0;">
            
            <p>Need help? Contact our support team at <a href="mailto:support@huletfish.com">support@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: booking.host.email,
      subject: `New Booking Request - ${booking.culturalOffering.title}`,
      html,
    })
  }

  // Booking approval notification to tourist
  async sendBookingApproval(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Approved! - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-size: 20px;
            font-weight: bold;
          }
          .booking-details {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #dcfce7;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .status-approved {
            background: #dcfce7;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
          }
          .host-message {
            background: #e6f7ff;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #3b82f6;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">🎉 Booking Approved!</h1>
          </div>
          
          <h2>Great news, ${booking.tourist.name}!</h2>
          
          <p>Your booking request has been <strong>approved</strong> by ${booking.host.name}! Your authentic Ethiopian cultural experience is confirmed.</p>
          
          <div class="booking-details">
            <h3>Confirmed Booking Details</h3>
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Experience:</strong>
              <span>${booking.culturalOffering.title}</span>
            </div>
            <div class="detail-row">
              <strong>Host:</strong>
              <span>${booking.host.name}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong>
              <span>${new Date(booking.bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Time:</strong>
              <span>${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}</span>
            </div>
            <div class="detail-row">
              <strong>Guests:</strong>
              <span>${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? "person" : "people"}</span>
            </div>
            <div class="detail-row">
              <strong>Total Amount:</strong>
              <span>${booking.totalAmount} ${booking.currency}</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong>
              <span class="status-approved">✅ Confirmed</span>
            </div>
          </div>
          
          ${
            booking.hostResponse
              ? `
            <div class="host-message">
              <h4>Message from your Host:</h4>
              <p>"${booking.hostResponse}"</p>
            </div>
          `
              : ""
          }
          
          <h3>Next Steps:</h3>
          <ol>
            <li><strong>Complete Payment:</strong> Proceed to payment to secure your booking</li>
            <li><strong>Prepare for your visit:</strong> Review any special requirements</li>
            <li><strong>Contact your host:</strong> Coordinate meeting details if needed</li>
            <li><strong>Enjoy your experience:</strong> Immerse yourself in Ethiopian culture!</li>
          </ol>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}/payment" class="btn">Complete Payment</a>
          </div>
          
          <div class="footer">
            <p><strong>Your Host Contact Information:</strong></p>
            <p>📧 ${booking.host.email}</p>
            <p>📱 ${booking.host.phone || "Not provided"}</p>
            <p>📍 ${booking.culturalOffering.location.address}, ${booking.culturalOffering.location.city}</p>
            
            <hr style="margin: 20px 0;">
            
            <p><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your experience.</p>
            <p>Need help? Contact our support team at <a href="mailto:support@huletfish.com">support@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: booking.tourist.email,
      subject: `🎉 Booking Approved - ${booking.culturalOffering.title}`,
      html,
    })
  }

  // Booking rejection notification to tourist
  async sendBookingRejection(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Update - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            font-size: 20px;
            font-weight: bold;
          }
          .booking-details {
            background: #fef3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #fde68a;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .rejection-reason {
            background: #fee2e2;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ef4444;
          }
          .alternatives {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">Booking Update</h1>
          </div>
          
          <h2>Hello ${booking.tourist.name},</h2>
          
          <p>We regret to inform you that your booking request for <strong>${booking.culturalOffering.title}</strong> could not be accommodated at this time.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Experience:</strong>
              <span>${booking.culturalOffering.title}</span>
            </div>
            <div class="detail-row">
              <strong>Requested Date:</strong>
              <span>${new Date(booking.bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Requested Time:</strong>
              <span>${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}</span>
            </div>
          </div>
          
          ${
            booking.rejectionReason
              ? `
            <div class="rejection-reason">
              <h4>Reason for Unavailability:</h4>
              <p>${booking.rejectionReason}</p>
            </div>
          `
              : ""
          }
          
          ${
            booking.hostResponse
              ? `
            <div style="background: #e6f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6;">
              <h4>Message from Host:</h4>
              <p>"${booking.hostResponse}"</p>
            </div>
          `
              : ""
          }
          
          <div class="alternatives">
            <h3>Don't worry! Here are some alternatives:</h3>
            <ul>
              <li><strong>Try different dates:</strong> Contact the host directly for alternative dates</li>
              <li><strong>Explore similar experiences:</strong> Browse other cultural offerings in the same category</li>
              <li><strong>Contact the host:</strong> Discuss flexible timing or group size options</li>
              <li><strong>Join our waitlist:</strong> Get notified when similar experiences become available</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/explore?category=${encodeURIComponent(booking.culturalOffering.category)}" class="btn">Find Similar Experiences</a>
          </div>
          
          <p>We apologize for any inconvenience and appreciate your interest in authentic Ethiopian cultural experiences. Our team is here to help you find the perfect alternative!</p>
          
          <div class="footer">
            <p><strong>Host Contact Information:</strong></p>
            <p>📧 ${booking.host.email}</p>
            <p>📱 ${booking.host.phone || "Not provided"}</p>
            
            <hr style="margin: 20px 0;">
            
            <p>Need help finding alternatives? Contact our support team at <a href="mailto:support@huletfish.com">support@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: booking.tourist.email,
      subject: `Booking Update - ${booking.culturalOffering.title}`,
      html,
    })
  }

  // Cultural offering approval notification to host
  async sendOfferingApproval(offering) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cultural Offering Approved! - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-size: 20px;
            font-weight: bold;
          }
          .offering-details {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .tips {
            background: #e6f7ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">🎉 Offering Approved!</h1>
          </div>
          
          <h2>Congratulations, ${offering.host.name}!</h2>
          
          <p>Your cultural offering has been <strong>approved</strong> and is now live on the Hulet Fish Tourism platform! Tourists can now discover and book your authentic Ethiopian experience.</p>
          
          <div class="offering-details">
            <h3>Approved Offering</h3>
            <p><strong>Title:</strong> ${offering.title}</p>
            <p><strong>Category:</strong> ${offering.category}</p>
            <p><strong>Location:</strong> ${offering.location.city}, ${offering.location.region}</p>
            <p><strong>Price:</strong> ${offering.price.amount} ${offering.price.currency} per person</p>
            <p><strong>Duration:</strong> ${offering.duration.hours} hours</p>
          </div>
          
          ${
            offering.adminFeedback
              ? `
            <div style="background: #e6f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6;">
              <h4>Admin Feedback:</h4>
              <p>"${offering.adminFeedback}"</p>
            </div>
          `
              : ""
          }
          
          <div class="tips">
            <h3>Tips for Success:</h3>
            <ul>
              <li><strong>Respond quickly:</strong> Reply to booking requests within 24 hours</li>
              <li><strong>Provide great experiences:</strong> Exceed tourist expectations</li>
              <li><strong>Communicate clearly:</strong> Keep tourists informed before and during visits</li>
              <li><strong>Gather reviews:</strong> Encourage satisfied tourists to leave positive reviews</li>
              <li><strong>Update availability:</strong> Keep your calendar current to avoid conflicts</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/host/offerings/${offering._id}" class="btn">Manage Your Offering</a>
          </div>
          
          <p>Your offering is now visible to thousands of travelers looking for authentic Ethiopian cultural experiences. Start welcoming guests and sharing your heritage!</p>
          
          <div class="footer">
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Monitor your dashboard for booking requests</li>
              <li>Update your availability calendar regularly</li>
              <li>Prepare for your first guests</li>
              <li>Join our host community for tips and support</li>
            </ul>
            
            <hr style="margin: 20px 0;">
            
            <p>Need help? Contact our host support team at <a href="mailto:hosts@huletfish.com">hosts@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: offering.host.email,
      subject: `🎉 Cultural Offering Approved - ${offering.title}`,
      html,
    })
  }

  // Cultural offering rejection notification to host
  async sendOfferingRejection(offering) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cultural Offering Review - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            font-size: 20px;
            font-weight: bold;
          }
          .offering-details {
            background: #fef3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
          }
          .feedback {
            background: #fee2e2;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ef4444;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .guidelines {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">Offering Review Update</h1>
          </div>
          
          <h2>Hello ${offering.host.name},</h2>
          
          <p>Thank you for submitting your cultural offering to Hulet Fish Tourism. After careful review, we need some adjustments before we can approve your listing.</p>
          
          <div class="offering-details">
            <h3>Submitted Offering</h3>
            <p><strong>Title:</strong> ${offering.title}</p>
            <p><strong>Category:</strong> ${offering.category}</p>
            <p><strong>Location:</strong> ${offering.location.city}, ${offering.location.region}</p>
            <p><strong>Price:</strong> ${offering.price.amount} ${offering.price.currency} per person</p>
          </div>
          
          ${
            offering.adminFeedback
              ? `
            <div class="feedback">
              <h4>Review Feedback:</h4>
              <p>${offering.adminFeedback}</p>
            </div>
          `
              : ""
          }
          
          <div class="guidelines">
            <h3>Guidelines for Approval:</h3>
            <ul>
              <li><strong>Authentic Experience:</strong> Ensure your offering showcases genuine Ethiopian culture</li>
              <li><strong>Clear Description:</strong> Provide detailed, accurate descriptions of activities</li>
              <li><strong>Quality Images:</strong> Include high-quality photos that represent your experience</li>
              <li><strong>Realistic Pricing:</strong> Set competitive prices that reflect the value provided</li>
              <li><strong>Safety Standards:</strong> Ensure all activities meet safety requirements</li>
              <li><strong>Cultural Sensitivity:</strong> Respect local customs and traditions</li>
            </ul>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Review the feedback provided above</li>
            <li>Make the necessary adjustments to your offering</li>
            <li>Resubmit your offering for review</li>
            <li>Our team will review your updated submission within 2-3 business days</li>
          </ol>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/host/offerings/${offering._id}/edit" class="btn">Edit Your Offering</a>
          </div>
          
          <p>We appreciate your commitment to providing authentic Ethiopian experiences and look forward to having your offering on our platform once the adjustments are made.</p>
          
          <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>Our host support team is here to help you create an outstanding cultural offering:</p>
            <p>📧 <a href="mailto:hosts@huletfish.com">hosts@huletfish.com</a></p>
            <p>📱 +251-911-234-567</p>
            
            <hr style="margin: 20px 0;">
            
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: offering.host.email,
      subject: `Cultural Offering Review - ${offering.title}`,
      html,
    })
  }

  // Payment confirmation email
  async sendPaymentConfirmation(booking, payment) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #10b981;
            font-size: 20px;
            font-weight: bold;
          }
          .payment-details {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #dcfce7;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HF</div>
            <h1 style="margin: 0;">💳 Payment Confirmed!</h1>
          </div>
          
          <h2>Thank you, ${booking.tourist.name}!</h2>
          
          <p>Your payment has been successfully processed. Your Ethiopian cultural experience is now fully confirmed and we can't wait for you to enjoy this authentic adventure!</p>
          
          <div class="payment-details">
            <h3>Payment Details</h3>
            <div class="detail-row">
              <strong>Payment ID:</strong>
              <span>${payment.paymentId}</span>
            </div>
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Amount Paid:</strong>
              <span>${payment.amount} ${payment.currency}</span>
            </div>
            <div class="detail-row">
              <strong>Payment Method:</strong>
              <span>${payment.gateway === "stripe" ? "Credit/Debit Card" : "Chapa Payment"}</span>
            </div>
            <div class="detail-row">
              <strong>Transaction Date:</strong>
              <span>${new Date(payment.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Experience:</strong>
              <span>${booking.culturalOffering.title}</span>
            </div>
            <div class="detail-row">
              <strong>Experience Date:</strong>
              <span>${new Date(booking.bookingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
          </div>
          
          <h3>What's Next?</h3>
          <ul>
            <li><strong>Save this confirmation:</strong> Keep this email as your receipt</li>
            <li><strong>Contact your host:</strong> Coordinate final details if needed</li>
            <li><strong>Prepare for your visit:</strong> Review any special requirements</li>
            <li><strong>Arrive on time:</strong> Be punctual for the best experience</li>
            <li><strong>Enjoy and share:</strong> Take photos and share your experience!</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" class="btn">View Booking Details</a>
          </div>
          
          <div class="footer">
            <p><strong>Your Host Contact Information:</strong></p>
            <p>📧 ${booking.host.email}</p>
            <p>📱 ${booking.host.phone || "Not provided"}</p>
            <p>📍 ${booking.culturalOffering.location.address}, ${booking.culturalOffering.location.city}</p>
            
            <hr style="margin: 20px 0;">
            
            <p><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your experience.</p>
            <p>Need help? Contact our support team at <a href="mailto:support@huletfish.com">support@huletfish.com</a></p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await this.sendEmail({
      email: booking.tourist.email,
      subject: `💳 Payment Confirmed - ${booking.culturalOffering.title}`,
      html,
    })
  }

  // Admin notification for new user registration
  async sendAdminNewUserNotification(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New User Registration - Hulet Fish Tourism</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .user-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .role-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
          }
          .role-tourist {
            background: #dbeafe;
            color: #1e40af;
          }
          .role-host {
            background: #dcfce7;
            color: #166534;
          }
          .role-guide {
            background: #fef3cd;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">👤 New User Registration</h1>
          </div>
          
          <h2>New User Alert</h2>
          
          <p>A new user has registered on the Hulet Fish Tourism platform. Please review their information below:</p>
          
          <div class="user-details">
            <h3>User Information</h3>
            <div class="detail-row">
              <strong>Name:</strong>
              <span>${user.name}</span>
            </div>
            <div class="detail-row">
              <strong>Email:</strong>
              <span>${user.email}</span>
            </div>
            <div class="detail-row">
              <strong>Role:</strong>
              <span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <strong>Phone:</strong>
              <span>${user.phone || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <strong>Location:</strong>
              <span>${user.location?.city || "Not provided"}, ${user.location?.region || ""}</span>
            </div>
            <div class="detail-row">
              <strong>Registration Date:</strong>
              <span>${new Date(user.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            <div class="detail-row">
              <strong>Email Verified:</strong>
              <span>${user.isVerified ? "✅ Yes" : "❌ No"}</span>
            </div>
          </div>
          
          ${
            user.role === "host"
              ? `
            <div style="background: #fef3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h4>⚠️ Host Application Pending</h4>
              <p>This user has registered as a host and may require approval to start creating cultural offerings. Please review their profile and approve if appropriate.</p>
            </div>
          `
              : ""
          }
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/users/${user._id}" class="btn">Review User Profile</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
            <p>This is an automated notification from the Hulet Fish Tourism admin system.</p>
            <p>© 2024 Hulet Fish Tourism. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send to admin email (you can configure multiple admin emails)
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : ["admin@huletfish.com"]

    for (const adminEmail of adminEmails) {
      await this.sendEmail({
        email: adminEmail.trim(),
        subject: `New ${user.role} Registration - ${user.name}`,
        html,
      })
    }
  }
}

module.exports = new EmailService()

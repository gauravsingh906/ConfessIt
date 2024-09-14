import nodemailer from 'nodemailer'; // Importing nodemailer for email sending
import { ApiResponse } from "@/types/ApiResponse"; // Importing the ApiResponse type

// Function to create the HTML content for the email
const createEmailHtml = (username: string, verifyCode: string) => {
    return `
        <html>
            <body>
                <h1>Hello ${username},</h1>
                <p>Your verification code is:</p>
                <h2>${verifyCode}</h2>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you!</p>
            </body>
        </html>
    `;
};

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        // Create a nodemailer transporter using Gmail service
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // Set to true if using SSL/TLS
            auth: {
                user: process.env.SMTP_USERNAME, // Gmail username from environment variables
                pass: process.env.SMTP_PASSWORD, // Gmail password from environment variables
            },
        });

        // Email options including recipient, subject, and HTML content
        const mailOptions = {
            from: process.env.SMTP_USERNAME, // Use environment variable for sender email
            to: email, // Recipient email
            subject: 'Anonymous-review | Verification Code', // Email subject
            html: createEmailHtml(username, verifyCode) // Directly created HTML content
        };

        // Send the email using the transporter
        await transporter.sendMail(mailOptions);

        // Return a success response if email is sent successfully
        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Return a failure response if an error occurs
        return { success: false, message: 'Failed to send verification email' };
    }
}

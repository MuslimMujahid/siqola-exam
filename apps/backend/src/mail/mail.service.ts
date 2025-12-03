import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface SendInvitationEmailParams {
  to: string;
  institutionName: string;
  role: string;
  invitationUrl: string;
  expiresAt: Date;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    // Initialize nodemailer transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify SMTP connection
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection error:', error);
      } else {
        this.logger.log('SMTP server is ready to send emails');
      }
    });
  }

  async sendInvitationEmail(params: SendInvitationEmailParams): Promise<void> {
    const { to, institutionName, role, invitationUrl, expiresAt } = params;

    const roleInIndonesian = role === 'EXAMINER' ? 'Penguji' : 'Peserta';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Undangan Bergabung</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, oklch(0.8 0.12 199) 0%, oklch(0.7 0.15 199) 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            margin: 0 0 20px;
            font-size: 16px;
          }
          .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid oklch(0.8 0.12 199);
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box p {
            margin: 8px 0;
            font-size: 15px;
          }
          .info-label {
            font-weight: 600;
            color: #555;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: oklch(0.8 0.12 199);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .button:hover {
            background-color: oklch(0.7 0.15 199);
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          .expiry-warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Undangan Bergabung</h1>
          </div>
          <div class="content">
            <p>Halo,</p>
            <p>Anda telah diundang untuk bergabung dengan <strong>${institutionName}</strong> sebagai <strong>${roleInIndonesian}</strong> di platform Ziqola Exam.</p>
            
            <div class="info-box">
              <p><span class="info-label">Institusi:</span> ${institutionName}</p>
              <p><span class="info-label">Peran:</span> ${roleInIndonesian}</p>
              <p><span class="info-label">Email:</span> ${to}</p>
            </div>

            <p>Klik tombol di bawah ini untuk menerima undangan dan mulai menggunakan platform:</p>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">Terima Undangan</a>
            </div>

            <div class="expiry-warning">
              ⏰ <strong>Penting:</strong> Undangan ini akan kadaluarsa pada <strong>${expiresAt.toLocaleString(
                'id-ID',
                {
                  dateStyle: 'long',
                  timeStyle: 'short',
                },
              )}</strong>. Pastikan untuk menerima undangan sebelum waktu tersebut.
            </div>

            <p>Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:</p>
            <p style="word-break: break-all; color: #0066cc; font-size: 14px;">${invitationUrl}</p>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">Jika Anda tidak mengharapkan email ini, Anda dapat mengabaikannya dengan aman.</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} Ziqola Exam. All rights reserved.</p>
            <p style="margin: 10px 0 0;">Platform Ujian Online yang Aman dan Terpercaya</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
        Undangan Bergabung dengan ${institutionName}

        Halo,

        Anda telah diundang untuk bergabung dengan ${institutionName} sebagai ${roleInIndonesian} di platform Ziqola Exam.

        Informasi Undangan:
        - Institusi: ${institutionName}
        - Peran: ${roleInIndonesian}
        - Email: ${to}

        Untuk menerima undangan, kunjungi link berikut:
        ${invitationUrl}

        PENTING: Undangan ini akan kadaluarsa pada ${expiresAt.toLocaleString(
          'id-ID',
          {
            dateStyle: 'long',
            timeStyle: 'short',
          },
        )}

        Jika Anda tidak mengharapkan email ini, Anda dapat mengabaikannya dengan aman.

        ---
        © ${new Date().getFullYear()} Ziqola Exam
        Platform Ujian Online yang Aman dan Terpercaya
    `;

    try {
      const info = (await this.transporter.sendMail({
        from: `"Ziqola Exam" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Undangan Bergabung: ${institutionName} - ${roleInIndonesian}`,
        text: textContent,
        html: htmlContent,
      })) as { messageId: string };

      this.logger.log(
        `Invitation email sent successfully to ${to}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${to}:`, error);
      throw error;
    }
  }
}

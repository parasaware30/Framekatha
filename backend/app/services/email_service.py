import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import threading
from typing import Dict, Any

NOTIFICATION_EMAIL = "parasaware05@gmail.com"

def send_contact_notification(name: str, sender_email: str, subject: str, message: str) -> bool:
    """
    Sends email notification to the creator (parasaware05@gmail.com) when a new message is received.
    Supports SMTP configuration from environment variables (.env), and logs details safely.
    Runs asynchronously in a background thread to prevent any HTTP request delays.
    """
    def _dispatch():
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        recipient = os.getenv("CREATOR_EMAIL", NOTIFICATION_EMAIL)

        print(f"📩 [Contact Inquiry Received] From: {name} <{sender_email}> | Subject: {subject} | Target: {recipient}")

        if smtp_user and smtp_password:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = f"🎬 [FrameKatha Contact] {subject} (from {name})"
                msg["From"] = f"FrameKatha Studio <{smtp_user}>"
                msg["To"] = recipient
                msg["Reply-To"] = sender_email

                text_content = f"""
New Contact Message on FrameKatha Portfolio:
--------------------------------------------
From: {name}
Email: {sender_email}
Subject: {subject}

Message:
{message}

--------------------------------------------
Log in to your Admin Panel at http://localhost:5173/admin to manage inquiries.
"""
                html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0b10; color: #ffffff; padding: 24px; }}
    .card {{ background: #161622; border: 1px solid #2a2a3e; border-radius: 16px; padding: 28px; max-width: 580px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
    .header {{ border-bottom: 1px solid #2a2a3e; padding-bottom: 16px; margin-bottom: 20px; }}
    .title {{ font-size: 20px; font-weight: bold; color: #a855f7; margin: 0; }}
    .field {{ margin-bottom: 14px; font-size: 14px; line-height: 1.5; }}
    .label {{ color: #94a3b8; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }}
    .val {{ color: #f8fafc; font-size: 14px; margin-top: 2px; }}
    .msg-box {{ background: #0e0e17; border: 1px solid #232336; border-radius: 12px; padding: 16px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }}
    .btn {{ display: inline-block; background: linear-gradient(135deg, #9333ea, #06b6d4); color: #ffffff; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; margin-top: 20px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 class="title">✨ New FrameKatha Contact Message</h2>
    </div>
    <div class="field">
      <div class="label">Sender Name</div>
      <div class="val"><strong>{name}</strong></div>
    </div>
    <div class="field">
      <div class="label">Sender Email</div>
      <div class="val"><a href="mailto:{sender_email}" style="color: #38bdf8;">{sender_email}</a></div>
    </div>
    <div class="field">
      <div class="label">Subject</div>
      <div class="val">{subject}</div>
    </div>
    <div class="field">
      <div class="label">Message Content</div>
      <div class="msg-box">{message}</div>
    </div>
    <div style="text-align: center;">
      <a href="http://localhost:5173/admin" class="btn">Open Admin CMS Dashboard →</a>
    </div>
  </div>
</body>
</html>
"""
                msg.attach(MIMEText(text_content, "plain"))
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
                print(f"✅ Email notification successfully delivered to {recipient}")
            except Exception as e:
                print(f"⚠️ Failed to send SMTP email (check SMTP credentials in .env): {e}")
        else:
            print(f"ℹ️ SMTP credentials not configured in backend/.env. Message saved to database for {recipient} and accessible in Admin CMS.")

    thread = threading.Thread(target=_dispatch, daemon=True)
    thread.start()
    return True

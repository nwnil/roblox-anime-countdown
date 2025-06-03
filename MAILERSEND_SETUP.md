# MailerSend Email Setup Guide

This guide will help you set up MailerSend for email notifications in your AniBlox Calendar application.

## Step 1: Create MailerSend Account

1. Go to [https://www.mailersend.com/](https://www.mailersend.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Verify Your Domain

1. In your MailerSend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS verification steps provided by MailerSend
5. Wait for domain verification (can take up to 24 hours)

## Step 3: Generate API Token

1. In your MailerSend dashboard, go to "Settings" > "API tokens"
2. Click "Generate new token"
3. Give it a name like "AniBlox Calendar"
4. Select the required scopes:
   - Email sending
   - Analytics (optional)
5. Copy the generated token

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# MailerSend Configuration
MAILERSEND_API_TOKEN=your_actual_api_token_here
MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
MAILERSEND_FROM_NAME=AniBlox Calendar
```

Replace:
- `your_actual_api_token_here` with your actual API token from step 3
- `yourdomain.com` with your verified domain from step 2

## Step 5: Test Email Sending

Once configured, the application will automatically use MailerSend to send:
- Email verification notifications
- Game release countdown notifications
- Game release announcements

## MailerSend Free Plan Limits

- 12,000 emails per month
- 3,000 emails per day
- Perfect for most personal projects

## Troubleshooting

1. **Domain not verified**: Make sure you've completed DNS verification
2. **API token invalid**: Regenerate the token in MailerSend dashboard
3. **Rate limits**: Check if you've exceeded the free plan limits
4. **DKIM/SPF issues**: Ensure proper DNS records are set up

For more help, visit [MailerSend Documentation](https://developers.mailersend.com/) 
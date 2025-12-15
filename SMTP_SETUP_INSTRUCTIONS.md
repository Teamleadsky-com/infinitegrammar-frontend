# Microsoft 365 SMTP Setup Instructions

## ✅ Code Changes Complete

Your code has been migrated to use Microsoft 365 SMTP:
- ✅ Old Resend code backed up to: `email-resend-backup.ts`
- ✅ New SMTP implementation active in: `email.ts`
- ✅ Nodemailer dependencies installed

---

## 🔐 Step 1: Get Microsoft 365 Credentials

### Option A: Use Regular Password (Quick but less secure)

Your credentials:
- **SMTP Server**: `smtp.office365.com`
- **Port**: `587`
- **Username**: `info@infinitegrammar.de`
- **Password**: Your Microsoft 365 password

⚠️ **Security Note**: This works but is less secure. If you have 2FA enabled, you MUST use Option B.

### Option B: Create App Password (Recommended for security)

1. Log into Microsoft 365 Admin Center: https://admin.microsoft.com/
2. Go to: **Users** → **Active users**
3. Click on: `info@infinitegrammar.de`
4. Click: **Security info** or **Mail settings**
5. Look for: **"App passwords"** or **"SMTP authentication"**
6. Enable "Authenticated SMTP" if it's disabled
7. Generate a new app password
8. **Copy the app password** (you won't see it again!)

**Important**: If you don't see the app password option, you may need to:
- Enable 2FA/MFA first in Microsoft 365
- Contact GoDaddy support to enable this feature

---

## ⚙️ Step 2: Set Netlify Environment Variables

### Go to Netlify Dashboard

1. Visit: https://app.netlify.com/
2. Log in to your account
3. Select your **Infinite Grammar** site
4. Go to: **Site configuration** (or **Site settings**)
5. Click: **Environment variables** in the left sidebar

### Add These Variables

Click "Add a variable" for each of these:

| Key | Value | Description |
|-----|-------|-------------|
| `SMTP_HOST` | `smtp.office365.com` | Microsoft 365 SMTP server |
| `SMTP_PORT` | `587` | SMTP port (TLS) |
| `SMTP_USER` | `info@infinitegrammar.de` | Your full email address |
| `SMTP_PASS` | `[your password or app password]` | Your M365 password or app password |
| `FROM_EMAIL` | `Infinite Grammar <info@infinitegrammar.de>` | Display name and email |
| `SITE_URL` | `https://infinitegrammar.com` | Your website URL |

### Remove Old Variable

**Important**: Remove or disable the old Resend variable:
- ❌ Remove: `RESEND_API_KEY` (no longer needed)

### Save Changes

1. Click "Save" after adding each variable
2. All variables should be set to: **All scopes** (Production, Deploy Previews, Branch deploys)

---

## 🚀 Step 3: Deploy

### Option A: Trigger Manual Deploy

1. In Netlify dashboard, go to: **Deploys**
2. Click: **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### Option B: Push to Git (Automatic Deploy)

```bash
git add .
git commit -m "Migrate to Microsoft 365 SMTP"
git push
```

Netlify will automatically detect and deploy the changes.

---

## 🧪 Step 4: Test Email Sending

### Test by Registering a New Account

1. Go to: https://infinitegrammar.com/auth
2. Create a new test account with your email
3. Check your inbox for the welcome email
4. **Check spam folder** if not in inbox

### Expected Result

You should receive an email:
- **From**: Infinite Grammar <info@infinitegrammar.de>
- **Subject**: Welcome to Infinite Grammar! 🎉
- **Content**: Welcome message with "Start Learning Now" button

---

## 🔍 Troubleshooting

### Error: "Authentication Failed"

**Problem**: SMTP credentials are incorrect

**Solutions**:
1. Double-check `SMTP_USER` is the full email: `info@infinitegrammar.de`
2. Verify `SMTP_PASS` is correct (try copying again)
3. If using 2FA, make sure you're using an **app password**, not your regular password
4. Ensure "Authenticated SMTP" is enabled in Microsoft 365

### Error: "Connection Timeout"

**Problem**: SMTP port is blocked or wrong

**Solutions**:
1. Verify `SMTP_PORT` is set to `587` (not 465 or 25)
2. Ensure `SMTP_HOST` is `smtp.office365.com`
3. Check if your hosting provider blocks SMTP ports (unlikely with Netlify)

### Emails Going to Spam

**Problem**: Sender reputation or missing SPF/DKIM records

**Solutions**:
1. Add SPF record to GoDaddy DNS:
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:spf.protection.outlook.com ~all
   ```

2. Enable DKIM in Microsoft 365:
   - Go to Microsoft 365 Admin Center
   - **Settings** → **Domains** → Select `infinitegrammar.de`
   - Enable DKIM signing
   - Add the DKIM records to GoDaddy DNS

3. Add DMARC record to GoDaddy DNS:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:info@infinitegrammar.de
   ```

4. Wait 24-48 hours for DNS propagation

### No Emails Received

**Problem**: Email not sent or caught by spam filter

**Solutions**:
1. Check Netlify function logs:
   - Go to Netlify dashboard → **Functions**
   - Look for errors in the function logs
2. Check spam/junk folder
3. Try sending to a different email address
4. Verify environment variables are set correctly
5. Check Microsoft 365 sent items to see if email was sent

### Error in Netlify Logs: "Missing Credentials"

**Problem**: Environment variables not set

**Solutions**:
1. Verify all 6 environment variables are set in Netlify
2. Check for typos in variable names
3. Redeploy after setting variables

---

## 📊 Checking Microsoft 365 Logs

To see if emails are being sent from your Microsoft 365 account:

1. Log into: https://admin.microsoft.com/
2. Go to: **Exchange** → **Mail flow** → **Message trace**
3. Search for messages from: `info@infinitegrammar.de`
4. Check delivery status

---

## 🔄 Rolling Back to Resend (If Needed)

If you need to go back to Resend:

```bash
# Restore the Resend version
cp netlify/functions/_shared/email-resend-backup.ts netlify/functions/_shared/email.ts

# Update Netlify environment variables
# Remove: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
# Add back: RESEND_API_KEY=[your Resend API key]

# Deploy
git add .
git commit -m "Rollback to Resend"
git push
```

---

## ✅ Success Checklist

- [ ] Got Microsoft 365 password or app password
- [ ] Set all 6 environment variables in Netlify
- [ ] Removed old RESEND_API_KEY variable
- [ ] Deployed the changes
- [ ] Tested by registering a new account
- [ ] Received welcome email
- [ ] Email is not in spam
- [ ] Sender shows as "Infinite Grammar <info@infinitegrammar.de>"

---

## 📞 Need Help?

- **Microsoft 365 SMTP docs**: https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365
- **GoDaddy Microsoft 365 support**: https://www.godaddy.com/help/office-365-1
- **Netlify environment variables**: https://docs.netlify.com/environment-variables/overview/

# Email Migration Guide: Moving to info@infinitegrammar.de

## Overview

You want to migrate from development email to your Microsoft 365 email: **info@infinitegrammar.de**

You have **two options** for sending emails:

---

## ✅ Option 1: Use Resend with Custom Domain (RECOMMENDED)

**Pros:**
- ✅ Easier setup (just add DNS records)
- ✅ Better deliverability (Resend handles SPF, DKIM, DMARC)
- ✅ Email analytics and monitoring
- ✅ Less maintenance required
- ✅ Free tier: 3,000 emails/month, 100 emails/day

**Cons:**
- Requires Resend account (you may already have one)
- Third-party dependency

### Steps for Option 1:

#### 1. Log into Resend Dashboard
Go to: https://resend.com/domains

If you don't have an account, sign up at: https://resend.com/signup

#### 2. Add Your Domain
- Click "Add Domain"
- Enter: `infinitegrammar.de`
- Resend will provide DNS records (usually 3 records)

#### 3. Add DNS Records in GoDaddy
1. Log into GoDaddy: https://account.godaddy.com/
2. Go to: **My Products** → Find `infinitegrammar.de` → Click **DNS**
3. Add the DNS records provided by Resend:

**Example records** (yours will have different values):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | v=spf1 include:_spf.resend.com ~all | 1 Hour |
| TXT | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEBA... | 1 Hour |
| TXT | _dmarc | v=DMARC1; p=none; | 1 Hour |

4. Click "Add Record" for each one
5. Save changes

#### 4. Verify Domain in Resend
- Return to Resend dashboard
- Click "Verify Domain"
- Wait for verification (DNS propagation can take 1-48 hours, usually 1-2 hours)

#### 5. Update Netlify Environment Variables
1. Go to: https://app.netlify.com/
2. Select your site
3. Go to: **Site configuration** → **Environment variables**
4. Ensure these variables are set:
   ```
   RESEND_API_KEY=[your Resend API key]
   FROM_EMAIL=Infinite Grammar <info@infinitegrammar.de>
   SITE_URL=https://infinitegrammar.com
   ```
5. Click "Save"

#### 6. Deploy
- Redeploy your site (or it will auto-deploy on next push)
- Test by registering a new account

**That's it! Your code is already configured for Option 1.**

---

## Option 2: Direct SMTP with Microsoft 365

**Pros:**
- ✅ Direct control over email sending
- ✅ No third-party dependency
- ✅ Uses your existing Microsoft 365 subscription

**Cons:**
- ❌ More complex setup
- ❌ Requires managing SMTP credentials
- ❌ You handle deliverability issues yourself
- ❌ No built-in analytics
- ❌ May require creating app passwords

### Steps for Option 2:

#### 1. Get Microsoft 365 SMTP Credentials

**Option A: Use regular password** (not recommended for security)
- Username: `info@infinitegrammar.de`
- Password: Your Microsoft 365 password
- SMTP Server: `smtp.office365.com`
- Port: `587` (TLS)

**Option B: Create App Password** (recommended)
1. Log into Microsoft 365 admin center: https://admin.microsoft.com/
2. Go to: **Users** → **Active users** → Click your email
3. Go to: **Mail** → **Manage email apps**
4. Enable "Authenticated SMTP"
5. Generate an app password (if 2FA is enabled)
6. Save the app password

#### 2. Update Code to Use SMTP
Replace the current email file with the SMTP version:

```bash
# Backup current file
mv netlify/functions/_shared/email.ts netlify/functions/_shared/email-resend-backup.ts

# Use SMTP version
mv netlify/functions/_shared/email-smtp.ts netlify/functions/_shared/email.ts
```

#### 3. Update Netlify Environment Variables
1. Go to: https://app.netlify.com/
2. Select your site
3. Go to: **Site configuration** → **Environment variables**
4. Add these variables:
   ```
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_USER=info@infinitegrammar.de
   SMTP_PASS=[your Microsoft 365 password or app password]
   FROM_EMAIL=Infinite Grammar <info@infinitegrammar.de>
   SITE_URL=https://infinitegrammar.com
   ```
5. Remove: `RESEND_API_KEY` (no longer needed)
6. Click "Save"

#### 4. Deploy and Test
- Deploy your site
- Test by registering a new account

---

## Comparison Table

| Feature | Option 1 (Resend) | Option 2 (SMTP) |
|---------|-------------------|-----------------|
| Setup Complexity | Easy (DNS records only) | Medium (credentials + code) |
| Deliverability | Excellent (managed) | Good (DIY) |
| Analytics | Yes | No |
| Cost | Free (3k/month) | Included in M365 |
| Maintenance | Low | Medium |
| Security | Managed | Self-managed |

---

## Recommendation

**Use Option 1 (Resend)** unless you have specific requirements for direct SMTP.

Resend is industry-standard for transactional emails and is used by companies like Vercel, Linear, and Raycast.

---

## Current Status

✅ Code is already updated to support your custom domain
✅ `FROM_EMAIL` is set to: `Infinite Grammar <info@infinitegrammar.de>`
✅ SMTP alternative implementation is ready in: `email-smtp.ts`

**Next step:** Choose your option and follow the steps above.

---

## Testing

After migration, test email sending by:

1. Register a new account at: https://infinitegrammar.com/auth
2. Check if you receive the welcome email
3. Check spam folder if not in inbox
4. Verify email sender shows: `Infinite Grammar <info@infinitegrammar.de>`

---

## Troubleshooting

### Resend Domain Not Verifying
- Wait longer (DNS propagation can take up to 48 hours)
- Check DNS records are entered correctly in GoDaddy
- Ensure there are no conflicting SPF/DKIM records

### SMTP Authentication Failed
- Verify username is `info@infinitegrammar.de` (full email)
- Check password is correct
- If using 2FA, must use app password
- Ensure "Authenticated SMTP" is enabled in Microsoft 365

### Emails Going to Spam
- **With Resend:** Ensure domain is verified and all DNS records are added
- **With SMTP:** Add SPF, DKIM, and DMARC records manually to GoDaddy DNS
- Send from a warmed-up domain (send gradually increasing volume)

---

## Need Help?

- **Resend Docs:** https://resend.com/docs
- **Microsoft 365 SMTP:** https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365

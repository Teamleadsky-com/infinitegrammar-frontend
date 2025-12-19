import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: 'en' | 'de'; // Optional: force a specific language
}

const WAITLIST_STORAGE_KEY = "comingSoonEmails";

// Helper to URL-encode form data for Netlify
const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

export const ComingSoonModal = ({ open, onOpenChange, language }: ComingSoonModalProps) => {
  const { t, i18n } = useTranslation();

  // Use forced language if provided, otherwise use current language
  const currentLang = language || i18n.language;
  const tLang = (key: string) => t(key, { lng: currentLang });
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError(tLang('comingSoon.errorEmail'));
      return;
    }

    if (!validateEmail(email)) {
      setError(tLang('comingSoon.errorEmailInvalid'));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send to Netlify Forms
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "coming-soon-waitlist",
          "bot-field": "", // Honeypot field (must be empty)
          email,
          timestamp: new Date().toISOString(),
        }),
      });

      // Store email locally
      const existingEmails = localStorage.getItem(WAITLIST_STORAGE_KEY);
      const emailList = existingEmails ? JSON.parse(existingEmails) : [];

      emailList.push({
        email,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(emailList));

      // Show success state
      setIsSubmitted(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError(tLang('comingSoon.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setEmail("");
      setError("");
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">🚧 {tLang('comingSoon.title')}</DialogTitle>
              <DialogDescription className="text-base pt-2">
                {tLang('comingSoon.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {tLang('comingSoon.message')}
                </p>
              </div>

              {/* Netlify form */}
              <form
                name="coming-soon-waitlist"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Required hidden input for Netlify */}
                <input type="hidden" name="form-name" value="coming-soon-waitlist" />

                {/* Honeypot field */}
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {tLang('comingSoon.emailLabel')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={tLang('comingSoon.emailPlaceholder')}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={error ? "border-error" : ""}
                    autoFocus={false}
                    disabled={isSubmitting}
                  />
                  {error && <p className="text-sm text-error">{error}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tLang('comingSoon.submitting')}
                    </>
                  ) : (
                    tLang('comingSoon.notifyButton')
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">✅ {tLang('comingSoon.successTitle')}</DialogTitle>
              <DialogDescription className="text-base pt-2">
                {tLang('comingSoon.successMessage')}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Button onClick={handleClose} className="w-full" size="lg">
                {tLang('comingSoon.closeButton')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

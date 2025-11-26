import { useState } from "react";
import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercisesCompleted: number;
}

const WAITLIST_STORAGE_KEY = "waitlistEmails";

// Helper to URL-encode form data for Netlify
const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

export const WaitlistModal = ({
  open,
  onOpenChange,
  exercisesCompleted,
}: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Send to Netlify Forms
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "waitlist",
          email,
          exercisesCompleted: String(exercisesCompleted),
        }),
      });

      // Optionally also store email locally
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
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setEmail("");
      setError("");
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">🎉 Congratulations!</DialogTitle>
              <DialogDescription className="text-base pt-2">
                {exercisesCompleted === 0
                  ? "You are in the right place to learn! Start making great progress."
                  : `You've completed ${exercisesCompleted} exercises! You're making great progress.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  Get infinite Lückentexte that never repeat
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Always-new Lückentexte tailored to your level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>
                      Never run out of material before your TestDaF or telc exam
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Focus on the grammar sections you need to improve</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Over the next weeks we’ll unlock more exam-style Lückentexte, so
                you can practice daily without ever seeing the same text twice.
              </p>

              {/* Netlify form */}
              <form
                name="waitlist"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Required hidden input for Netlify */}
                <input type="hidden" name="form-name" value="waitlist" />

                {/* Honeypot field */}
                <p className="hidden">
                  <label>
                    Don’t fill this out if you're human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Join the waitlist to secure 2.99€/month early adopter price
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={error ? "border-error" : ""}
                    autoFocus={false}
                  />
                  {error && <p className="text-sm text-error">{error}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Join Waitlist
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maybe later
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">✨ You're on the list!</DialogTitle>
              <DialogDescription className="text-base pt-2">
                We'll notify you soon. Get ready for unlimited German grammar
                practice!
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Button onClick={handleClose} className="w-full" size="lg">
                Continue Learning
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

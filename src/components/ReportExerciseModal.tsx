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
import { Textarea } from "@/components/ui/textarea";

interface Gap {
  no: number;
  correct: string;
  distractors: string[];
  explanation: string;
}

interface ReportExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  exerciseText: string;
  gaps: Gap[];
}

// Helper to URL-encode form data for Netlify
const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

export const ReportExerciseModal = ({
  open,
  onOpenChange,
  exerciseId,
  exerciseText,
  gaps,
}: ReportExerciseModalProps) => {
  const [reportText, setReportText] = useState("");
  const [honeypotName, setHoneypotName] = useState("");
  const [honeypotEmail, setHoneypotEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format gaps data for submission
  const formatGapsData = () => {
    return gaps
      .map((gap) => {
        const allOptions = [gap.correct, ...gap.distractors].sort();
        const optionsText = allOptions
          .map((opt) => (opt === gap.correct ? `${opt} (correct)` : opt))
          .join(", ");
        return `Gap ${gap.no}: ${optionsText}`;
      })
      .join(", ");
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    // Honeypot check - silently reject bot submissions
    if (honeypotName || honeypotEmail) {
      setIsSubmitted(true);
      return;
    }

    // Validate report text
    if (!reportText.trim()) {
      setError("Please describe the issue");
      return;
    }

    if (reportText.trim().length < 10) {
      setError("Please provide more details (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to Netlify Forms
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "exercise-report",
          "bot-field": "",
          name: "", // Honeypot field
          email: "", // Honeypot field
          subject: exerciseId, // Subject line for email notifications
          exerciseId,
          exerciseText: exerciseText.substring(0, 200), // Limit text length
          gaps: formatGapsData(),
          reportText,
          timestamp: new Date().toISOString(),
        }),
      });

      // Mark exercise as inactive in the database
      const API_BASE = import.meta.env.DEV ? 'http://localhost:8888/api' : '/api';
      await fetch(`${API_BASE}/report-exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          reportText,
        }),
      });

      // Show success state
      setIsSubmitted(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setReportText("");
      setHoneypotName("");
      setHoneypotEmail("");
      setError("");
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Report Exercise Issue</DialogTitle>
              <DialogDescription className="text-sm pt-2">
                Found an error in the exercise text or answer? Please let us know
                so we can fix it and improve the quality for everyone.
              </DialogDescription>
            </DialogHeader>

            <form
              name="exercise-report"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-4 py-4"
            >
              {/* Required hidden input for Netlify */}
              <input type="hidden" name="form-name" value="exercise-report" />

              {/* Honeypot fields */}
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </p>
              <p className="hidden" aria-hidden="true">
                <label>
                  Name:{" "}
                  <input
                    name="name"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypotName}
                    onChange={(e) => setHoneypotName(e.target.value)}
                  />
                </label>
              </p>
              <p className="hidden" aria-hidden="true">
                <label>
                  Email:{" "}
                  <input
                    name="email"
                    type="email"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypotEmail}
                    onChange={(e) => setHoneypotEmail(e.target.value)}
                  />
                </label>
              </p>

              {/* Hidden fields for exercise data */}
              <input type="hidden" name="exerciseId" value={exerciseId} />
              <input
                type="hidden"
                name="exerciseText"
                value={exerciseText.substring(0, 200)}
              />
              <input type="hidden" name="timestamp" value={new Date().toISOString()} />

              <div className="space-y-2">
                <label htmlFor="reportText" className="text-sm font-medium">
                  Describe the issue
                </label>
                <Textarea
                  id="reportText"
                  name="reportText"
                  placeholder="Example: Gap 2 has the wrong correct answer - should be 'waren' not 'sind'"
                  value={reportText}
                  onChange={(e) => {
                    setReportText(e.target.value);
                    setError("");
                  }}
                  className={error ? "border-error" : ""}
                  rows={4}
                />
                {error && <p className="text-sm text-error">{error}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Report"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">✓ Thank you!</DialogTitle>
              <DialogDescription className="text-sm pt-2">
                Your report has been submitted. We'll review it and fix the issue as
                soon as possible.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Button onClick={handleClose} className="w-full">
                Continue Learning
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

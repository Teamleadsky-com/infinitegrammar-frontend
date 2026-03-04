import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Pause, Bell, BellOff, Clock } from "lucide-react";

const EmailPreferences = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<{
    email: string;
    name: string | null;
    subscribed: boolean;
    frequency: string;
    paused_until: string | null;
  } | null>(null);

  const API_BASE = import.meta.env.DEV
    ? "http://localhost:8888/api"
    : "/api";

  useEffect(() => {
    if (!token) {
      setError(t("emailPreferences.invalidToken"));
      setLoading(false);
      return;
    }

    const fetchPrefs = async () => {
      try {
        // Check for quick action in URL
        const action = searchParams.get("action");
        const url = action
          ? `${API_BASE}/email-preferences?token=${token}&action=${action}`
          : `${API_BASE}/email-preferences?token=${token}`;

        const response = await fetch(url);
        if (!response.ok) {
          setError(t("emailPreferences.invalidToken"));
          return;
        }

        const data = await response.json();

        // If it was a quick action, show success and refetch prefs
        if (action && data.success) {
          toast({
            title: t("emailPreferences.updated"),
          });
          // Refetch current state
          const refetch = await fetch(`${API_BASE}/email-preferences?token=${token}`);
          if (refetch.ok) {
            setPrefs(await refetch.json());
          }
        } else if (!action) {
          setPrefs(data);
        }
      } catch {
        setError(t("emailPreferences.invalidToken"));
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, [token]);

  const handleAction = async (action: string, frequency?: string) => {
    if (!token) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/email-preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, frequency }),
      });

      if (response.ok) {
        toast({ title: t("emailPreferences.updated") });
        // Refetch
        const refetch = await fetch(`${API_BASE}/email-preferences?token=${token}`);
        if (refetch.ok) {
          setPrefs(await refetch.json());
        }
      }
    } catch {
      toast({
        title: "Error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (!prefs) return null;
    if (!prefs.subscribed) {
      return <Badge variant="destructive">{t("emailPreferences.unsubscribed")}</Badge>;
    }
    if (prefs.frequency === "paused" && prefs.paused_until) {
      const until = new Date(prefs.paused_until).toLocaleDateString();
      return <Badge variant="secondary">{t("emailPreferences.pausedUntil", { date: until })}</Badge>;
    }
    if (prefs.frequency === "reduced") {
      return <Badge variant="secondary">{t("emailPreferences.reducedLabel")}</Badge>;
    }
    return <Badge variant="default">{t("emailPreferences.active")}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t("emailPreferences.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">{t("emailPreferences.title")}</h1>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{t("emailPreferences.title")}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="p-6 space-y-6 animate-fade-in">
          {/* Greeting + Status */}
          <div className="space-y-2">
            <p className="text-lg">
              {t("emailPreferences.greeting", { name: prefs?.name || "dort" })}
            </p>
            <p className="text-sm text-muted-foreground">{prefs?.email}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("emailPreferences.currentStatus")}:</span>
              {getStatusBadge()}
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            {prefs?.subscribed ? (
              <>
                {/* Pause for 1 week */}
                <Button
                  variant={prefs.frequency === "paused" ? "default" : "outline"}
                  className="w-full justify-start gap-3"
                  disabled={saving || prefs.frequency === "paused"}
                  onClick={() => handleAction("pause_week")}
                >
                  <Pause className="h-4 w-4" />
                  {t("emailPreferences.pauseWeek")}
                </Button>

                {/* Reduce frequency */}
                <Button
                  variant={prefs.frequency === "reduced" ? "default" : "outline"}
                  className="w-full justify-start gap-3"
                  disabled={saving}
                  onClick={() => handleAction("change_frequency", "reduced")}
                >
                  <Clock className="h-4 w-4" />
                  {t("emailPreferences.reduceFrequency")}
                </Button>

                {/* Normal frequency */}
                <Button
                  variant={prefs.frequency === "normal" ? "default" : "outline"}
                  className="w-full justify-start gap-3"
                  disabled={saving}
                  onClick={() => handleAction("change_frequency", "normal")}
                >
                  <Bell className="h-4 w-4" />
                  {t("emailPreferences.normalFrequency")}
                </Button>

                {/* Unsubscribe */}
                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                        disabled={saving}
                      >
                        <BellOff className="h-4 w-4" />
                        {t("emailPreferences.unsubscribe")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("emailPreferences.unsubscribe")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("emailPreferences.confirmUnsubscribe")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("emailPreferences.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction("unsubscribe")}>
                          {t("emailPreferences.unsubscribe")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            ) : (
              /* Resubscribe */
              <Button
                variant="default"
                className="w-full justify-start gap-3"
                disabled={saving}
                onClick={() => handleAction("resubscribe")}
              >
                <Bell className="h-4 w-4" />
                {t("emailPreferences.resubscribe")}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EmailPreferences;

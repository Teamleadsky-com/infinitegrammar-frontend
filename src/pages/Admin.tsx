import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Mail,
  BarChart3,
  FileText,
  Settings,
  Send,
  Grid3x3,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ADMIN_EMAIL = "aleksandr.zuravliov1@gmail.com";

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.email === ADMIN_EMAIL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [funnelPeriod, setFunnelPeriod] = useState<"week" | "month" | "all">("month");
  const [testEmail, setTestEmail] = useState("");
  const [testTemplateSlug, setTestTemplateSlug] = useState("reminder");
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  // Template editing state
  const [editingTemplates, setEditingTemplates] = useState<Record<number, { subject: string; body_html: string }>>({});

  // Winback state
  const [sendingWinback, setSendingWinback] = useState(false);
  const [winbackResult, setWinbackResult] = useState<any>(null);
  const [winbackDaysInput, setWinbackDaysInput] = useState(14);

  // Exercise stats state
  type DemandSort = 'popularity' | 'remaining';
  const [countsBySection, setCountsBySection] = useState<any[]>([]);
  const [countsByTopic, setCountsByTopic] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [demandData, setDemandData] = useState<any[]>([]);
  const [demandSort, setDemandSort] = useState<DemandSort>('popularity');

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    max_emails_per_week: 2,
    comeback_mode_after_days: 30,
    comeback_max_per_week: 1,
    winback_after_days: 14,
  });

  const API_BASE = import.meta.env.DEV
    ? "http://localhost:8888/api"
    : "/api";

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [isAdmin, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/campaign-admin?admin_email=${ADMIN_EMAIL}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setSettingsForm({
          max_emails_per_week: result.config.max_emails_per_week,
          comeback_mode_after_days: result.config.comeback_mode_after_days,
          comeback_max_per_week: result.config.comeback_max_per_week,
          winback_after_days: result.config.winback_after_days || 14,
        });
        setWinbackDaysInput(result.config.winback_after_days || 14);
        // Initialize template editing state
        const tmplState: Record<number, { subject: string; body_html: string }> = {};
        result.templates?.forEach((t: any) => {
          tmplState[t.id] = { subject: t.subject, body_html: t.body_html };
        });
        setEditingTemplates(tmplState);
      }
      // Fetch exercise stats for charts
      const [snapshotRes, coverageRes, demandRes] = await Promise.all([
        fetch(`${API_BASE}/exercise-count-snapshots`),
        fetch(`${API_BASE}/exercise-coverage-stats`),
        fetch(`${API_BASE}/admin-section-demand`),
      ]);
      if (snapshotRes.ok) {
        const snap = await snapshotRes.json();
        setCountsBySection(snap.bySection || []);
        setCountsByTopic(snap.byTopic || []);
      }
      if (coverageRes.ok) {
        const cov = await coverageRes.json();
        setHeatmapData(cov.heatmap || []);
      }
      if (demandRes.ok) {
        const dem = await demandRes.json();
        setDemandData(dem.sections || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const postAction = async (body: any) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/campaign-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: ADMIN_EMAIL, ...body }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: t("admin.saved") });
        await fetchData();
      }
      return result;
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSendWinback = async () => {
    setSendingWinback(true);
    setWinbackResult(null);
    try {
      const response = await fetch(`${API_BASE}/campaign-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_email: ADMIN_EMAIL, action: "send_winback", winback_days: winbackDaysInput }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        toast({ title: `Error ${response.status}`, description: errorText, variant: "destructive" });
        return;
      }
      const result = await response.json();
      setWinbackResult(result);
      if (result.success) {
        toast({ title: t("admin.winbackSent", { count: result.sent_count }) });
        await fetchData();
      } else {
        toast({ title: result.error || "Error", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Network Error", description: error.message || "Request failed", variant: "destructive" });
    } finally {
      setSendingWinback(false);
    }
  };

  if (!isAdmin) return null;

  const getFunnelData = () => {
    if (!data?.funnel) return [];
    const f = data.funnel[funnelPeriod] || data.funnel.all;
    return [
      { name: t("admin.totalSent"), value: parseInt(f.total_sent) || 0 },
      { name: t("admin.totalClicked"), value: parseInt(f.total_clicked) || 0 },
      { name: t("admin.totalStarted"), value: parseInt(f.total_started) || 0 },
      { name: t("admin.totalCompleted"), value: parseInt(f.total_completed) || 0 },
    ];
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Mail className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                {t("admin.dashboard")}
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                <Grid3x3 className="h-4 w-4" />
                {t("admin.statisticsTab")}
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <FileText className="h-4 w-4" />
                {t("admin.templates")}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                {t("admin.settings")}
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Campaign Toggle */}
              <Card className="p-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {data?.config?.enabled ? t("admin.campaignEnabled") : t("admin.campaignDisabled")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("admin.activeSchedules")}: {data?.activeSchedules || 0}
                    </p>
                  </div>
                  <Switch
                    checked={data?.config?.enabled || false}
                    onCheckedChange={() => postAction({ action: "toggle_campaign" })}
                    disabled={saving}
                  />
                </div>
              </Card>

              {/* Funnel Chart */}
              <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t("admin.emailFunnel")}</h3>
                  <div className="flex gap-2">
                    {(["week", "month", "all"] as const).map((p) => (
                      <Button
                        key={p}
                        variant={funnelPeriod === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFunnelPeriod(p)}
                      >
                        {t(`admin.period_${p}`)}
                      </Button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getFunnelData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Preference Stats */}
              <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-lg font-semibold mb-4">{t("admin.userPreferences")}</h3>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{data?.preferences?.unsubscribed || 0}</Badge>
                    <span className="text-sm">{t("admin.unsubscribed")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{data?.preferences?.paused || 0}</Badge>
                    <span className="text-sm">{t("admin.paused")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{data?.preferences?.reduced_frequency || 0}</Badge>
                    <span className="text-sm">{t("admin.reducedFrequency")}</span>
                  </div>
                </div>
              </Card>

              {/* Winback Campaign */}
              <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h3 className="text-lg font-semibold mb-2">{t("admin.winbackTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("admin.winbackDesc", { days: winbackDaysInput })}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">{t("admin.winbackInactiveDays")}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      className="w-24"
                      value={winbackDaysInput}
                      onChange={(e) => setWinbackDaysInput(parseInt(e.target.value) || 14)}
                    />
                  </div>
                  <Button
                    onClick={handleSendWinback}
                    disabled={sendingWinback}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sendingWinback ? t("admin.winbackSending") : t("admin.winbackSendButton")}
                  </Button>
                </div>
                {winbackResult && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {t("admin.winbackResult", {
                      sent: winbackResult.sent_count || 0,
                      total: winbackResult.total_inactive || 0,
                    })}
                  </p>
                )}
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6">
              {/* Total by Grammar Section */}
              <Card className="p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalBySection')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countsBySection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="section" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="count" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Total by Content Topic */}
              <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h3 className="text-lg font-semibold mb-4">{t('exerciseStats.totalByTopic')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countsByTopic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Exercise Count per Level and Grammar Section (Heatmap Table) */}
              <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-base md:text-lg font-semibold mb-4">{t('exerciseStats.heatmap')}</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="px-4 md:px-0">
                    {(() => {
                      const tableData = heatmapData
                        .filter((item) => item.level !== 'NULL')
                        .sort((a, b) => {
                          const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                          const levelDiff = levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
                          if (levelDiff !== 0) return levelDiff;
                          if (a.orderInLevel !== null && b.orderInLevel !== null) {
                            return a.orderInLevel - b.orderInLevel;
                          }
                          return a.sectionName.localeCompare(b.sectionName);
                        });

                      return (
                        <div className="min-w-max">
                          <table className="w-full border-collapse text-sm md:text-base">
                            <thead>
                              <tr>
                                <th className="border border-border p-2 md:p-3 text-left bg-muted/50 text-xs md:text-sm">Level</th>
                                <th className="border border-border p-2 md:p-3 text-left bg-muted/50 text-xs md:text-sm">Grammar Section</th>
                                <th className="border border-border p-2 md:p-3 text-center bg-muted/50 text-xs md:text-sm">Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tableData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-muted/30">
                                  <td className="border border-border p-2 md:p-3 font-medium text-xs md:text-sm">{item.level}</td>
                                  <td className="border border-border p-2 md:p-3 text-xs md:text-sm">{item.sectionName}</td>
                                  <td className="border border-border p-2 md:p-3 text-center font-semibold text-xs md:text-sm">{item.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Card>

              {/* Exercise Demand by Grammar Section */}
              {demandData.length > 0 && (() => {
                const sortedDemand = [...demandData].sort((a, b) => {
                  if (demandSort === 'remaining') return a.remaining - b.remaining;
                  return b.completed - a.completed;
                }).map((item) => ({
                  ...item,
                  label: `${item.sectionName} (${item.level})`,
                }));

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{t('exerciseStats.sectionDemand')}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant={demandSort === 'popularity' ? 'default' : 'outline'} size="sm" onClick={() => setDemandSort('popularity')}>
                          {t('exerciseStats.sortByPopularity')}
                        </Button>
                        <Button variant={demandSort === 'remaining' ? 'default' : 'outline'} size="sm" onClick={() => setDemandSort('remaining')}>
                          {t('exerciseStats.sortByRemaining')}
                        </Button>
                      </div>
                    </div>

                    <Card className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                      <ResponsiveContainer width="100%" height={Math.max(400, sortedDemand.length * 36)}>
                        <BarChart data={sortedDemand} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                          <YAxis type="category" dataKey="label" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "11px" }} width={250} tick={{ fill: "hsl(var(--foreground))" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                            formatter={(value: number, name: string) => {
                              const label = name === 'completed' ? t('exerciseStats.completed') : t('exerciseStats.remaining');
                              return [value, label];
                            }}
                            labelFormatter={(label) => label}
                          />
                          <Legend formatter={(value) => {
                            if (value === 'completed') return t('exerciseStats.completed');
                            if (value === 'remaining') return t('exerciseStats.remaining');
                            return value;
                          }} />
                          <Bar dataKey="completed" stackId="a" fill="hsl(142, 70%, 45%)" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="remaining" stackId="a" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              {data?.templates?.map((template: any) => (
                <Card key={template.id} className="p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold capitalize">{template.slug}</h3>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("admin.subject")}</Label>
                      <Input
                        value={editingTemplates[template.id]?.subject || ""}
                        onChange={(e) =>
                          setEditingTemplates((prev) => ({
                            ...prev,
                            [template.id]: { ...prev[template.id], subject: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("admin.bodyHtml")}</Label>
                      <textarea
                        className="w-full min-h-[200px] p-3 border rounded-md bg-background text-sm font-mono resize-y"
                        value={editingTemplates[template.id]?.body_html || ""}
                        onChange={(e) =>
                          setEditingTemplates((prev) => ({
                            ...prev,
                            [template.id]: { ...prev[template.id], body_html: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        disabled={saving}
                        onClick={() =>
                          postAction({
                            action: "update_template",
                            template_id: template.id,
                            subject: editingTemplates[template.id]?.subject,
                            body_html: editingTemplates[template.id]?.body_html,
                          })
                        }
                      >
                        {t("admin.save")}
                      </Button>

                      <Dialog open={testDialogOpen && testTemplateSlug === template.slug} onOpenChange={(open) => {
                        setTestDialogOpen(open);
                        if (open) setTestTemplateSlug(template.slug);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Send className="h-4 w-4" />
                            {t("admin.sendTest")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("admin.sendTest")}</DialogTitle>
                            <DialogDescription>{t("admin.testEmailDescription")}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label>{t("admin.testEmailAddress")}</Label>
                            <Input
                              type="email"
                              value={testEmail}
                              onChange={(e) => setTestEmail(e.target.value)}
                              placeholder="test@example.com"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              disabled={saving || !testEmail}
                              onClick={async () => {
                                await postAction({
                                  action: "send_test",
                                  test_email: testEmail,
                                  template_slug: template.slug,
                                });
                                setTestDialogOpen(false);
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {t("admin.send")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="p-6 animate-fade-in">
                <h3 className="text-lg font-semibold mb-6">{t("admin.campaignRules")}</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t("admin.maxEmailsPerWeek")}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      value={settingsForm.max_emails_per_week}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, max_emails_per_week: parseInt(e.target.value) || 2 }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.maxEmailsPerWeekDesc")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("admin.comebackThreshold")}</Label>
                    <Input
                      type="number"
                      min={7}
                      max={90}
                      value={settingsForm.comeback_mode_after_days}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, comeback_mode_after_days: parseInt(e.target.value) || 30 }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.comebackThresholdDesc")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("admin.comebackMaxPerWeek")}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={3}
                      value={settingsForm.comeback_max_per_week}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, comeback_max_per_week: parseInt(e.target.value) || 1 }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.comebackMaxPerWeekDesc")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("admin.winbackAfterDays")}</Label>
                    <Input
                      type="number"
                      min={7}
                      max={90}
                      value={settingsForm.winback_after_days}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, winback_after_days: parseInt(e.target.value) || 14 }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">{t("admin.winbackAfterDaysDesc")}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">{t("admin.spacedRepetitionSchedule")}</h4>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      {[
                        { step: 0, days: "+1 day" },
                        { step: 1, days: "+3 days" },
                        { step: 2, days: "+7 days" },
                        { step: 3, days: "+14 days" },
                      ].map(({ step, days }) => (
                        <div key={step} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">Step {step + 1}</p>
                          <p className="text-xs text-muted-foreground">{days}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    disabled={saving}
                    onClick={() =>
                      postAction({ action: "update_config", ...settingsForm })
                    }
                  >
                    {t("admin.save")}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Admin;

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/cards";
import { StatsCard } from "@/components/stats-card";
import { CampaignChart } from "@/components/campaign-chart";
import { RecentActivity } from "@/components/recent-activity";
import { Users, Mail, TrendingUp, Clock } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueFollowUps, setDueFollowUps] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const today = new Date();
      const last7Days = new Date();
      last7Days.setDate(today.getDate() - 7);

      // 🔥 Fetch all leads
      const { data: leads, error } = await supabase.from("leads").select("*");

      if (error) {
        console.error(error);
        return;
      }

      const due =
        leads?.filter((lead) => {
          if (!lead.follow_up_date) return false;

          return (
            new Date(lead.follow_up_date) <= new Date() &&
            lead.status !== "replied" &&
            lead.status !== "converted"
          );
        }) || [];

      setDueFollowUps(due);

      // =========================
      // 📊 REAL STATS CALCULATION
      // =========================

      const totalLeads = leads?.length || 0;

      const newLeads =
        leads?.filter((l) => new Date(l.created_at) >= last7Days).length || 0;

      const activeConversations =
        leads?.filter((l) => l.status === "pending" || l.status === "contacted")
          .length || 0;

      const conversionRate = totalLeads
        ? Math.round(
            (leads.filter((l) => l.status === "replied").length / totalLeads) *
              100,
          )
        : 0;

      const emailsSentWeek = newLeads;

      const averageResponseTime = "2.3 days"; // (placeholder until email tracking added)

      const upcomingFollowUps =
        leads?.filter(
          (l) => l.follow_up_date && new Date(l.follow_up_date) <= today,
        ).length || 0;

      setStats({
        totalLeads,
        newLeads,
        activeConversations,
        conversionRate,
        emailsSentWeek,
        averageResponseTime,
        upcomingFollowUps,
      });

      // =========================
      // 📈 MOCK → REAL CAMPAGIN DATA (TEMP)
      // =========================
      setCampaigns([
        {
          name: "Cold Outreach Campaign",
          sent: totalLeads,
          responses: leads.filter((l) => l.status === "replied").length,
        },
      ]);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your outreach performance overview.
        </p>
      </div>

      {dueFollowUps.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-orange-500/30 bg-orange-500/10 flex items-center justify-between">
          <div>
            <p className="font-medium text-orange-600">
              🔔 {dueFollowUps.length} follow-up
              {dueFollowUps.length > 1 ? "s" : ""} due today
            </p>
            <p className="text-xs text-muted-foreground">
              You have leads waiting for a response
            </p>
          </div>

          <button
            className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => console.log(dueFollowUps)}
          >
            View
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          change="+12.5%"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="New This Week"
          value={stats.newLeads}
          change="+3.2%"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Active Conversations"
          value={stats.activeConversations}
          change="+8.1%"
          icon={Mail}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+2.3%"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card
            title="Campaign Performance"
            description="30-day email campaign metrics"
          >
            <CampaignChart campaigns={campaigns} />
          </Card>
        </div>

        <div>
          <Card title="Quick Stats" description="This week's key metrics">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Emails Sent
                </span>
                <span className="font-semibold text-foreground">
                  {stats.emailsSentWeek}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Avg Response Time
                </span>
                <span className="font-semibold text-foreground">
                  {stats.averageResponseTime}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Follow-ups Due
                </span>
                <span className="font-semibold text-foreground">
                  {stats.upcomingFollowUps}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity (still component-based) */}
      <RecentActivity />
    </div>
  );
}

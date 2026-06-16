"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Mail,
} from "lucide-react";

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  overdue: AlertCircle,
};

const statusColors = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // =========================
  // FETCH LEADS FROM SUPABASE
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("follow_up_date", { ascending: true });

      if (error) {
        console.error(error);
      }

      setFollowUps(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // =========================
  // DERIVE STATUS DYNAMICALLY
  // =========================
  const enrichedFollowUps = useMemo(() => {
    const today = new Date();

    return followUps.map((lead) => {
      const dueDate = lead.follow_up_date
        ? new Date(lead.follow_up_date)
        : null;

      let status = lead.status || "pending";

      if (status !== "completed") {
        if (dueDate && dueDate < today) {
          status = "overdue";
        } else {
          status = "pending";
        }
      }

      return {
        ...lead,
        status,
      };
    });
  }, [followUps]);

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredFollowUps = useMemo(() => {
    return enrichedFollowUps.filter((lead) => {
      const matchesStatus = !selectedStatus || lead.status === selectedStatus;

      return matchesStatus;
    });
  }, [enrichedFollowUps, selectedStatus]);

  // =========================
  // COUNTERS
  // =========================
  const overdueCount = enrichedFollowUps.filter(
    (l) => l.status === "overdue",
  ).length;
  const pendingCount = enrichedFollowUps.filter(
    (l) => l.status === "pending",
  ).length;
  const completedCount = enrichedFollowUps.filter(
    (l) => l.status === "completed",
  ).length;

  // =========================
  // MARK COMPLETE
  // =========================
  const handleMarkComplete = async (id: string) => {
    await supabase.from("leads").update({ status: "completed" }).eq("id", id);

    setFollowUps((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: "completed" } : lead,
      ),
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground">Loading follow-ups...</div>
    );
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Follow-ups</h1>
          <p className="text-muted-foreground">
            Manage your customer follow-up schedule
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Follow-up
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-muted-foreground">Due</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-red-500">{overdueCount}</p>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-500">{completedCount}</p>
        </Card>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "overdue", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedStatus(type === "all" ? null : type)}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === type || (type === "all" && !selectedStatus)
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredFollowUps.map((lead) => {
          const StatusIcon = statusIcons[lead.status];

          return (
            <Card key={lead.id} className="p-4">
              <div className="flex justify-between items-center">
                {/* LEFT */}
                <div>
                  <p className="font-semibold">{lead.company_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.company_email}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {lead.follow_up_date || "No date set"}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[lead.status]}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {lead.status}
                  </Badge>

                  {lead.status !== "completed" && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(lead.id)}
                    >
                      Mark Done
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredFollowUps.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No follow-ups found
        </Card>
      )}
    </div>
  );
}

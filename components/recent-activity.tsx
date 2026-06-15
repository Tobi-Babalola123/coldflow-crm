"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/cards";
import { Mail, Users, CheckCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "email" | "contact" | "conversion" | "followup";
  title: string;
  description: string;
  time: string;
}

const iconMap = {
  email: Mail,
  contact: Users,
  conversion: CheckCircle,
  followup: Clock,
};

const colorMap = {
  email: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  contact:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  conversion:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  followup:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error(error);
        return;
      }

      const generated: Activity[] = [];

      leads?.forEach((lead) => {
        // 🟢 NEW LEAD
        if (lead.created_at) {
          generated.push({
            id: `${lead.id}-created`,
            type: "contact",
            title: "New Lead Added",
            description: `${lead.company_name} added to pipeline`,
            time: formatTime(lead.created_at),
          });
        }

        // 📩 EMAIL SENT
        if (lead.sent_date) {
          generated.push({
            id: `${lead.id}-sent`,
            type: "email",
            title: "Email Sent",
            description: `Outreach sent to ${lead.company_email}`,
            time: formatTime(lead.sent_date),
          });
        }

        // 🔔 FOLLOW-UP DUE
        if (lead.follow_up_date) {
          const isDue = new Date(lead.follow_up_date) <= new Date();

          if (isDue) {
            generated.push({
              id: `${lead.id}-followup`,
              type: "followup",
              title: "Follow-up Due",
              description: `Follow up with ${lead.company_name}`,
              time: formatTime(lead.follow_up_date),
            });
          }
        }

        // 🎯 CONVERSION
        if (lead.status === "replied" || lead.status === "interested") {
          generated.push({
            id: `${lead.id}-conversion`,
            type: "conversion",
            title: "Positive Response",
            description: `${lead.company_name} responded positively`,
            time: formatTime(lead.created_at),
          });
        }
      });

      setActivities(
        generated
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
          )
          .slice(0, 10),
      );
    };

    fetchActivity();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${days} day(s) ago`;
  };

  return (
    <Card title="Recent Activity" description="Your latest outreach activities">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          const colorClass = colorMap[activity.type];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>

              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

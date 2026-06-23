"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Send,
} from "lucide-react";

const statusColors: Record<string, string> = {
  sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  follow_up_due:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  replied:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  interview:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  hired:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("filter") === "followups") {
      setShowFollowUps(true);
    }
  }, [searchParams]);

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        return;
      }

      setLeads(data || []);
    };

    fetchLeads();
  }, []);

  // 🔍 FILTER LOGIC
  const filteredLeads = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        lead.company_name?.toLowerCase().includes(search) ||
        lead.company_email?.toLowerCase().includes(search);

      const matchesStatus = !statusFilter || lead.status === statusFilter;

      const isDueToday =
        lead.follow_up_date &&
        new Date(lead.follow_up_date) <= new Date() &&
        lead.status !== "replied" &&
        lead.status !== "converted";

      const matchesFollowUp = !showFollowUps || isDueToday;

      return matchesSearch && matchesStatus && matchesFollowUp;
    });
  }, [searchTerm, statusFilter, leads, showFollowUps]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 🔥 FOLLOW-UP API CALL
  const sendFollowUp = async (leadId: string) => {
    const res = await fetch("/api/follow-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to send follow-up");
      return;
    }

    alert("Follow-up sent!");

    // refresh leads
    const { data: refreshed } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(refreshed || []);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your sales leads
          </p>
        </div>

        {/* RIGHT SIDE (BUTTON GROUP) */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFollowUps ? "default" : "outline"}
            onClick={() => setShowFollowUps(!showFollowUps)}
          >
            Follow-ups Today
          </Button>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {showFollowUps && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm font-medium text-red-500">
            Showing leads with follow-ups due
          </p>
        </div>
      )}

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search company or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={statusFilter || ""}
          onChange={(e) => {
            setStatusFilter(e.target.value || null);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* TABLE */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3">Last contact</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Follow-ups</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLeads.map((lead) => {
                const isDueFollowUp =
                  lead.follow_up_date &&
                  new Date(lead.follow_up_date) <= new Date() &&
                  lead.status !== "replied" &&
                  lead.status !== "hired" &&
                  lead.status !== "rejected";

                return (
                  <tr
                    key={lead.id}
                    className={`border-b ${
                      isDueFollowUp
                        ? "bg-red-500/15 border-l-4 border-l-red-500"
                        : "border-border"
                    }`}
                  >
                    <td className="p-3">
                      <span className="text-sm font-medium">
                        {lead.follow_up_count || 0}/3
                      </span>
                    </td>

                    <td className="p-3 text-xs text-muted-foreground">
                      {lead.last_contact_date
                        ? new Date(lead.last_contact_date).toLocaleDateString()
                        : "Never"}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lead.company_name}</span>

                        {isDueFollowUp && (
                          <Badge className="bg-red-500 text-white animate-pulse">
                            Follow-up Due
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {lead.company_email}
                    </td>

                    <td className="p-3">
                      <select
                        value={lead.status || "sent"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;

                          await supabase
                            .from("leads")
                            .update({ status: newStatus })
                            .eq("id", lead.id);

                          setLeads((prev) =>
                            prev.map((l) =>
                              l.id === lead.id
                                ? { ...l, status: newStatus }
                                : l,
                            ),
                          );
                        }}
                        className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground"
                      >
                        <option value="sent">Sent</option>
                        <option value="follow_up_due">Follow Up Due</option>
                        <option value="replied">Replied</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>

                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </button>

                      <button
                        disabled={(lead.follow_up_count || 0) >= 3}
                        onClick={() => {
                          console.log("Lead clicked:", lead);
                          sendFollowUp(lead.id);
                        }}
                        className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md text-white ${
                          (lead.follow_up_count || 0) >= 3
                            ? "bg-gray-400 cursor-not-allowed"
                            : isDueFollowUp
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        <Send className="w-3 h-3" />

                        {(lead.follow_up_count || 0) >= 3
                          ? "Completed"
                          : `Follow-up #${(lead.follow_up_count || 0) + 1}`}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 p-4">
          <p className="text-xs text-muted-foreground">
            Showing {paginatedLeads.length} of {filteredLeads.length}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg w-[500px]">
            <h2 className="text-lg font-bold">{selectedLead.company_name}</h2>

            <p className="text-sm mt-2">{selectedLead.message}</p>

            <a
              href={selectedLead.cv_url}
              target="_blank"
              className="text-blue-500 underline"
            >
              View CV
            </a>

            <Button className="mt-4" onClick={() => setSelectedLead(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

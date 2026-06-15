"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Send,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  interested:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  qualified:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    return leads.filter((lead) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        lead.company_name?.toLowerCase().includes(search) ||
        lead.company_email?.toLowerCase().includes(search);

      const matchesStatus = !statusFilter || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, leads]);

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
    const { data: refreshed } = await supabase.from("leads").select("*");
    setLeads(refreshed || []);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your sales leads
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

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
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border">
                  <td className="p-3 font-medium">{lead.company_name}</td>

                  <td className="p-3 text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {lead.company_email}
                  </td>

                  <td className="p-3">
                    <Badge className={statusColors[lead.status || "pending"]}>
                      {lead.status || "pending"}
                    </Badge>
                  </td>

                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-right flex justify-end gap-2">
                    {/* VIEW */}
                    <button className="text-sm text-primary hover:underline">
                      View
                    </button>

                    {/* FOLLOW-UP BUTTON */}
                    <button
                      onClick={() => sendFollowUp(lead.id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <Send className="w-3 h-3" />
                      Follow-up
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}

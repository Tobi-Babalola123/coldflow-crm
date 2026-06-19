import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateFollowUpEmail } from "@/lib/email-generator";
import emailjs from "@emailjs/nodejs";

export async function POST() {
  try {
    console.log("CRON FOLLOW-UP STARTED");

    const now = new Date().toISOString();

    // 1. Find all leads that are due for follow-up
    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .lte("follow_up_date", now)
      .eq("auto_followup_enabled", true)
      .lt("follow_up_count", 3);

    if (error) {
      throw error;
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({
        message: "No follow-ups due",
      });
    }

    console.log(`Found ${leads.length} follow-ups`);

    // 2. Send follow-up emails
    for (const lead of leads) {
      const emailContent = generateFollowUpEmail(lead);

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          to_email: lead.company_email,
          name: lead.company_name,
          subject: emailContent.subject,
          message: emailContent.message,
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        },
      );

      // 3. Update lead after successful email
      await supabaseAdmin
        .from("leads")
        .update({
          follow_up_count: (lead.follow_up_count || 0) + 1,

          last_contact_date: new Date().toISOString(),

          last_follow_up_sent: new Date().toISOString(),

          follow_up_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),

          status: "follow_up_due",
        })
        .eq("id", lead.id);

      console.log(`Follow-up sent to ${lead.company_email}`);
    }

    return NextResponse.json({
      success: true,
      sent: leads.length,
    });
  } catch (err: any) {
    console.error("CRON FOLLOW-UP ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Cron failed",
      },
      {
        status: 500,
      },
    );
  }
}

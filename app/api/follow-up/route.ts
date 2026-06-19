import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";
import { generateFollowUpEmail } from "@/lib/email-generator";
console.log("FOLLOW-UP ROUTE LOADED");

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();
    console.log("Received lead ID:", leadId);

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 },
      );
    }

    // 1. Get the specific lead
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    console.log("Supabase error:", error);
    console.log("Found lead:", lead);

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. Prevent more than 3 follow-ups
    if ((lead.follow_up_count || 0) >= 3) {
      return NextResponse.json(
        { error: "Follow-up sequence completed" },
        { status: 400 },
      );
    }

    // 3. Generate follow-up email
    const emailContent = generateFollowUpEmail(lead);
    // 4. Send email through EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: lead.company_email,
        name: lead.company_name,
        subject: emailContent.subject,
        message: emailContent.message,
      },
      process.env.EMAILJS_PUBLIC_KEY!,
    );

    // 5. Update lead after successful sending
    await supabase
      .from("leads")
      .update({
        follow_up_count: (lead.follow_up_count || 0) + 1,

        last_contact_date: new Date().toISOString(),

        follow_up_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),

        status: "follow_up_due",
      })
      .eq("id", lead.id);

    return NextResponse.json({
      success: true,
      message: "Follow-up sent successfully",
    });
  } catch (err: any) {
    console.error("Follow-up error:", err);

    return NextResponse.json(
      { error: err.message || "Failed to send follow-up" },
      { status: 500 },
    );
  }
}

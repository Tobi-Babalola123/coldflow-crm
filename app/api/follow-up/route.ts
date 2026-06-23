import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateFollowUpEmail } from "@/lib/email-generator";
import nodemailer from "nodemailer";

console.log("FOLLOW-UP ROUTE LOADED");

export async function GET() {
  return Response.json({
    success: true,
    message: "Follow-up route is alive",
  });
}

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
    console.log("Searching for lead:", leadId);

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    console.log("Lead result:", lead);
    console.log("Lead error:", error);

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

    // 4. Send email through Nodemailer

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: lead.company_email,

      subject: emailContent.subject,

      text: emailContent.message,
    });

    console.log("Follow-up email sent successfully");

    // 5. Update lead after successful sending
    await supabaseAdmin
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
      {
        error: err.message || "Failed to send follow-up",
      },
      {
        status: 500,
      },
    );
  }
}

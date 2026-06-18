import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";
import { generateFollowUpEmail } from "@/lib/email-generator";

export async function GET() {
  try {
    const today = new Date().toISOString();

    // 1. Get all leads due for follow-up
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .lte("follow_up_date", today)
      .neq("status", "completed");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "No follow-ups due" });
    }

    // 2. Loop through leads and send emails
    const emailContent = generateFollowUpEmail(lead);

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: lead.company_email,
        name: lead.company_name,
        subject: emailContent.subject,
        message: emailContent.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    );

    return NextResponse.json({
      success: true,
      sent: leads.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

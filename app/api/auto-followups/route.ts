import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const { createClient } = await import("@supabase/supabase-js");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export async function GET() {
  const supabase = await getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase environment variables are missing" },
      { status: 500 },
    );
  }

  const today = new Date().toISOString();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .lte("follow_up_date", today)
    .eq("status", "sent")
    .eq("auto_followup_enabled", true);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  for (const lead of leads || []) {
    try {
      // Send follow-up email
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: lead.company_email,
            subject: `Following Up - ${lead.company_name}`,
            message: `
Hello,

I hope you're doing well.

I wanted to follow up regarding my previous email and check whether there might be an opportunity to discuss further.

Thank you for your time.

Kind regards,
Tobi Babalola
            `,
          },
        }),
      });

      await supabase
        .from("leads")
        .update({
          follow_up_count: (lead.follow_up_count || 0) + 1,

          last_follow_up_sent: new Date().toISOString(),

          follow_up_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .eq("id", lead.id);
    } catch (err) {
      console.error(err);
    }
  }

  return NextResponse.json({
    success: true,
    processed: leads?.length || 0,
  });
}

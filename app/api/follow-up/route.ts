import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { leadId } = await req.json();

    // 1. Get lead
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. Follow-up email template
    const emailContent = `
Hello ${lead.contact_person || "there"},

I hope you're doing well.

I wanted to follow up on my previous email regarding ${lead.subject || "your project"}.

I’d still love to explore how I can help your company improve its web presence and performance.

Looking forward to your thoughts.

Best regards,
Tobi
`;

    // 3. Send email
    await resend.emails.send({
      from: "Cold Outreach <onboarding@resend.dev>",
      to: lead.company_email,
      subject: `Following up: ${lead.subject || "Let’s connect"}`,
      text: emailContent,
    });

    // 4. Update lead
    await supabase
      .from("leads")
      .update({
        status: "contacted",
        last_follow_up: new Date().toISOString(),
      })
      .eq("id", leadId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

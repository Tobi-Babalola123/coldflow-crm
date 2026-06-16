type Lead = {
  company_name: string;
  company_email: string;
  follow_up_count?: number;
  status?: string;
};

export function generateFollowUpEmail(lead: Lead) {
  const attempt = lead.follow_up_count || 0;

  // FIRST FOLLOW-UP
  if (attempt === 0) {
    return {
      subject: `Quick follow-up regarding ${lead.company_name}`,
      message: `Hi ${lead.company_name},

I hope you're doing well.

I reached out recently regarding potential collaboration opportunities and wanted to quickly follow up.

I’d love to show you how I can help improve your digital presence and bring more structured development support to your team.

Looking forward to hearing from you.

Best regards,`,
    };
  }

  // SECOND FOLLOW-UP
  if (attempt === 1) {
    return {
      subject: `Just checking in — ${lead.company_name}`,
      message: `Hi ${lead.company_name},

Just following up on my previous message.

I understand things can get busy, but I’d still love to connect and explore if there’s a fit for collaboration.

Even a quick 10-minute conversation would be valuable.

Best regards,`,
    };
  }

  // FINAL FOLLOW-UP
  return {
    subject: `Final follow-up — ${lead.company_name}`,
    message: `Hi ${lead.company_name},

I don’t want to keep flooding your inbox, so this will be my final follow-up.

If now isn’t the right time, no worries at all — I’ll be here whenever you’re ready.

Wishing you continued success.

Best regards,`,
  };
}

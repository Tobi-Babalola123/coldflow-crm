import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler() {
  const today = new Date().toISOString();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("status", "sent")
    .eq("auto_followup_enabled", true)
    .lte("follow_up_date", today);

  return leads;
}

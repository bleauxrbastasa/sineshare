import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lssaqicumkgqtrtezqbu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1osR4am0W7xCMvjEvxUnvw_0YefEG2E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

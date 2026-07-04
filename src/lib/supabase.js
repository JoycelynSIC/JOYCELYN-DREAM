import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jnavjwdglqkrazwcklbj.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

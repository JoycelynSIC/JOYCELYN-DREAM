import axios from 'axios';

const SUPABASE_URL = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1";
const API_KEY      = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ";

const headers = {
    apikey:         API_KEY,
    Authorization:  `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

async function test() {
    try {
        console.log("Fetching some user profiles...");
        const res = await axios.get(`${SUPABASE_URL}/users_profile?limit=5`, { headers });
        console.log("Users:", res.data.map(u => ({ email: u.email, password: u.password, role: u.role })));
    } catch (err) {
        console.error("Error fetching:", err.message);
    }
}

test();

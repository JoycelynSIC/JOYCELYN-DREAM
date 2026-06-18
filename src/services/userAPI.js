import axios from 'axios'

const API_URL = "https://jnavjwdglqkrazwcklbj.supabase.co/rest/v1/users_profile"
const API_KEY = "sb_publishable_ycZXL_ij77PLww-OV7PWLg_RvhnuhCQ"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const userAPI = {
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },
    async createUser(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },
    async login(email, password) {
        const response = await axios.get(`${API_URL}?email=eq.${email}&password=eq.${password}`, { headers })
        return response.data
    },
    async updateUser(id, data) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers })
        return response.data
    },
    async deleteUser(id) {
        const response = await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
        return response.data
    }
}

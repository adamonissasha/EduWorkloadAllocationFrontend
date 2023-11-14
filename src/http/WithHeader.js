import axios from "axios";

export const API_URL = 'http://localhost:8765/common'

const api_with_header = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
})

export default api_with_header;
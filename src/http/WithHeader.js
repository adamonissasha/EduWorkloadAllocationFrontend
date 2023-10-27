import axios from "axios";

export const API_URL = 'http://localhost:8080/'

const api_with_header = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
})

export default api_with_header;
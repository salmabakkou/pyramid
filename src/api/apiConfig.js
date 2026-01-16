import axios from "axios";

const api = axios.create({
    baseURL : 'https://6969560b69178471522d3ca2.mockapi.io/',
    headers : {
        'Content-Type':'application/json'
    },
});
export default api;
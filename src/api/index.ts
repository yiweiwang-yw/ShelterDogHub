import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://frontend-take-home-service.fetch.com',
    withCredentials: true,
});

export default instance;

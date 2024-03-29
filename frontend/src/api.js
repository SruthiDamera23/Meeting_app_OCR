import axios from 'axios';

const BASE_URL = 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});



export const signup = (formData) => api.post('signup/', formData);
export const signup_approve = (formData) => api.post('signup-approve/', formData);
export const login = (formData) => api.post('login/', formData);
export const tasks_create = (formData) => api.post('tasks/', formData);
export const tasks_view = () => api.get('tasks/');
export const meeting_create = (formData) => api.post('meeting/', formData);
export const meeting_ocr = (image) => api.post('meeting/ocr', image);
export const meeting_view = () => api.get('meeting/');
export const meeting_read = (pk) => api.get(`meeting/${pk}`);
export const meeting_update = (pk, formData) => api.put(`meeting/${pk}`, formData);
export const person_view = () => api.get('person/');
export const delete_request = (id) => api.delete(`deleterequest/${id}/`);
export const addChurch = (formData) => api.post('church/', formData);
export const update_church_data = (id,formdata) => api.put(`edit-church/${id}`,formdata);
export const delete_church_data = (id) => api.delete(`edit-church/${id}`);
export const delete_user = (id) => api.delete(`deleteuser/${id}/`);
export const get_users=()=>api.get('users/');

export const user_requests=()=>api.get('requests/');
export const get_church_data=()=>api.get('church/');
// export const meeting_delete = (pk) => api.put(`api/meeting//${pk}`);
export const task_view = (id) => api.get(`tasks/${id}`);
export const tasks_delete = (id, formData) => api.delete(`tasks/${id}/`, formData);
export const tasks_update = (id, formData) => api.put(`tasks/${id}`, formData);
// export const tasks_delete = () => api.post('tasks/');
export const logout = () => api.post('logout/');

export const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};

export const updateCookie = (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
};
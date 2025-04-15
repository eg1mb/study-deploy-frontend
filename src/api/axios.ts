import axios from 'axios';
import type { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: 'https://port-0-study-deploy-backend-m9ihub5nb21ae68f.sel4.cloudtype.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add isAxiosError method to the instance
(instance as any).isAxiosError = axios.isAxiosError;

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('요청 URL:', config.url);
    console.log('요청 메서드:', config.method);
    console.log('요청 헤더:', config.headers);
    console.log('요청 데이터:', config.data);
    
    return config;
  },
  (error) => {
    console.error('요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    console.log('응답 상태:', response.status);
    console.log('응답 데이터:', response.data);
    return response;
  },
  (error) => {
    console.error('응답 에러:', error);
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 

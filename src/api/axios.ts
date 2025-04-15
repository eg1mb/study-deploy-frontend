import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://port-0-study-deploy-backend-m9iks1vld34c7422.sel4.cloudtype.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // XMLHttpRequest임을 명시
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // preflight 요청인 경우 CORS 헤더 추가
    if (config.method?.toUpperCase() === 'OPTIONS') {
      config.headers['Access-Control-Request-Method'] = config.method;
      config.headers['Access-Control-Request-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With';
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // CORS 문제 디버깅을 위한 콘솔 로그
      console.log('토큰이 요청에 포함됨:', token.substring(0, 10) + '...');
    } else {
      console.log('토큰이 없음, Authorization 헤더 추가되지 않음');
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
    // CORS 응답 헤더 확인을 위한 로깅 추가
    console.log('응답 헤더:', response.headers);
    return response;
  },
  (error) => {
    console.error('응답 에러:', error);
    if (error.response) {
      console.error('에러 응답 상태:', error.response.status);
      console.error('에러 응답 데이터:', error.response.data);
      console.error('에러 응답 헤더:', error.response.headers);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else {
      console.error('응답이 없는 에러 (네트워크 오류 가능성):', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 

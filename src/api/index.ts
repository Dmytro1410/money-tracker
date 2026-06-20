import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor
apiClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('accessToken');

  // 2. If a session exists, attach the JWT to the Authorization header
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
}, (error) => Promise.reject(error));

export const apiGet = async ({ url }: { url: string }) => {
  let error: null | Error = null;
  let data: unknown = null;

  await apiClient.get(url).then((res) => {
    data = res.data;
  }).catch((err) => {
    error = err;
  });

  return { error, data };
};

export const apiPost = async ({ body, url }: {
  body: Record<string | number | symbol, unknown>; url: string
}) => {
  let error: null | Error = null;
  let data: unknown = null;

  await apiClient.post(url, body).then((res) => {
    data = res.data;
  }).catch((err) => {
    error = err;
  });

  return { error, data };
};

export default apiClient;

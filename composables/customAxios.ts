import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'; // Import axios and its types\

export const customAxios = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const token = useCookie<string>('token');

  options.headers = {
    ...options.headers,
    Authorization: token.value ? `Bearer ${token.value}` : ''
  };

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error;
  }
};
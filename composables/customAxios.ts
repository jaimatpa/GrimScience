import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'; // Import axios and its types\

export const customAxios = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const token = useCookie<string>('token'); // Retrieve token using useCookie

  // Add the Authorization header to the request
  options.headers = {
    ...options.headers,
    Authorization: token.value ? `Bearer ${token.value}` : ''
  };

  try {
    const response = await axios(options);
    return response; // Return the response
  } catch (error) {
    // Handle and possibly rethrow the error
    throw error;
  }
};
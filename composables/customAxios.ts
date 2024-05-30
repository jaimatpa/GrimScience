import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'; // Import axios and its types\

export const customAxios = async (options: AxiosRequestConfig): Promise<AxiosResponse> => {
  const token = useCookie<string>('token');
  const toast = useToast();

  options.headers = {
    ...options.headers,
    Authorization: token.value ? `Bearer ${token.value}` : ''
  };

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    if(axios.isAxiosError(error)){
      if(error.response.status == 401){
        navigateTo('/login')
      }
      toast.add({
        title: "Error",
        description: error.response.data.error,
        icon: 'i-heroicons-check-circle',
        color: 'red'
      })
    }
    throw error;
  }
};
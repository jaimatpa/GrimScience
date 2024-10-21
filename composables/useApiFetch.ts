import type { UseFetchOptions } from "#app";

export const useApiFetch = async (url: string, opts: UseFetchOptions<any>) => {
  const token = useCookie<string>('token');
  const toast = useToast();
  try {
    const apiFetch = $fetch.create({
      onRequest({ options }) {
        options.retry = false
        options.headers = {
          ...options.headers,
          Authorization: token.value ? `Bearer ${token.value}` : ''
        }
      },
      onResponseError({ response }) {
        toast.add({
          title: 'Error',
          description: response?._data?.message ?? response?._data?.error ?? 'Some error happened!',
          icon: 'i-heroicons-exclamation-circle',
          color: 'red'
        })
      }
    })
    return await apiFetch(url, { server: false, lazy: true, ...opts } as any)
  } catch (error) {

  }
};
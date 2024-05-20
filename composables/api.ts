import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

const token = useCookie<string>('token');
export const $api = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    url: R,
    options?: O
  ) => $fetch<T>(url, {
    ...options,
    headers: {
      Authorization: token.value ? `Bearer ${token.value}` : '',
      ...options?.headers
    }
  })
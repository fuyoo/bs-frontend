import req from "@/utils/request";

export interface QueryKeysPayload {
  id: string;
  db?: number;
  cursor?: number;
  pattern?: string;
  count?: number;
}

export interface StringPayload {
  k: string;
  db: number;
  id: string;
}
export interface KeyPayload {
  key: string;
  db: number;
  id: string;
}
export const queryKeys = <T>(data: QueryKeysPayload) => {
  return req<T>("/info/keys", data);
};

/**
 *
 * @param data
 */
export const queryKeyInfo = <T>(data: {
  id: string;
  db: number;
  key: string;
}) => {
  return req<T>("/info/key", data);
};

export function queryKey<T>(data: StringPayload) {
  return req<T>("/key/string/get", data);
}

export function deleteKey<T>(data: KeyPayload) {
  return req<T>("/key/delete", data);
}
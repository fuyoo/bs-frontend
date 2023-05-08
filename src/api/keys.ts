import req from "@/utils/request";

export interface QueryKeysPayload {
  id: string,
  db?: number,
  cursor?: number,
  pattern?: string,
  count?: number,
}

export const queryKeys = <T>(data: QueryKeysPayload) => {
  return req<T>("/info/keys",data)
}


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

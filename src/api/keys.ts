import request from "@/utils/request";

export const queryKeyInfo = <T>(data: {
  id: string;
  db: number;
  key: string;
}) => {
  return request<T>("/info/key", data);
};

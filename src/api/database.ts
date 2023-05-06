import request from "@/utils/request";



export const queryDatabaseInfo = <T>(data: {
    id: string;
    db: number;
    key: string;
}) => {
    return request<T>(
        "/info/database",
        data
    );
};

export function isAvailable(data: any) {
    return request<NonNullable<any>>("/connection/available", data)
}
import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

const baseQueryWithRefresh: BaseQueryFn<any, unknown, unknown> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // ❗ Пытаемся обновить токен
        const refreshResult = await baseQuery({ url: "/refresh", method: "POST" }, api, extraOptions);

        if (refreshResult.data) {
            const newToken = (refreshResult.data as any).accessToken;
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", newToken);
            }

            // Повторяем исходный запрос с новым токеном
            result = await baseQuery({ url: "/refresh", method: "POST" }, api, extraOptions);
        } else {
            // Если refresh не удался — редирект на login
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
    }

    return result;
};

export default baseQueryWithRefresh;

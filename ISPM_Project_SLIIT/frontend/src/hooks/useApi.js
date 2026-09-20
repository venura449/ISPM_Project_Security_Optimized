import {useCallback} from "react";

export const useApi = () =>{
    const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`;

    const apiFetch = useCallback(async (endpoint, options = {})=>{
        const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        const fetchOptions = {
            ...options,
            credentials: 'include',
            headers:{
                "Content-Type": "application/json",
                ...options.headers,
            },
        };

        if (fetchOptions.headers.Authorization){
            delete fetchOptions.headers.Authorization;
        }

        try{
            const response = await fetch(url, fetchOptions);
            return response;
        }catch(error){
            console.error("API fetch error:", error);
            throw error;
        }
    },[API_BASE_URL]);

    return {apiFetch};
}
"use server"

import { connection } from "next/server"

export interface IResponse<T> {
    data?: T
    success: boolean
    error?: string
	total?: number
	page?: number
	count?: number
	counts?: Record<string, number>
	status?: number
}

const _parseParams = (
    params?: Record<string, unknown>
): string => {
    if (!params) return ""

    const search = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            search.append(key, String(value))
        }
    })

    const query = search.toString()
    return query ? `?${query}` : ""
}

const _request = async <T>(
    url: string,
    options?: RequestInit
): Promise<IResponse<T>> => {
    await connection()

    try {
        const headers: Record<string, string> = {
            ...(options?.headers as
                Record<string, string> |
                undefined
            )
        }

        const request = await fetch(
            url,
            {
                ...options,
                headers,
                credentials: "include",
                cache: "no-store"
            }
        )

        const isJson = request.headers
        ?.get("content-type")
        ?.includes("application/json")

        let response: {
            data?: T
            total?: number
            page?: number
            count?: number
            counts?: Record<string, number>
            error?: string
            message?: string
        } | null = null
        if(isJson){
            try { response = await request.json() }
            catch(e){
                console.error(e)
            }
        }

        if(request.ok){
            return {
                success: true,
                data: response?.data,
                total: response?.total,
                page: response?.page,
                count: response?.count,
                counts: response?.counts,
            }
        }

        return {
            success: false,
            status: request.status,
            error:
                response?.error ||
                response?.message ||
                request.statusText ||
                "Unknown error"
        }

    }
    catch(e){
        console.error(e)
        return {
            success: false,
            status: 0,
            error: "Can't reach the Motif API. Is the core server running?"
        }
    }
}

export const _GET = async <T>(
    url: string,
    query?: Record<string, unknown>,
    options?: RequestInit
): Promise<IResponse<T>> => {
    const finalUrl = `${url}${_parseParams(query)}`
    return _request<T>(
        finalUrl,
        {
            ...options,
            method: "GET"
        }
    )
}

export const _POST = async <T>(
    url: string,
    query?: Record<string, unknown>,
    options?: RequestInit
): Promise<IResponse<T>> => {
	const finalUrl = `${url}${_parseParams(query)}`
    const isFormData = options?.body instanceof FormData
    
    const headers = {
        ...(
            isFormData ? {} : 
            {"Content-Type": "application/json"}
        ),
        "accept": "application/json",
    }

    return _request<T>(
        finalUrl,
        {
            ...options,
		    headers,
			method: "POST"
        }
    )
}

export const _PUT = async <T>(
    url: string,
    query?: Record<string, unknown>,
    options?: RequestInit
): Promise<IResponse<T>> => {
	const finalUrl = `${url}${_parseParams(query)}`
    return _request<T>(
        finalUrl,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            method: "PUT",
        }
    )
}

export const _PATCH = async <T>(
    url: string,
    query?: Record<string, unknown>,
    options?: RequestInit
): Promise<IResponse<T>> => {
	const finalUrl = `${url}${_parseParams(query)}`
    const isFormData = options?.body instanceof FormData
    
    const headers = {
        ...(
            isFormData ? {} : 
            {"Content-Type": "application/json"}
        ),
        "accept": "application/json",
    }

    return _request<T>(
        finalUrl,
        {
            ...options,
            headers,
            method: "PATCH",
        }
    )
}

export const _DELETE = async <T>(
    url: string,
    query?: Record<string, unknown>,
    options?: RequestInit
): Promise<IResponse<T>> => {
	const finalUrl = `${url}${_parseParams(query)}`
    return _request<T>(
        finalUrl,
        {
            ...options,
            method: "DELETE",
        }
    )
}
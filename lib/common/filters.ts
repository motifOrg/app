const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value

export const parseQuery = async (
    searchParams?: Promise<Record<string, string | string[] | undefined>>
) => {
    const search = await searchParams
    const page = Number(first(search?.page) ?? 1)

    return {
        campaign: first(search?.campaign) ?? "",
        q: first(search?.q) ?? "",
        sort: first(search?.sort) ?? "fit",
        page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
        priority: first(search?.priority) ?? "",
        research_status: first(search?.research_status) ?? "",
        evaluation_status: first(search?.evaluation_status) ?? "",
        status: first(search?.status) ?? "",
        id: first(search?.id) ?? "",
    }
}

export type IParsedQuery = Awaited<ReturnType<typeof parseQuery>>

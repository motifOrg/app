
export type IClassValue = string | number | boolean | undefined | null | IClassValue[]

export const cn = (...inputs: IClassValue[]): string => {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

export const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined)
        return ""

    if (value >= 1_000_000)
        return `$${+(value / 1_000_000).toFixed(1)}M`

    if (value >= 1_000)
        return `$${+(value / 1_000).toFixed(0)}K`

    return `$${value}`
}

export const formatRange = (
    min?: number | null,
    max?: number | null,
    format: (value: number) => string = String
) => {
    if (min && max) return `${format(min)} – ${format(max)}`
    if (min) return `${format(min)}+`
    if (max) return `Up to ${format(max)}`
    return "Any"
}

export const formatBytes = (bytes: number) => {
    if (bytes >= 1_048_576)
        return `${(bytes / 1_048_576).toFixed(1)} MB`

    return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export const formatDate = (date?: Date) =>
    date && !isNaN(date.getTime())
        ? date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : ""

export const timeAgo = (date?: Date) => {
    if (!date || isNaN(date.getTime()))
        return ""

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`

    return formatDate(date)
}

export const initials = (value?: string) =>
    (value ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0]?.toUpperCase())
        .join("")

export const capitalize = (value?: string) => {
    if (!value || typeof value !== "string")
        return ""

    return value
        .trim()
        .split(/[-_]+/g)
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ")
}
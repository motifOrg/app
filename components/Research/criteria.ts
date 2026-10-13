// #region imports
import {
    formatMoney,
    formatRange,
    ICompany,
    IICP,
} from "@/lib"
// #endregion

export type ICriterionState = "match" | "partial" | "miss" | "unknown"

export interface ICriterion {
    label: string
    expected: string
    actual: string
    state: ICriterionState
}

const includesAny = (text: string, terms: string[]) => {
    const haystack = text.toLowerCase()
    return terms.find(term => term && haystack.includes(term.toLowerCase()))
}

const parseAmount = (raw: string) => {
    const match = raw.trim().match(/^[$£€]?\s*([\d.]+)\s*([kmb])?/i)
    if (!match) return null
    const unit = { k: 1e3, m: 1e6, b: 1e9 }[match[2]?.toLowerCase() as "k" | "m" | "b"] ?? 1
    return parseFloat(match[1]) * unit
}

export const parseRevenue = (raw: string): [number, number] | null => {
    if (!raw) return null
    const parts = raw.split(/[-–]|to/).map(parseAmount).filter((n): n is number => n !== null)
    if (!parts.length) return null
    return [parts[0], parts[parts.length - 1]]
}

const inRange = (
    [low, high]: [number, number],
    min: number | null,
    max: number | null
): ICriterionState => {
    const lower = min ?? -Infinity
    const upper = max ?? Infinity
    if (low >= lower && high <= upper) return "match"
    if (high < lower || low > upper) return "miss"
    return "partial"
}

export const checkCriteria = (company: ICompany, icp?: IICP): ICriterion[] => {
    if (!icp) return []
    const criteria: ICriterion[] = []

    if (icp.industries.length) {
        const hit = includesAny(`${company.industry} ${company.description}`, icp.industries)
        criteria.push({
            label: "Industry",
            expected: icp.industries.join(", "),
            actual: company.industry || "Unknown",
            state: hit ? "match" : company.industry ? "miss" : "unknown",
        })
    }

    if (icp.geographies.length) {
        const hit = includesAny(company.location, icp.geographies)
        criteria.push({
            label: "Geography",
            expected: icp.geographies.join(", "),
            actual: company.location || "Unknown",
            state: hit ? "match" : company.location ? "miss" : "unknown",
        })
    }

    if (icp.employeesMin !== null || icp.employeesMax !== null) {
        criteria.push({
            label: "Headcount",
            expected: formatRange(icp.employeesMin, icp.employeesMax),
            actual: company.employees !== null ? String(company.employees) : "Unknown",
            state: company.employees !== null
                ? inRange([company.employees, company.employees], icp.employeesMin, icp.employeesMax)
                : "unknown",
        })
    }

    if (icp.revenueMin !== null || icp.revenueMax !== null) {
        const revenue = parseRevenue(company.revenue)
        const state = revenue ? inRange(revenue, icp.revenueMin, icp.revenueMax) : "unknown"
        const foreign = /[£€]/.test(company.revenue)
        criteria.push({
            label: "Revenue",
            expected: formatRange(icp.revenueMin, icp.revenueMax, formatMoney) + (foreign ? " (USD, not converted)" : ""),
            actual: company.revenue || "Unknown",
            state: foreign && state === "match" ? "partial" : state,
        })
    }

    if (icp.exclusions.length) {
        const hit = includesAny(`${company.industry} ${company.description}`, icp.exclusions)
        criteria.push({
            label: "Exclusions",
            expected: `None of: ${icp.exclusions.join(", ")}`,
            actual: hit ? `Mentions “${hit}”` : "No exclusion found in profile",
            state: hit ? "miss" : "match",
        })
    }

    return criteria
}

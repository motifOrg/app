// #region imports
import { ReactNode } from "react"

import {
    cn,
    formatMoney,
    formatRange,
    IICP,
} from "@/lib"
// #endregion

const Row = ({ label, children }: {
    label: string
    children: ReactNode
}) => 
    <aside className="
        grid grid-cols-[140px_1fr] gap-3 py-2.5 border-b 
        border-grey-150 last:border-0 
        max-mobile:grid-cols-1 max-mobile:gap-1
    ">
        <span className="  pt-0.5">{label}</span>
        <div className="text-charcoal-100">{children}</div>
    </aside>

const Tags = ({ values, tone = "mint" }: {
    values: string[]
    tone?: "mint" | "error"
}) =>
    values.length ? 
        <aside className="flex flex-wrap gap-1">
            {values.map(value =>
                <span
                    key={value}
                    className={cn(
                        "h-6 px-2 rounded-md text-xs font-semibold inline-flex items-center",
                        tone === "mint" ? 
                        "bg-mint-50 text-mint-300" : 
                        "bg-error-100 text-error-200"
                    )}
                >
                    {value}
                </span>
            )}
        </aside> : 
        <span className="text-grey-200">
            Not set
        </span>

export const ICPSummary = ({ icp }: { icp?: IICP }) => {
    if (!icp)
        return <p className="text-grey-200">No ICP saved for this campaign yet.</p>

    return (
        <div className="flex flex-col">
            <Row label="Thesis">
                {
                    icp.thesis ||
                    <span className="text-grey-200">
                        Not set
                    </span>
                }
            </Row>

            <Row label="Industries">
                <Tags values={icp.industries}/>
            </Row>
            <Row label="Geographies">
                <Tags values={icp.geographies}/>
            </Row>
            <Row label="Business model">
                <Tags values={icp.businessModels}/>
            </Row>
            <Row label="Must-haves">
                <Tags values={icp.characteristics}/>
            </Row>
            <Row label="Revenue">
                {formatRange(icp.revenueMin, icp.revenueMax, formatMoney)}
            </Row>
            <Row label="EBITDA">
                {icp.ebitdaMin ? `${formatMoney(icp.ebitdaMin)}+` : "Any"}
            </Row>
            <Row label="Employees">
                {formatRange(icp.employeesMin, icp.employeesMax)}
            </Row>
            <Row label="Ownership">
                {icp.ownership || <span className="text-grey-200">Any</span>}
            </Row>
            <Row label="Exclusions">
                <Tags values={icp.exclusions} tone="error"/>
            </Row>
        </div>
    )
}

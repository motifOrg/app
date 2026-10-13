// #region imports
import { ReactNode } from "react"
// #endregion

export const Fact = ({ label, children }: {
    label: string
    children: ReactNode
}) => (
    <div className="flex flex-col gap-0.5">
        <dt className="text-xs text-grey-200">
            {label}
        </dt>
        <dd className="font-semibold text-charcoal-100 truncate">
            {
                children ||
                <span className="text-grey-200 font-normal">
                    Unknown
                </span>
            }
        </dd>
    </div>
)

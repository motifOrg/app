// #region imports
import { IFinding } from "@/lib"

import { Card } from "@/components/Cards/Card"
import { FindingCard } from "@/components/Cards/FindingCard"
// #endregion

export const Highlights = ({ title, findings, empty }: {
    title: string
    findings: IFinding[]
    empty: string
}) => (
    <Card title={title} bodyClassName="p-3">
        {
            findings.length ?
            <ul className="flex flex-col gap-2">
                {
                    findings.map(finding =>
                        <FindingCard
                            key={finding.id}
                            finding={finding}
                        />
                    )
                }
            </ul> :
            <p className="text-grey-200 px-2 py-1">
                {empty}
            </p>
        }
    </Card>
)

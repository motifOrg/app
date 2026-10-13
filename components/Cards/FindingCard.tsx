// #region imports
import {
    IconButton,
    Tooltip,
} from "@/base"

import {
    Delete,
    Link as LinkIcon,
} from "@/icons"

import {
    EVIDENCE_META,
    FINDING_META,
} from "@/data"

import {
    IFinding,
    timeAgo,
} from "@/lib"

import { MetaPill } from "@/components/Pills/MetaPill"
// #endregion

export const FindingCard = ({ finding, onDelete, deleting }: {
    finding: IFinding
    onDelete?: () => void
    deleting?: boolean
}) => (
    <li 
        data-deleting={deleting}
        className="
            group flex flex-col gap-2 p-4 rounded-xl ring-1 ring-grey-100
            bg-paper hover:ring-grey-200/50 smooth
            data-[deleting=true]:opacity-50
        " 
    >
        <header className="flex items-center gap-2 flex-wrap">
            <MetaPill 
                meta={FINDING_META} 
                value={finding.kind}
            />

            <Tooltip content={EVIDENCE_META[finding.evidence].tooltip}>
                {EVIDENCE_META[finding.evidence].label}
            </Tooltip>

            {
                onDelete &&
                <IconButton
                    variant="ghost"
                    size="xs"
                    aria-label="Delete finding"
                    onClick={onDelete}
                    className="
                        ml-auto opacity-0 
                        group-hover:opacity-100 
                        focus:opacity-100
                    "
                >
                    <Delete size={11}/>
                </IconButton>
            }
            
        </header>

        <p className="font-bold text-charcoal-100 mt-2">
            {finding.title}
        </p>

        {
            finding.content &&
            <p className="text-grey-300">
                {finding.content} <br/>
                <span className="italic">
                    {finding.confidence} confidence
                </span>
            </p>
        }


        {
            finding.sourceUrl &&
            <a
                href={finding.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    inline-flex items-center gap-1.5 text-xs 
                    font-semibold text-mint-300 
                    hover:underline w-fit max-w-full
                "
            >
                <LinkIcon size={10}/>
                <span className="truncate">
                    {finding.sourceUrl.replace(/^https?:\/\//, "")}
                </span>
            </a>
        }

        <span className="text-[11px] text-grey-200 text-right">
            {timeAgo(finding.createdAt)}
        </span>
    </li>
)

"use client"

// #region imports
import { WORKFLOW_META } from "@/data"
import { Check, Inbox, Target, Sparkle } from "@/icons"
import { cn, WORKFLOW } from "@/lib"
// #endregion

const _ICONS = {
    outbound: <Target size={16}/>,
    inbound: <Inbox size={16}/>,
    both: <Sparkle size={16}/>,
}

export const WorkflowPicker = ({ value, onChange }: {
    value: WORKFLOW
    onChange: (value: WORKFLOW) => void
}) => (
    <div role="radiogroup" className="grid grid-cols-3 gap-3 max-tablet:grid-cols-1">
        {
            (Object.keys(WORKFLOW_META) as WORKFLOW[]).map(workflow => {
                const selected = value === workflow

                return (
                    <button
                        key={workflow}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className="w-full"
                        onClick={() => onChange(workflow)}
                    >
                        <section
                            className={cn(
                                "relative flex w-full flex-col items-start gap-3 rounded-2xl p-4 text-left smooth",
                                "bg-paper ring-1 ring-grey-100 hover:bg-grey-150 hover:ring-mint-200",
                                selected && "ring-2 ring-mint-300 bg-mint-50",
                            )}
                        >
                            <span className="
                                w-9 h-9 rounded-lg bg-mint-100 text-mint-300
                                flex items-center justify-center
                            ">
                                {_ICONS[workflow]}
                            </span>
                            <span className="flex flex-col gap-1">
                                <span className="font-bold text-charcoal-100">
                                    {WORKFLOW_META[workflow].label}
                                </span>
                                <span className="text-xs text-grey-300 leading-relaxed">
                                    {WORKFLOW_META[workflow].description}
                                </span>
                            </span>
                            {
                                selected &&
                                <span className="
                                    absolute top-3 right-3 w-5 h-5 rounded-full bg-mint-300
                                    text-white flex items-center justify-center
                                ">
                                    <Check size={10}/>
                                </span>
                            }
                        </section>
                    </button>
                )
            })
        }
    </div>
)

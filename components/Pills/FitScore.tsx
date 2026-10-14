import { Tooltip } from "@/base"
import { cn } from "@/lib"

const _tier = (score: number) => {
    if (score >= 75)
        return { bar: "var(--color-mint-300)", text: "var(--color-mint-300)" }

    if (score >= 55)
        return { bar: "var(--color-amber-200)", text: "var(--color-amber-200)" }

    if (score >= 40)
        return { bar: "var(--color-error-200)", text: "var(--color-error-200)" }

    return { bar: "var(--color-grey-150)", text: "var(--color-grey-300)" }
}

export const FitScore = ({ score, size = "sm" }: {
    score: number | null
    size?: "sm" | "lg"
}) => {
    if (score === null)
        return (
            <Tooltip content="No fit score yet. Run AI research or evaluation to score it against the ICP.">
                <span className="text-xs text-grey-200 font-semibold cursor-help">
                    Not scored
                </span>
            </Tooltip>
        )

    const { bar, text } = _tier(score)

    return (
        <aside className={cn(
            "inline-flex items-center gap-2",
            size === "lg" && "gap-3"
        )}>
            <p
                className={cn(
                    "font-extrabold tabular-nums",
                    size === "lg" ? "text-3xl" : "text-sm w-6"
                )}
                style={{ color: text }}
            >
                {score}
            </p>

            <div className={cn(
                "rounded-full bg-grey-150 overflow-hidden",
                size === "lg" ? "w-24 h-2" : "w-12 h-1.5"
            )}>
                <div
                    className="block h-full rounded-full"
                    style={{ width: `${score}%`, backgroundColor: bar }}
                />
            </div>
        </aside>
    )
}

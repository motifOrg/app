"use client"

// #region imports
import {
	cn
} from "@/lib"
// #endregion

const skeletonVariants = {
	base: "animate-pulse bg-grey-150 rounded-lg",

	variants: {
		card: "flex flex-col items-center py-4 pt-6 gap-3",
		rect: "",
		circle: "rounded-full"
	},

	sizes: {
		row: "w-full h-10",
		card: "w-full h-28",
		text: "h-4 w-24",
		full: "w-full h-full"
	}
}

interface SkeletonProps {
	variant?: keyof typeof skeletonVariants.variants
	size?: keyof typeof skeletonVariants.sizes
	className?: string
}

export const Skeleton = ({
	variant = "rect",
	size = "full",
	className
}: SkeletonProps) => {

	return (
		<div
			className={cn(
				skeletonVariants.base,
				skeletonVariants.variants[variant],
				skeletonVariants.sizes[size],
				className
			)}
		/>
	)
}

Skeleton.displayName = "Skeleton"
export default Skeleton

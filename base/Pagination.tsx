"use client"

// #region imports
import { useRouter } from "nextjs-toploader/app"

import {
	forwardRef,
	HTMLAttributes
} from "react"

import {
	usePathname,
	useSearchParams
} from "next/navigation"

import {
	cn
} from "@/lib"

import {
	Chevron
} from "@/icons"
// #endregion

const paginationVariants = {
	base: `
		flex items-center gap-1 select-none
		text-charcoal-100 font-normal text-sm
		justify-center
	`,

	button: `
		inline-flex items-center justify-center rounded-md cursor-pointer
		active:scale-95 focus:outline-none fill-current
		disabled:opacity-40 disabled:cursor-not-allowed
		smooth text-grey-300 font-semibold
	`,

	variants: {
		default: `hover:bg-grey-150`,
		active: `bg-mint-100 text-mint-300`,
		navigation: `hover:bg-grey-150 hover:text-charcoal-100`,
	},

	sizes: {
		small: "w-7 h-7 text-xs",
		medium: "w-8 h-8 text-sm",
		large: "w-10 h-10 text-base",
	},

	ellipsis: `
		px-2 text-grey-200 select-none
		pointer-events-none transition-all
		duration-500 ease-in-out
	`,
}

export interface PaginationProps
	extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
	page: number
	count: number
	siblingCount?: number
	size?: keyof typeof paginationVariants.sizes
	disabled?: boolean
	showFirstButton?: boolean
	showLastButton?: boolean
	className?: string
}

const range = (start: number, end: number): number[] =>
	Array.from({ length: end - start + 1 }, (_, i) => start + i)

const Pagination = forwardRef<HTMLElement, PaginationProps>(
	(
		{
			page,
			count,
			siblingCount = 1,
			size = "small",
			disabled = false,
			showFirstButton = false,
			showLastButton = false,
			className = "",
			...props
		},
		ref
	) => {
		const router = useRouter()
		const pathname = usePathname()
		const searchParams = useSearchParams()

		const handleClick = (value: number) => () => {
			if (!disabled && value !== page){
				const params = new URLSearchParams(searchParams.toString())
				params.set("page", String(value))
				router.push(`${pathname}?${params.toString()}`)
			}
		}

		const totalNumbers = siblingCount * 2 + 3
		const pages: (number | "ellipsis")[] =
			count <= totalNumbers
				? range(1, count)
				: (() => {
					const left = Math.max(page - siblingCount, 2)
					const right = Math.min(page + siblingCount, count - 1)
					const arr: (number | "ellipsis")[] = [1]

					if (left > 2) arr.push("ellipsis")
					arr.push(...range(left, right))
					if (right < count - 1) arr.push("ellipsis")
					arr.push(count)
					return arr
				})()

		const containerClasses = cn(paginationVariants.base, className)
		const navBtnClasses = cn(
			paginationVariants.button,
			paginationVariants.variants.navigation,
			paginationVariants.sizes[size]
		)
		const pageBtnClasses = (active: boolean) =>
			cn(
				paginationVariants.button,
				active ? paginationVariants.variants.active : paginationVariants.variants.default,
				paginationVariants.sizes[size]
			)
		const ellipsisClasses = cn(paginationVariants.ellipsis)

		return (
			<nav
				ref={ref}
				className={containerClasses}
				role="navigation"
				aria-label="Pagination"
				{...props}
			>
				{showFirstButton && (
					<button
						className={navBtnClasses}
						disabled={disabled || page === 1}
						onClick={handleClick(1)}
						aria-label="Go to first page"
					>
						<Chevron direction="left" size={10} />
					</button>
				)}

				<button
					className={navBtnClasses}
					disabled={disabled || page === 1}
					onClick={handleClick(page - 1)}
					aria-label="Go to previous page"
				>
					<Chevron direction="left" size={10} />
				</button>

				{pages.map((p, idx) =>
					p === "ellipsis" ? (
						<span key={idx+p} className={ellipsisClasses}>
							…
						</span>
					) : (
						<button
							key={p}
							className={pageBtnClasses(p === page)}
							disabled={disabled}
							onClick={handleClick(p)}
							aria-label={`Go to page ${p}`}
							aria-current={p === page ? "page" : undefined}
						>
							{p}
						</button>
					)
				)}

				<button
					className={navBtnClasses}
					disabled={disabled || page === count}
					onClick={handleClick(page + 1)}
					aria-label="Go to next page"
				>
					<Chevron direction="right" size={10} />
				</button>

				{showLastButton && (
					<button
						className={navBtnClasses}
						disabled={disabled || page === count}
						onClick={handleClick(count)}
						aria-label="Go to last page"
					>
						<Chevron direction="right" size={10} />
					</button>
				)}
			</nav>
		)
	}
)

Pagination.displayName = "Pagination"
export default Pagination

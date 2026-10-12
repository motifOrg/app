"use client"

// #region Imports
import { useRouter } from "nextjs-toploader/app"

import {
	usePathname,
	useSearchParams,
} from "next/navigation"

import {
	useCallback,
	useEffect,
	useRef,
} from "react"
// #endregion

export const useSearchParam = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => () => {
		if (timer.current) clearTimeout(timer.current)
	}, [])

	const set = useCallback(
		(
			values: Record<string, string | undefined>,
			{ replace = false, reset = ["page"] }: {
				replace?: boolean
				reset?: string[]
			} = {}
		) => {
			const params = new URLSearchParams(searchParams.toString())

			Object.entries(values).forEach(([key, value]) => {
				if (value) params.set(key, value)
				else params.delete(key)
			})
			reset.forEach(key => params.delete(key))

			const url = `${pathname}?${params.toString()}`
			if (replace) router.replace(url)
			else router.push(url)
		},
		[router, pathname, searchParams]
	)

	const debounce = useCallback(
		(values: Record<string, string | undefined>, delay = 350) => {
			if (timer.current) clearTimeout(timer.current)
			timer.current = setTimeout(
				() => set(values, { replace: true }),
				delay
			)
		},
		[set]
	)

	return { searchParams, set, debounce }
}

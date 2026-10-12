"use client"

// #region Imports
import {
	useEffect
} from "react"
// #endregion

interface KeyBinding {
	combination:string
	handler: (
		event: Event
	) => void
}

export const useMouse = (
	keybinding: KeyBinding
) => {
	useEffect(() => {

		const {
			combination,
			handler
		} = keybinding

		document.documentElement.addEventListener(
			combination,
			handler
		)

		return () => document.documentElement.removeEventListener(
			combination,
			handler
		)

	},[keybinding])
}

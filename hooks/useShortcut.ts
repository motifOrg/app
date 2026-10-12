"use client"

// #region Imports
import {
	useEffect
} from "react"
// #endregion

export type IKeyBinding = [
	combination:string,
	handler: (
		event: KeyboardEvent
	) => void,
	preventDefault?: boolean,
]

const checkPressed = (
	combination:string ,
	event: KeyboardEvent
): boolean => {

	const reservedKeys = [
		"alt",
		"ctrl",
		"meta",
		"shift",
		"mod"
	]

	const {
		altKey,
		ctrlKey,
		metaKey,
		shiftKey,
		key: pressedKey
	} = event

	const keys = combination
				.toLowerCase()
				.split("+")
				.map(
					(item) => item.trim()
				)

	const alt =  keys.includes("alt")
	const mod =  keys.includes("mod")
	const shift =  keys.includes("shift")

	// side key with modifier
	const hotkey = keys.find(
		(key) => !reservedKeys.includes(key)
	)

	// check if the modifier key is being pressed
	if (alt !== altKey)
		return false
	if (shift !== shiftKey)
		return false
	if (mod && (!ctrlKey && !metaKey) )
		return false

	// key pressed case
	if ( hotkey && pressedKey.toLowerCase() === hotkey.toLowerCase())
		return true

	//base case
	return false

}

export const useShortcut = (
	shortcuts: IKeyBinding[]
) => {
	useEffect(() => {

		const keydownListener = (
			event: KeyboardEvent
		) => {

			shortcuts.forEach(([
				combination,
				handler,
				preventDefault = true
			]) => {
				if(checkPressed(combination, event)){
					if (preventDefault)
						event.preventDefault()
					handler(event)
				}
			})

		}

		document.documentElement.addEventListener(
			"keydown", keydownListener
		)

		return () => document.documentElement.removeEventListener(
			"keydown", keydownListener
		)

	}, [shortcuts])
}


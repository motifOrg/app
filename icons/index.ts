import { SVGProps } from "react"

export interface IconProps extends SVGProps<SVGSVGElement> {
	size?: number
    bg?: string
    color?: string
}

export interface DirectionalProps extends SVGProps<SVGSVGElement> {
	direction?: "up" | "down" | "left" | "right"
	size?: number
}

// #region Icons
export { default as Info } from "./Info"
export { default as Send } from "./Send"
export { default as Logo } from "./Logo"
export { default as Search } from "./Search"
export { default as Cancel } from "./Cancel"
export { default as Profile } from "./Profile"
export { default as Collapse } from "./Collapse"
export { default as Chevron } from "./Chevron"
export { default as Funnel } from "./Funnel"
export { default as Edit } from "./Edit"
export { default as Delete } from "./Delete"
export { default as Refresh } from "./Refresh"
export { default as Menu } from "./Menu"
export { default as Globe } from "./Globe"
export { default as Link } from "./Link"
export { default as Plus } from "./Plus"
export { default as Check } from "./Check"
export { default as Mail } from "./Mail"
export { default as Upload } from "./Upload"
export { default as Document } from "./Document"
export { default as Lock } from "./Lock"
export { default as Sparkle } from "./Sparkle"
export { default as Target } from "./Target"
export { default as Table } from "./Table"
export { default as Inbox } from "./Inbox"
// #endregion

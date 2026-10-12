import { IconProps } from "."

const Inbox = ({
	size = 20,
	...props
}: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			strokeWidth={0}
			d="M6.2 3h11.6a2 2 0 0 1 1.84 1.22l2.28 5.4c.05.12.08.25.08.38V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9c0-.13.03-.26.08-.38l2.28-5.4A2 2 0 0 1 6.2 3Zm0 2-1.7 4H9a1 1 0 0 1 1 1 2 2 0 1 0 4 0 1 1 0 0 1 1-1h4.5l-1.7-4H6.2ZM4 11v8h16v-8h-4.13a4 4 0 0 1-7.74 0H4Z"
		/>
	</svg>
)

export default Inbox

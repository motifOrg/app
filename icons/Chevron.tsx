import { DirectionalProps } from "."

const Chevron = ({
	direction = "right",
	size = 20,
	...props
}: DirectionalProps) => {
	const rotateClass = {
		left: "rotate-180",
		right: "rotate-0",
		up: "-rotate-90",
		down: "rotate-90",
	}[direction]

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 5 9"
			xmlns="http://www.w3.org/2000/svg"
			className={`transition-transform duration-200 ${rotateClass}`}
			{...props}
		>
			<path
				strokeWidth={0}
				d="M0.0363876 0.371693C-0.0448194 0.584619 0.0125148 0.823932 0.182231 0.980447L3.38657 3.93552C3.73032 4.25253 3.73032 4.74747 3.38657 5.06448L0.182231 8.01955C0.0125146 8.17607 -0.0448194 8.41538 0.0363876 8.62831C0.182479 9.01136 0.685431 9.12471 0.991069 8.84346L4.48294 5.63027C5.17235 4.99592 5.17235 4.00408 4.48294 3.36973L0.991069 0.156535C0.685431 -0.124711 0.182479 -0.0113598 0.0363876 0.371693Z"
			/>
		</svg>
	)
}

export default Chevron

import {useMemo, useRef, useState} from 'react'
import * as C from 'recharts'
import * as R from 'remeda'

import {LineChartContext, type Point, type Points} from './LineChartContext'

type Mutable<T> = {
	-readonly [P in keyof T]: T[P]
}

export declare namespace LineChart {
	interface Props<TData extends readonly unknown[]> {
		data: TData
		children: React.ReactNode
		className?: string
	}
}

export function LineChart<TData extends readonly unknown[]>({
	data,
	className,
	...props
}: LineChart.Props<TData>) {
	const pointsRef = useRef<Points>({})
	pointsRef.current = {}
	const coordsRef = useRef<{x: number; y: number}>(undefined)
	const mouseHoverRef = useRef(false)
	const [closestPoint, setClosestPoint] = useState<Point | undefined>(undefined)

	const ctx = useMemo(
		() => ({pointsRef, coordsRef, closestPoint}),
		[closestPoint],
	)

	return (
		<C.ResponsiveContainer className={className}>
			<C.LineChart
				{...props}
				data={data as Mutable<TData>}
				onMouseMove={(state) => {
					mouseHoverRef.current = true
					const coords = state.activeCoordinate
					const points = pointsRef.current
					R.funnel(
						() => {
							if (!mouseHoverRef.current) {
								return
							}
							if (coords == null) {
								setClosestPoint(undefined)
								return
							}
							const closestPoint = R.pipe(
								points,
								R.values(),
								R.sortBy([
									(p) => {
										// find the closest point to the mouse cursor
										const dx = p.cx - coords.x
										const dy = p.cy - coords.y
										return dx * dx + dy * dy
									},
									'asc',
								]),
								R.first(),
							)
							setClosestPoint(closestPoint)
						},
						{
							minQuietPeriodMs: 100,
						},
					).call()
				}}
				onMouseLeave={() => {
					mouseHoverRef.current = false
					setClosestPoint(undefined)
				}}
			>
				<LineChartContext value={ctx}>{props.children}</LineChartContext>
				{/* <TooltipState /> */}
			</C.LineChart>
		</C.ResponsiveContainer>
	)
}

// function TooltipState() {
// 	const maybeActiveTooltipDataPoints = C.useActiveTooltipDataPoints<{
// 		id: string
// 	}>()
// 	const {coordsRef, pointsRef} = useLineChartContext()

// 	const activeTooltipDataPoints = maybeActiveTooltipDataPoints?.[0]

// 	if (!activeTooltipDataPoints) {
// 		return null
// 	}
// 	console.log(
// 		activeTooltipDataPoints,
// 		coordsRef.current[activeTooltipDataPoints.id],
// 		// R.map(dotsMapRef.current, (v) => v),
// 	)
// 	// return <pre>{JSON.stringify(foo, null, 2)}</pre>
// 	return null
// }

import {autoPlacement, offset, useFloating} from '@floating-ui/react'
import type React from 'react'
import {useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import * as C from 'recharts'
import * as R from 'remeda'

import {css, cx} from '#/system/css'

import {
	LineChartContext,
	type Point,
	type Points,
	useLineChartContext,
} from './LineChartContext'

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
	const {refs, floatingStyles, context} = useFloating({
		middleware: [offset(16), autoPlacement()],
	})

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
							if (closestPoint != null) {
								refs.setPositionReference({
									getBoundingClientRect() {
										return {
											x: closestPoint.cx,
											y: closestPoint.cy,
											width: 8,
											height: 8,
											top: closestPoint.cy,
											right: 0,
											bottom: 0,
											left: closestPoint.cx,
										}
									},
								})
							}
							setClosestPoint(closestPoint)
						},
						{
							minGapMs: 300,
							triggerAt: 'start',
						},
					).call()
				}}
				onMouseLeave={() => {
					mouseHoverRef.current = false
					context.onOpenChange(false)
					setClosestPoint(undefined)
				}}
			>
				<LineChartContext value={ctx}>
					{props.children}

					<Tooltip ref={refs.setFloating} style={floatingStyles} />
				</LineChartContext>
			</C.LineChart>
		</C.ResponsiveContainer>
	)
}

function Tooltip(props: React.ComponentPropsWithRef<'div'>) {
	const {closestPoint} = useLineChartContext()

	return createPortal(
		<div
			role="tooltip"
			{...props}
			className={cx(
				props.className,
				css({
					bg: 'gray.900',
					padding: '4',
					rounded: 'md',
					transition: 'transform',
					// biome-ignore lint/complexity/noUselessTernary: panda needs it to be static true or false values
					srOnly: R.isEmptyish(closestPoint) ? true : false,
				}),
			)}
		>
			{closestPoint && (
				<pre>
					{JSON.stringify(R.pick(closestPoint, ['dataKey', 'index']), null, 2)}
				</pre>
			)}
		</div>,
		document.body,
	)
}

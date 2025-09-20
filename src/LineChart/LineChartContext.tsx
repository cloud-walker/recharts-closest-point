import {createContext, use} from 'react'
import type {DataKey} from 'recharts/types/util/types'
import {raise} from '../raise'

export interface Point {
	cx: number
	cy: number
	payload: Record<string, unknown>
	dataKey: DataKey<string>
	index: number
}
export type Points = Record<string, Point>

export interface LineChartContextState {
	pointsRef: React.RefObject<Points>
	coordsRef: React.RefObject<{x: number; y: number} | undefined>
	closestPoint: Point | undefined
}

export const LineChartContext = createContext<
	LineChartContextState | undefined
>(undefined)

export function useLineChartContext() {
	return use(LineChartContext) ?? raise('LineChartContext is not provided')
}

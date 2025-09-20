import * as C from 'recharts'

import {type ColorToken, token} from '#/system/tokens'
import {useLineChartContext} from './LineChartContext'

type ExtractToneFromColorToken<T extends string> =
	T extends `${infer Tone}.${string}` ? Tone : never

const toneToStroke = {
	blue: token('colors.blue.800'),
	rose: token('colors.rose.800'),
	indigo: token('colors.indigo.800'),
	green: token('colors.green.800'),
	yellow: token('colors.yellow.800'),
	red: token('colors.red.800'),
	purple: token('colors.purple.800'),
	pink: token('colors.pink.800'),
	gray: token('colors.gray.800'),
} as const satisfies Partial<
	Record<ExtractToneFromColorToken<ColorToken>, string>
>

export declare namespace Line {
	interface Props extends Pick<C.LineProps, 'dataKey'> {
		tone?: keyof typeof toneToStroke
	}
}

export function Line({tone = 'gray', ...props}: Line.Props) {
	const {pointsRef, closestPoint} = useLineChartContext()
	return (
		<C.Line
			isAnimationActive={false}
			{...props}
			stroke={toneToStroke[tone]}
			activeDot={
				closestPoint?.dataKey === props.dataKey
					? {
							stroke: toneToStroke.pink,
						}
					: undefined
			}
			dot={({key, ...dotProps}) => {
				pointsRef.current[`${props.dataKey?.toString()}-${key}`] ??= dotProps
				return <C.Dot key={key} {...dotProps} />
			}}
		/>
	)
}

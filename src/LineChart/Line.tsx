import * as C from 'recharts'

import {css} from '#/system/css'
import {type ColorToken, token} from '#/system/tokens'

import {useLineChartContext} from './LineChartContext'

type ExtractToneFromColorToken<T extends string> =
	T extends `${infer Tone}.${string}` ? Tone : never

const toneToStroke = {
	blue: token('colors.blue.400'),
	rose: token('colors.rose.400'),
	indigo: token('colors.indigo.400'),
	green: token('colors.green.400'),
	yellow: token('colors.yellow.400'),
	red: token('colors.red.400'),
	purple: token('colors.purple.400'),
	pink: token('colors.pink.400'),
	gray: token('colors.gray.400'),
} as const satisfies Partial<
	Record<ExtractToneFromColorToken<ColorToken>, string>
>

export declare namespace Line {
	interface Props extends Pick<C.LineProps, 'dataKey'> {
		tone?: keyof typeof toneToStroke
	}
}

export function Line({tone = 'gray', ...props}: Line.Props) {
	const {pointsRef, closestPoint, setIsLockingTooltip} = useLineChartContext()
	return (
		<C.Line
			isAnimationActive={false}
			{...props}
			stroke={toneToStroke[tone]}
			strokeWidth={2}
			className={css({
				transitionProperty: '[opacity]',
				transitionDuration: '[200ms]',
				opacity:
					closestPoint == null || closestPoint?.dataKey === props.dataKey
						? 1
						: 0.3,
			})}
			activeDot={false}
			dot={({key, ...dotProps}) => {
				pointsRef.current[`${props.dataKey?.toString()}__${dotProps.index}`] ??=
					dotProps
				const isClosest =
					closestPoint?.index === dotProps.index &&
					closestPoint?.dataKey === dotProps.dataKey
				if (isClosest) {
					return (
						<C.Dot
							key={key}
							{...dotProps}
							r={2}
							stroke={toneToStroke.pink}
							fill={toneToStroke.pink}
							strokeWidth={8}
							onClick={() => {
								setIsLockingTooltip(true)
							}}
						/>
					)
				}
				return <C.Dot key={key} {...dotProps} r={2} fill={toneToStroke[tone]} />
			}}
		/>
	)
}

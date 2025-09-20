import {faker as F} from '@faker-js/faker'

import {css} from '#/system/css'

import {Line, LineChart} from './LineChart'

const data = F.helpers.multiple(
	() => {
		return {
			id: F.string.uuid(),
			quality_1: F.number.float({min: 0, max: 1}),
			quality_2: F.number.float({min: 0, max: 1}),
			date: F.date.past(),
		}
	},
	{count: 30},
)

export function App() {
	return (
		<LineChart data={data} className={css({height: 'svh!'})}>
			<Line dataKey="quality_1" tone="blue" />
			<Line dataKey="quality_2" tone="green" />
		</LineChart>
	)
}

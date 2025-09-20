import {faker as F} from '@faker-js/faker'
import * as C from 'recharts'

import {css} from '#/system/css'
import {Line} from './LineChart'

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
		<C.ResponsiveContainer className={css({height: 'svh!'})}>
			<C.LineChart data={data}>
				<Line dataKey="quality_1" tone="blue" />
				<Line dataKey="quality_2" tone="green" />
				{/* <C.XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <C.YAxis /> */}
				{/* <C.Tooltip
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        /> */}
				{/* <C.CartesianGrid stroke="#ccc" /> */}
			</C.LineChart>
		</C.ResponsiveContainer>
	)
}

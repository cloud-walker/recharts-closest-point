import { faker as F } from "@faker-js/faker";
import * as C from "recharts";

import { css } from "../styled-system/css";
import { Line } from "./LineChart";

const data = F.helpers.multiple(
  () => {
    return {
      id: F.string.uuid(),
      amount: F.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
      date: F.date.past(),
    };
  },
  { count: 30 }
);

export function App() {
  return (
    <C.ResponsiveContainer className={css({ height: "svh!" })}>
      <C.LineChart data={data}>
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        <C.XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <C.YAxis />
        <C.Tooltip
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        {/* <C.CartesianGrid stroke="#ccc" /> */}
      </C.LineChart>
    </C.ResponsiveContainer>
  );
}

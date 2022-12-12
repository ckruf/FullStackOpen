import { TotalProps } from "../types";

const Total = ({total}: TotalProps) => {
  return <p><strong>Total number of exercises: {total}</strong></p>
}

export default Total;
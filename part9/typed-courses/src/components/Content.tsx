import { ContentProps } from "../types";
import Part from "./Part";

const Content = ({courseParts}: ContentProps) => {
  return (
    <>
      {
        courseParts.map(coursePart => <Part key={coursePart.name} part={coursePart} />)
      }
    </>
  )
}

export default Content;
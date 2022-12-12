import { PartProps } from "../types";
import { assertNever } from "../utils";

const Part = ({ part }: PartProps) => {

  const returnedElements = []
  const courseNameElement = <p><b>{part.name}</b></p>;
  const exerciseCountElement = <p>Exercise count: {part.exerciseCount}</p>;
  returnedElements.push(courseNameElement);
  returnedElements.push(exerciseCountElement);

  switch (part.type) {
    case "normal":
      returnedElements.push(<p>Description: {part.description}</p>)
      break;
    case "groupProject":
      returnedElements.push(<p>Group project count: {part.groupProjectCount}</p>)
      break;
    case "submission":
      returnedElements.push(<p>Description: {part.description}</p>)
      returnedElements.push(<p>Exercise submission link: <a href={part.exerciseSubmissionLink}>{part.exerciseSubmissionLink}</a></p>)
      break;
    case "special":
    returnedElements.push(<p>Required skills: {part.requirements.join(", ")}</p>)  
    break;
    default:
      assertNever(part);
  }

  return (
    <>
      {returnedElements}
    </>
  )
}

export default Part;
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string
}

interface CoursePartDescribed extends CoursePartBase {
  description: string;
}

interface CoursePartNormal extends CoursePartDescribed {
  type: "normal";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  type: "groupProject";
}

interface CoursePartSubmission extends CoursePartDescribed {
  exerciseSubmissionLink: string;
  type: "submission"
}

interface CoursePartSpecial extends CoursePartDescribed {
  requirements: Array<string>;
  type: "special";
}

export type CoursePart = CoursePartNormal | CoursePartGroup | CoursePartSubmission | CoursePartSpecial;

export interface ContentProps {
  courseParts: Array<CoursePart>
}

export interface HeaderProps {
  courseName: string;
}

export interface TotalProps {
  total: number
}

export interface PartProps {
  part: CoursePart;
}
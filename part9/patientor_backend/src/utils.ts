import { NewPatient, Gender } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing string: " + text);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatient = (incomingData: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(incomingData.name),
    dateOfBirth: parseDate(incomingData.dateOfBirth),
    ssn: parseString(incomingData.ssn),
    gender: parseGender(incomingData.gender),
    occupation: parseString(incomingData.occupation) 
  };

  return newPatient;
};

export default { toNewPatient };
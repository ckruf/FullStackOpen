"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const parseString = (text) => {
    if (!text || !isString(text)) {
        throw new Error("Incorrect or missing string: " + text);
    }
    return text;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date: " + date);
    }
    return date;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(types_1.Gender).includes(param);
};
const parseGender = (gender) => {
    if (!gender || !isGender(gender)) {
        throw new Error("Incorrect or missing gender: " + gender);
    }
    return gender;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatient = (incomingData) => {
    const newPatient = {
        name: parseString(incomingData.name),
        dateOfBirth: parseDate(incomingData.dateOfBirth),
        ssn: parseString(incomingData.ssn),
        gender: parseGender(incomingData.gender),
        occupation: parseString(incomingData.occupation)
    };
    return newPatient;
};
exports.default = { toNewPatient };

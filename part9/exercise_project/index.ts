import { determineBmi } from "./bmiCalculator";
import { exerciseCalculator } from "./exerciseCalculator";
import type { BmiResult } from "./bmiCalculator";
import type { exerciseAssessment } from "./exerciseCalculator";

import express from "express";
const app = express();

app.use(express.json())

app.get("/ping", (_req, res) => {
  return res.send("pong");
});

app.get("/hello", (_req, res) => {
  return res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const inputHeightCm = req.query.height;
  const inputWeightKg = req.query.weight;

  if(isNaN(Number(inputHeightCm)) || isNaN(Number(inputWeightKg))) {
    return res.status(400).json({error: "malformatted parameters"});
  }
  const heightCm = Number(inputHeightCm);
  const weightKg = Number(inputWeightKg);
  const result: BmiResult = determineBmi(heightCm, weightKg);
  return res.json({
    weight: weightKg,
    height: heightCm,
    bmi: result
  });
});

app.post("/assessment_calculator", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dailyExercisesInput: any = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target: any = req.body.target;
  if (!dailyExercisesInput || !target) {
    return res.status(400).json({error: "parameters missing"});
  }

  if (isNaN(Number(target))) {
    return res.status(400).json({error: "malformatted parameters"});
  }
  if (!Array.isArray(dailyExercisesInput)) {
    return res.status(400).json({error: "malformatted parameters"});
  }
  
  for (let i = 0; i < dailyExercisesInput.length; i++) {
    if (isNaN(Number(dailyExercisesInput[i]))) {
      return res.status(400).json({error: "malformatted parameters"});
    } else {
      dailyExercisesInput[i] = Number(dailyExercisesInput[i]);
    }
  }

  const result: exerciseAssessment = exerciseCalculator(Number(target), dailyExercisesInput as number[]);
  return res.json(result);
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

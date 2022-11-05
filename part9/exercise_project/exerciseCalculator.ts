type Rating = 1 | 2 | 3;
type RatingDescription = "You've still got some work to do" | "You're on your way" | "Target reached, well done";

export interface exerciseAssessment {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: RatingDescription;
  target: number;
  average: number;
}

interface exerciseInputs {
  target: number;
  dailyTrainingHours: Array<number>;
}



const parseArguments = (args: Array<string>): exerciseInputs => {
  if (args.length < 4) throw new Error("Not enough arguments. USAGE: npm run calculateBmi target hoursDay1 [hoursDay2 ...]");

  return args.reduce((counterObject, arg, index) => {
    // skip first two args as they are not data we're interested in
    // eg npm run calculateExercises 2 1 2 0 3 4; we are not interested in 'run'
    if (index > 1) {
      if (isNaN(Number(arg))) {
        throw new Error(`Provided values must be numbers! This is not a number ${arg}`);
      } 
      else {
        // first provided 'number' (number represented as a string) is target
        if (index == 2) {
          counterObject.target = Number(arg);
        } else {
          // convert all following args to actual numbers and collect into array
          counterObject.dailyTrainingHours.push(Number(arg));
        }
      }
    }
    return counterObject;
  }, {target: 0, dailyTrainingHours: [] as Array<number>});
};

export const exerciseCalculator = (target: number, dailyTrainingHours: Array<number>): exerciseAssessment => {
  let totalHours = 0;
  let nonZeroCount = 0;
  
  dailyTrainingHours.forEach(dailyHours => {
    totalHours += dailyHours;
    if (dailyHours > 0) nonZeroCount++;
  });

  const averageDailyHours = totalHours / dailyTrainingHours.length;
  const successRatio = averageDailyHours / target;
  let rating: Rating;
  let ratingDescription: RatingDescription;



  if (successRatio < 0.5) {
    rating = 1;
    ratingDescription = "You've still got some work to do";
  } else if (successRatio < 1) {
    rating = 2;
    ratingDescription = "You're on your way";
  } else {
    rating = 3;
    ratingDescription = "Target reached, well done";
  }

  return {
    periodLength: dailyTrainingHours.length,
    trainingDays: nonZeroCount,
    success: averageDailyHours >= target,
    rating,
    ratingDescription,
    target,
    average: averageDailyHours
  };
};

if (typeof require !== 'undefined' && require.main === module) {
  try {
    const { target, dailyTrainingHours } = parseArguments(process.argv);
    console.log(exerciseCalculator(target, dailyTrainingHours));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}

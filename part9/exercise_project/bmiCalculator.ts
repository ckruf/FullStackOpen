type BmiResult = "Underweight" | "Healthy" | "Overweight" | "Obese";

interface BmiInput {
  heightCm: number,
  weightKg: number
}

const parseArguments = (args: Array<String>): BmiInput => {
  const usageMsg = "USAGE: npm run calculateBmi <heightCm> <weightKg>";
  if (args.length > 4) throw new Error("Too many arguments. " + usageMsg);
  if (args.length < 4) throw new Error("Not enough arguments. " + usageMsg);

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      heightCm: Number(args[2]),
      weightKg: Number(args[3])
    }
  } else {
    throw new Error("Provided values must be numbers!");
  }

}

const determineBmi = (heightCm: number, weightKg: number): BmiResult => {
  const bmi = weightKg / ((heightCm / 100.0)**2);
  if (bmi < 18.5) {
    return "Underweight";
  }
  if (bmi >= 30) {
    return "Obese";
  }
  if (bmi >= 25) {
    return "Overweight";
  }
  return "Healthy";
}

try {
 const { heightCm, weightKg } = parseArguments(process.argv);
 console.log(determineBmi(heightCm, weightKg)); 
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
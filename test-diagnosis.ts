import { getRandomDiagnosis } from './src/lib/mockDiagnosis';

function test() {
    console.log("Testing with Tomato (Healthy hint)...");
    const res1 = getRandomDiagnosis("Tomato", true);
    console.log("Result:", res1.disease, res1.status);

    console.log("\nTesting with Potato (Healthy hint)...");
    const res2 = getRandomDiagnosis("Potato", true);
    console.log("Result:", res2.disease, res2.status);

    console.log("\nTesting with Tomato (No hint)...");
    const res3 = getRandomDiagnosis("Tomato", false);
    console.log("Result:", res3.disease, res3.status);
}

test();


import responsesDb from "../data/responses.json";
import {arraySum} from "./utils.ts";

const CORRECT_COUNTS: number[] = responsesDb.correct_counts;
export const TOTAL_RESPONDERS = arraySum(CORRECT_COUNTS);

export function getResponsesPercentile(correctCount: number): number {
    // Include half of your own column.
    const betterThan = arraySum(CORRECT_COUNTS.slice(0, correctCount)) + CORRECT_COUNTS[correctCount]/2;
    return Math.round(betterThan / TOTAL_RESPONDERS * 100);
}

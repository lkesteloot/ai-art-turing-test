
import responsesDb from "../data/responses.json";
import {arraySum} from "./utils.ts";

export const CORRECT_COUNTS: number[] = responsesDb.correct_counts;
export const TOTAL_RESPONDERS = arraySum(CORRECT_COUNTS);

/**
 * Given a number of correct answers, gets the percentile (0-100) of the user amongst all users.
 */
export function getResponsesPercentile(correctCount: number): number {
    // Include half of your own column.
    const betterThan = arraySum(CORRECT_COUNTS.slice(0, correctCount)) + CORRECT_COUNTS[correctCount]/2;
    return Math.round(betterThan / TOTAL_RESPONDERS * 100);
}

/**
 * The percent of users who got this particular question right.
 */
export function questionPercentageRight(id: number): number {
    return Math.round(responsesDb.question_correct_counts[id] / TOTAL_RESPONDERS * 100);
}

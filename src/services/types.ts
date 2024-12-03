
/**
 * The user's guess.
 */
export type Answer = "human" | "ai";
export type Guess = "none" | Answer;

/**
 * What to do when the user answers a question.
 */
export type QuizMode = "reveal" | "advance";

/**
 * Convert a boolean to a guess.
 */
export function isHumanToAnswer(isHuman: boolean): Answer {
    return isHuman ? "human" : "ai";
}

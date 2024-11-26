
export type Answer = "human" | "ai";
export type Guess = "none" | Answer;

export function isHumanToAnswer(isHuman: boolean): Answer {
    return isHuman ? "human" : "ai";
}

export const GUESS_TO_STRING: Record<Guess,string> = {
    "none": "No answer",
    "human": "Human",
    "ai": "AI",
};


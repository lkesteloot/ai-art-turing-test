import db from "./imagedb";
import {Guess, QuizMode} from "./types";
import {useLocalStorage} from "../hooks/uselocalstorage";

const QUESTION_COUNT = db.images.length;
const USER_DB_KEY = "user_db";

/**
 * Data stored in local storage.
 */
export interface UserDb {
    quizMode: QuizMode,
    guesses: Guess[],
}

/**
 * Make a default object, with no guesses.
 */
function makeDefaultUserDb(): UserDb {
    return {
        quizMode: "reveal",
        guesses: new Array(QUESTION_COUNT).fill("none"),
    };
}

/**
 * Get a new copy with a particular quiz mode.
 */
export function withQuizMode(userDb: UserDb, quizMode: QuizMode): UserDb {
    return {
        ... userDb,
        quizMode,
    };
}

/**
 * Get a new copy with the guess specified.
 */
export function withGuess(userDb: UserDb, id: number, newGuess: Guess): UserDb {
    if (id < 0 || id >= QUESTION_COUNT) {
        throw new Error("id out of range: " + id);
    }

    return {
        ... userDb,
        guesses: userDb.guesses.with(id, newGuess),
    };
}

/**
 * Get a copy with all guesses cleared out.
 */
export function withNoGuesses(userDb: UserDb): UserDb {
    return {
        ... userDb,
        guesses: userDb.guesses.fill("none"),
    };
}

/**
 * Hook to store the user DB in local storage. Only call this once and pass them around.
 */
export function useUserDb(): [UserDb, (userDb: UserDb) => void] {
    return useLocalStorage(USER_DB_KEY, makeDefaultUserDb);
}

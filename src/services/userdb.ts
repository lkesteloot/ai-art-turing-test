import db from "./imagedb";
import {Guess} from "./types";
import {useLocalStorage} from "../hooks/uselocalstorage";

const QUESTION_COUNT = db.images.length;
const USER_DB_KEY = "user_db";

export interface UserDb {
    autoDisplayAnswer: boolean,
    guesses: Guess[],
}

function makeDefaultUserDb(): UserDb {
    return {
        autoDisplayAnswer: false,
        guesses: new Array(QUESTION_COUNT).fill("none"),
    };
}

export function withGuess(userDb: UserDb, id: number, newGuess: Guess): UserDb {
    if (id < 0 || id >= QUESTION_COUNT) {
        throw new Error("id out of range: " + id);
    }

    return {
        ... userDb,
        guesses: userDb.guesses.with(id, newGuess),
    };
}

export function withNoGuesses(userDb: UserDb): UserDb {
    return {
        ... userDb,
        guesses: userDb.guesses.fill("none"),
    };
}

/**
 * Only call this once and pass them around.
 */
export function useUserDb(): [UserDb, (userDb: UserDb) => void] {
    return useLocalStorage(USER_DB_KEY, makeDefaultUserDb);
}

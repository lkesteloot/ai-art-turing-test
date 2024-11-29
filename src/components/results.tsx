
import imageDb from "../services/imagedb";
import {UserDb} from "../services/userdb";
import {isHumanToAnswer} from "../services/types";

export default function Results({
                                    userDb,
                                }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    const guesses = userDb.guesses;

    let correct = 0;
    for (let i = 0; i < guesses.length; i++) {
        if (guesses[i] === isHumanToAnswer(imageDb.images[i].human)) {
            correct += 1;
        }
    }

    return <section id="results" className="min-h-screen snap-center">
        Got {correct} right out of {guesses.length}.
    </section>;
}

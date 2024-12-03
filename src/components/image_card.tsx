
import Buttons from "./buttons";
import Button from "./button";
import CheckedButton from "./checked_button";
import db, {Image, getImageUrl, makeImageCardId} from "../services/imagedb";
import {UserDb, withGuess} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import {scrollToSelector} from "../services/utils.ts";
import {questionPercentageRight} from "../services/responsesdb.ts";

const QUESTION_COUNT = db.images.length;
const SHOW_CHOICE_EMOJI = false;

/**
 * Full-screen card to show an image and get the guess from the user.
 */
export default function ImageCard({
    id,
    userDb,
    setUserDb
}: {
    id: number,
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    if (id < 0 || id >= QUESTION_COUNT) {
        throw new Error("Invalid ID: " + id);
    }

    const image = db.images[id] as Image;
    const guess = userDb.guesses[id];
    const guessIsCorrect = guess === isHumanToAnswer(image.human);
    const isLastQuestion = id === QUESTION_COUNT - 1;
    const nextSelector = isLastQuestion ? "#results" : "#" + makeImageCardId(id + 1);
    const nextLabel = isLastQuestion ? "Results" : "Next";
    const nextEmoji = isLastQuestion ? "👀" : "🦘";
    let showAnswer: boolean;
    switch (userDb.quizMode) {
        case "reveal":
            // Show answer if this question has a guess.
            showAnswer = guess !== "none";
            break;

        case "advance":
            // Show answer if all questions have a guess.
            showAnswer = userDb.guesses.every(guess => guess !== "none");
            break;
    }

    // Update the user's guess on this question.
    function vote(newGuess: Guess) {
        if (newGuess !== "none" && newGuess === guess) {
            // Unset answer.
            newGuess = "none";
        }
        setUserDb(withGuess(userDb, id, newGuess));
        if (newGuess !== "none" && userDb.quizMode === "advance") {
            // Can't do it right away because updating the DB causes React
            // to mess with the DOM in a way that interferes with the scrolling.
            setTimeout(() => scrollToSelector(nextSelector), 0);
        }
    }

    return <section id={makeImageCardId(id)} className="min-h-screen flex flex-row portrait:flex-col snap-center">
        <div className="grow max-h-screen relative">
            <img className="w-full h-full object-contain bg-stone-800 absolute inset-0" src={getImageUrl(id, image)} alt={image.title}/>
        </div>
        <div className="w-96 p-4 flex flex-col gap-4 max-h-screen overflow-y-auto portrait:self-center portrait:max-h-[50vh]">
            <div className="text-center pb-8">
                <div className="font-bold text-lg">{image.title}</div>
                <div className="text-gray-500">{id + 1} of {QUESTION_COUNT}</div>
            </div>

            <Buttons>
                <CheckedButton action={() => vote("human")} checked={guess === "human"} emoji={SHOW_CHOICE_EMOJI ? "🧑‍🎨" : undefined}>Human</CheckedButton>
                <CheckedButton action={() => vote("ai")} checked={guess === "ai"} emoji={SHOW_CHOICE_EMOJI ? "🤖" : undefined}>AI</CheckedButton>
            </Buttons>

            {showAnswer && <>
                {guess !== "none" && <div
                    className={"text-center text-3xl font-bold pt-8 pb-4 " + (guessIsCorrect ? "text-green-500" : "text-red-500")}>
                    {guessIsCorrect ? "You’re right! 🔥" : "Nope! 😭"}
                </div>}
                <div>{image.attribution} {image.attributionUrl && <span><a href={image.attributionUrl} target="_blank"
                                                                           className="underline text-stone-500 whitespace-nowrap">More info</a></span>}</div>
                {image.note && <div>{image.note}</div>}

                <p>{questionPercentageRight(id)}% of people got this one right.</p>
            </>}

            <div className="grow"></div>
            <Buttons>
                <Button action={() => scrollToSelector(nextSelector)} emoji={nextEmoji}>{nextLabel}</Button>
            </Buttons>
        </div>
    </section>;
}

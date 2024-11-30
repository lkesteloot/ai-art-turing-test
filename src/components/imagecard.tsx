
import Buttons from "./buttons";
import Button from "./button";
import CheckedButton from "./checked_button";
import db, {Image, getImageUrl, makeImageCardId} from "../services/imagedb";
import {UserDb, withGuess} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import {temporarilyDisableSnap} from "../services/utils.ts";
import {questionPercentageRight} from "../services/responsesdb.ts";

const QUESTION_COUNT = db.images.length;

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
    const nextUrl = isLastQuestion ? "#results" : "#" + makeImageCardId(id + 1);
    const nextLabel = isLastQuestion ? "Results" : "Next";
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


    function vote(newGuess: Guess) {
        if (newGuess !== "none" && newGuess === guess) {
            // Unset answer.
            newGuess = "none";
        }
        setUserDb(withGuess(userDb, id, newGuess));
        if (newGuess !== "none" && userDb.quizMode === "advance") {
            temporarilyDisableSnap();
            window.location.href = nextUrl;
        }
    }

    return <section id={makeImageCardId(id)} className="min-h-screen flex snap-center">
        <div className="grow max-h-screen">
            <img className="w-full h-full object-contain" src={getImageUrl(id, image)} alt={image.title}/>
        </div>
        <div className="w-96 p-4 flex flex-col gap-4">
            <div className="text-center pb-8">
                <div className="font-bold text-lg">{image.title}</div>
                <div className="text-gray-500">{id + 1} of {QUESTION_COUNT}</div>
            </div>

            <Buttons>
                <CheckedButton action={() => vote("human")} checked={guess === "human"}>Human</CheckedButton>
                <CheckedButton action={() => vote("ai")} checked={guess === "ai"}>AI</CheckedButton>
            </Buttons>

            {showAnswer && <>
                {guess !== "none" && <div
                    className={"text-center text-3xl font-bold pt-8 pb-4 " + (guessIsCorrect ? "text-green-500" : "text-red-500")}>
                    {guessIsCorrect ? "You’re right!" : "Nope!"}
                </div>}
                <div>{image.attribution} {image.attributionUrl && <span><a href={image.attributionUrl} target="_blank"
                                                                           className="underline text-stone-500 whitespace-nowrap">More info</a></span>}</div>
                {image.note && <div>{image.note}</div>}

                <p>{questionPercentageRight(id)}% of people got this one right.</p>
            </>}

            <div className="grow"></div>
            <Buttons>
            <Button href={nextUrl}>{nextLabel}</Button>
            </Buttons>
        </div>
    </section>;
}

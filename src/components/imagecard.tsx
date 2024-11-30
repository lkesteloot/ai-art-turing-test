
import { useState } from "react";
import Buttons from "./buttons";
import Button from "./button";
import CheckedButton from "./checked_button";
import db, {Image, getImageUrl, makeImageCardId} from "../services/imagedb";
import {UserDb, withGuess} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import {temporarilyDisableSnap} from "../services/utils.ts";

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

    const [showAnswer, setShowAnswer] = useState(false);

    const image = db.images[id] as Image;
    const guess = userDb.guesses[id];
    const guessIsCorrect = guess === isHumanToAnswer(image.human);
    const nextUrl = "#" + makeImageCardId(id + 1);

    function vote(newGuess: Guess) {
        if (newGuess !== "none" && newGuess === guess) {
            // Unset answer.
            newGuess = "none";
        }
        setUserDb(withGuess(userDb, id, newGuess));
        if (newGuess !== "none") {
            switch (userDb.quizMode) {
                case "reveal":
                    setShowAnswer(true);
                    break;

                case "advance":
                    temporarilyDisableSnap();
                    window.location = nextUrl;
                    break;
            }
        }
    }

    return <section id={makeImageCardId(id)} className="min-h-screen flex snap-center">
        <div className="grow max-h-screen">
            <img className="w-full h-full object-contain" src={getImageUrl(id, image)} alt={image.title}/>
        </div>
        <div className="w-96 p-4 flex flex-col gap-4">
            <div className="text-center">
                <span className="font-bold text-lg">{image.title}</span> {" "}
                <span className="text-gray-400">({id + 1} of {QUESTION_COUNT})</span>
            </div>
            <Buttons>
                <CheckedButton action={() => vote("human")} checked={guess === "human"}>Human</CheckedButton>
                <CheckedButton action={() => vote("ai")} checked={guess === "ai"}>AI</CheckedButton>
            </Buttons>

            {!showAnswer &&
                <Buttons>
                    <Button action={() => setShowAnswer(true)} enabled={guess !== "none"}>Show Answer</Button>
                </Buttons>
            }
            {showAnswer && <>
                { guess !== "none" && <div className={"text-center text-3xl font-bold pt-8 pb-4 " + (guessIsCorrect ? "text-green-500" : "text-red-500")}>
                    { guessIsCorrect ? "You’re right!" : "Nope!" }
                </div> }
                <div>{ image.attribution } { image.attributionUrl && <span><a href={image.attributionUrl} target="_blank" className="underline text-stone-500 whitespace-nowrap">More info</a></span> }</div>
                { image.note && <div>{image.note}</div> }
            </>}
            <div className="grow"></div>
            <Buttons>
                { id < QUESTION_COUNT - 1
                    ? <Button href={nextUrl}>Next</Button>
                    : <Button href="#results">Results</Button> }
            </Buttons>
        </div>
    </section>;
}

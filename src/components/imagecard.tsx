
import { useState } from "react";
import Buttons from "./buttons";
import Button from "./button";
import CheckedButton from "./checked_button";
import db, { Image, getImageUrl } from "../services/imagedb";
import {UserDb, withGuess} from "../services/userdb";
import {Guess, GUESS_TO_STRING, isHumanToAnswer} from "../services/types";

const QUESTION_COUNT = db.images.length;

export function makeImageCardId(id: number): string {
    return "image-" + id;
}

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

    function vote(newGuess: Guess) {
        if (newGuess !== "none" && newGuess === guess) {
            // Unset answer.
            newGuess = "none";
        }
        setUserDb(withGuess(userDb, id, newGuess));
    }

    return <div id={makeImageCardId(id)} className="min-h-screen flex snap-center">
        <div className="grow max-h-screen">
            <img className="w-full h-full object-contain" src={getImageUrl(id, image)} alt={image.title}/>
        </div>
        <div className="w-96 p-4">
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
                <div>Your answer: {GUESS_TO_STRING[guess]}</div>
                <div>Actual answer: {GUESS_TO_STRING[isHumanToAnswer(image.human)]}</div>
                <div>Attribution: { image.attribution } { image.attributionUrl && <span>(<a href={image.attributionUrl} target="_blank" className="underline text-blue-700 dark:text-blue-500">Original</a>)</span> }
                </div>
                { image.note && <div>{image.note}</div> }
            </>}
            <Buttons>
                { id < QUESTION_COUNT - 1
                    ? <Button href={"#" + makeImageCardId(id + 1)}>Next</Button>
                    : <Button href="#results">Results</Button> }
            </Buttons>
        </div>
    </div>;
}

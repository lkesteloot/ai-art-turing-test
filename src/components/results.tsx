
import type { React } from 'react';
import imageDb, {getImageUrl, Image} from "../services/imagedb";
import {UserDb} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import {makeImageCardId} from "./imagecard.tsx";

interface Result {
    id: number,
    guess: Guess,
    image: Image,
    isCorrect: boolean,
}

function ImageGrid({
                       results,
                       noResultsHeader,
                       oneResultHeader,
                       multipleResultsHeader,
                   }: {
    results: Result[],
    noResultsHeader?: () => string,
    oneResultHeader: () => string,
    multipleResultsHeader: (count: number) => string,
}) {
    if (results.length === 0 && noResultsHeader === undefined) {
        return;
    }

    return <>
        <h2 className="text-xl mt-8 mb-4">{results.length === 0
            ? noResultsHeader()
            : results.length === 1
                ? oneResultHeader()
                : multipleResultsHeader(results.length)}</h2>

        <div className="grid grid-flow-col gap-4 w-fit my-4">
            {results.map(result => <div key={result.id}>
                <a className="block w-32 h-32" href={"#" + makeImageCardId(result.id)}>
                    <img className="w-full h-full object-contain" src={getImageUrl(result.id, result.image)}
                         alt={result.image.title}/>
                </a>
            </div>)}
        </div>
    </>;
}

export default function Results({
                                    userDb,
                                }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    const results: Result[] = userDb.guesses.map((guess, index) => ({
        id: index,
        guess: guess,
        image: imageDb.images[index],
        isCorrect: guess === isHumanToAnswer(imageDb.images[index].human),
    }));

    return <section id="results" className="min-h-screen snap-center max-w-prose p-4 pt-16 mx-auto">
        <h1 className="text-5xl py-4">Results</h1>

        <ImageGrid results={results.filter(result => result.isCorrect)}
                   noResultsHeader={() => "You got none right!"}
                   oneResultHeader={() => "You got this one right:"}
                   multipleResultsHeader={count => "You got these " + count + " right out of " + results.length + ":"}
        />

        <ImageGrid results={results.filter(result => !result.isCorrect && result.guess === "human")}
                   oneResultHeader={() => "You thought this one was made by a human, but it was made by an AI:"}
                   multipleResultsHeader={count => "You thought these " + count + " were made by a human, but they were made by an AI:"}
        />

        <ImageGrid results={results.filter(result => !result.isCorrect && result.guess === "ai")}
                   oneResultHeader={() => "You thought this one was made by an AI, but it was made by a human:"}
                   multipleResultsHeader={count => "You thought these " + count + " were made by an AI, but they were made by a human:"}
        />
    </section>;
}

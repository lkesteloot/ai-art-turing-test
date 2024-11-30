
import imageDb, {getImageUrl, Image, makeImageCardId} from "../services/imagedb";
import {UserDb} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import Buttons from "./buttons.tsx";
import Button from "./button.tsx";
import {getResponsesPercentile, TOTAL_RESPONDERS} from "../services/responsesdb.ts";
import {getOrdinalNumber} from "../services/utils.ts";

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
        <h2 className="mt-8 mb-4">{results.length === 0
            ? noResultsHeader?.()
            : results.length === 1
                ? oneResultHeader()
                : multipleResultsHeader(results.length)}</h2>

        <div className="flex flex-wrap gap-4 my-4">
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

    const correctCount = results.filter(result => result.isCorrect).length;
    const correctPercent = Math.round(correctCount / results.length * 100);
    const correctPercentile = getResponsesPercentile(correctCount);

    return <section id="results" className="min-h-screen snap-center max-w-prose p-4 pt-16 mx-auto">
        <h1 className="text-center text-5xl py-4 font-bold text-cyan-500 text-glow">Results</h1>

        <p className="my-4">You got {correctCount} right out of {results.length}.
            That's {correctPercent}%,
            which puts you at the {getOrdinalNumber(correctPercentile)} percentile of
            the {TOTAL_RESPONDERS.toLocaleString()} people who took the test.</p>

        <ImageGrid results={results.filter(result => result.guess === "none")}
                   oneResultHeader={() => "You haven't answered this one:"}
                   multipleResultsHeader={count => `You haven't answered these ${count}:`}
        />

        <ImageGrid results={results.filter(result => result.isCorrect)}
                   noResultsHeader={() => "You got none right!"}
                   oneResultHeader={() => "You got this one right:"}
                   multipleResultsHeader={count => `You got these ${count} right:`}
        />

        <ImageGrid results={results.filter(result => !result.isCorrect && result.guess === "human")}
                   oneResultHeader={() => "You thought this one was made by a human, but it was made by an AI:"}
                   multipleResultsHeader={count => "You thought these " + count + " were made by a human, but they were made by an AI:"}
        />

        <ImageGrid results={results.filter(result => !result.isCorrect && result.guess === "ai")}
                   oneResultHeader={() => "You thought this one was made by an AI, but it was made by a human:"}
                   multipleResultsHeader={count => "You thought these " + count + " were made by an AI, but they were made by a human:"}
        />

        <div className="h-8"></div>

        <Buttons>
            <Button href={"#" + makeImageCardId(0)}>Review Your Guesses</Button>
        </Buttons>
    </section>;
}

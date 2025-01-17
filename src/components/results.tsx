
import { LazyLoadImage } from "react-lazy-load-image-component";
import imageDb, {getImageUrl, Image, makeImageCardId} from "../services/imagedb";
import {UserDb} from "../services/userdb";
import {Guess, isHumanToAnswer} from "../services/types";
import Buttons from "./buttons.tsx";
import Button from "./button.tsx";
import {CORRECT_COUNTS, getResponsesPercentile, TOTAL_RESPONDERS} from "../services/responsesdb.ts";
import {getOrdinalNumber, scrollToSelector} from "../services/utils.ts";

/**
 * Information about each question answered.
 */
interface Result {
    // ID of the photo (0 to 49).
    id: number,
    // The user's guess.
    guess: Guess,
    // The image shown.
    image: Image,
    // Whether the user got this one right.
    isCorrect: boolean,
}

/**
 * Component to show a thumbnail of an image.
 */
function Thumbnail({ result }: { result: Result }) {
    return <LazyLoadImage className="w-32 h-32 object-cover cursor-pointer"
                src={getImageUrl(result.id, result.image)}
                alt={result.image.title}
                onClick={() => scrollToSelector("#" + makeImageCardId(result.id))}/>;
}

/**
 * Show a grid of images with a header.
 */
function ImageGrid({
                       results,
                       oneResultHeader,
                       multipleResultsHeader,
                   }: {
    results: Result[],
    oneResultHeader: () => string,
    multipleResultsHeader: (count: number) => string,
}) {
    if (results.length === 0) {
        return;
    }

    const header = results.length === 1 ? oneResultHeader() : multipleResultsHeader(results.length);

    return <>
        <h2 className="mt-8 mb-4">{header}</h2>

        <div className="flex flex-wrap gap-4 my-4">
            {results.map(result => <Thumbnail key={result.id} result={result}/>)}
        </div>
    </>;
}

/**
 * Show a histogram of responses and plot the user's location in it.
 */
function Chart({ correctCount }: { correctCount: number }) {
    const WIDTH = 500;
    const HEIGHT = 300;
    const MARGIN = 5;
    const correctToX = (value: number) => Math.round(value*(WIDTH - 2*MARGIN)/CORRECT_COUNTS.length + MARGIN);
    const countToY = (value: number) => Math.round(HEIGHT - 2*MARGIN - value/maxResult*(HEIGHT - 2*MARGIN) + MARGIN)
    const maxResult = Math.max(... CORRECT_COUNTS);
    const percentilePath = "M " + CORRECT_COUNTS
        .map((count, correct) => `${correctToX(correct)} ${countToY(count)}`)
        .join(" L ");

    return <svg xmlns="http://www.w3.org/2000/svg"
                width={WIDTH}
                height={HEIGHT}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                strokeLinecap="round"
                className="stroke-stone-500 fill-none stroke-2 mx-auto my-8 max-w-full">

        <defs>
            <filter id="glow" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <path d={percentilePath} filter="url(#glow)"/>
        <line x1={correctToX(correctCount)}
              y1={MARGIN}
              x2={correctToX(correctCount)}
              y2={HEIGHT - MARGIN}
              className="stroke-cyan-500"
              filter="url(#glow)"/>
    </svg>;
}

/**
 * Component to show the user their score and how they did on each photo.
 */
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

        <Chart correctCount={correctCount}/>

        <ImageGrid results={results.filter(result => result.guess === "none")}
                   oneResultHeader={() => "You haven't answered this one:"}
                   multipleResultsHeader={count => `You haven't answered these ${count}:`}
        />

        <ImageGrid results={results.filter(result => result.isCorrect && result.guess === "human")}
                   oneResultHeader={() => "You correctly identified this one as made by a human:"}
                   multipleResultsHeader={count => `You correctly identified these ${count} as made by a human:`}
        />

        <ImageGrid results={results.filter(result => result.isCorrect && result.guess === "ai")}
                   oneResultHeader={() => "You correctly identified this one as made by an AI:"}
                   multipleResultsHeader={count => `You correctly identified these ${count} as made by an AI:`}
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
            <Button action={() => scrollToSelector("#" + makeImageCardId(0))} emoji="👀">Review Your Guesses</Button>
        </Buttons>

        <div className="h-8"></div>
    </section>;
}

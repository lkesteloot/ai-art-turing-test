import { useState, useEffect } from "react";
import classNames from "classnames";
import Buttons from "./buttons";
import Button from "./button";
import {UserDb, withNoGuesses, withQuizMode} from "../services/userdb";
import {makeImageCardId} from "../services/imagedb.ts";
import CheckedButton from "./checked_button.tsx";
import {QuizMode} from "../services/types.ts";
import {scrollToSelector} from "../services/utils.ts";

/**
 * Panel that gives the user the chance to clear their guesses.
 */
function ClearData({
                       userDb,
                       setUserDb
                   }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    const anyGuesses = userDb.guesses.some(guess => guess !== "none");

    function resetAnswers() {
        setUserDb(withNoGuesses(userDb));
    }

    return <div className={classNames(
        anyGuesses ? "opacity-100" : "opacity-0",
        anyGuesses ? "scale-100" : "scale-90",
        "origin-center",
        "transition-all",
        "duration-400",
    )}>
        <p className="mt-8 mb-4">You seem to have taken this test before. If you’d like, you can reset
            all of your guesses:</p>

        <Buttons>
            <Button action={resetAnswers} emoji="🧹">Reset Guesses</Button>
        </Buttons>
    </div>;
}

/**
 * Full-screen panel to introduce the quiz to the user and choose the quiz mode.
 */
export default function Intro({
                                  userDb,
                                  setUserDb
                              }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    const [quizMode, setQuizMode] = useState<QuizMode>(userDb.quizMode);

    useEffect(() => {
        setUserDb(withQuizMode(userDb, quizMode));
    }, [quizMode]);

    return <section id="intro" className="min-h-screen snap-center max-w-prose p-4 pt-16 mx-auto">
        <h1 className="text-center text-5xl py-4 font-bold text-cyan-500 text-glow">AI Art Turing Test</h1>

        <p className="my-4">In this test you will be shown 50 works of art. About half
            were made by a human artist and half by an Artificial Intelligence (AI).
            For each piece of art, you'll be asked to guess if it was made by a human
            or an AI.</p>

        <p className="mt-8 mb-4">Each time you make a guess, you can either immediately be shown
            the answer, or auto-advance to the next answer and see the results at the end:</p>

        <Buttons>
            <CheckedButton action={() => setQuizMode("reveal")} checked={quizMode == "reveal"}>Show Answer</CheckedButton>
            <CheckedButton action={() => setQuizMode("advance")} checked={quizMode == "advance"}>Auto-Advance</CheckedButton>
        </Buttons>

        <p className="mt-8 mb-4">The images in this test
            were <a href="https://www.astralcodexten.com/p/ai-art-turing-test" className="underline text-stone-500"
                    target="_blank">collected by Scott Alexander</a>.
            All first-person statements in the answers are his.
            This website was put together
            by <a href="https://www.teamten.com/lawrence/" className="underline text-stone-500" target="_blank">Lawrence
                Kesteloot</a>.</p>

        <Buttons>
            <Button action={() => scrollToSelector("#" + makeImageCardId(0))} emoji="🚀">Start Test</Button>
        </Buttons>

        <ClearData userDb={userDb} setUserDb={setUserDb}/>
    </section>;
}

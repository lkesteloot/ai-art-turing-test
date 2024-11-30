import classNames from "classnames";
import Buttons from "./buttons";
import Button from "./button";
import {UserDb, withNoGuesses} from "../services/userdb";
import {makeImageCardId} from "../services/imagedb.ts";

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
        <p className="mt-12 mb-4">You seem to have taken this test before. If you’d like, you can reset
            all of your guesses:</p>

        <Buttons>
            <Button action={resetAnswers}>Reset Guesses</Button>
        </Buttons>
    </div>;
}

export default function Intro({
                                  userDb,
                                  setUserDb
                              }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    return <section id="intro" className="min-h-screen snap-center max-w-prose p-4 pt-16 mx-auto">
        <h1 className="text-center text-5xl py-4 font-bold">AI Art Turing Test</h1>

        <p className="my-4">In this test you will be shown 50 works of art. About half
        were made by a human artist and half by an Artificial Intelligence (AI).
        For each piece of art, you'll be asked to guess if it was made by a human
        or an AI.</p>

        <p className="my-4">The images in this test
            were <a href="https://www.astralcodexten.com/p/ai-art-turing-test" className="underline text-blue-600" target="_blank">collected by Scott Alexander</a>.
            All first-person statements in the answers are his.
            This website was put together
            by <a href="https://www.teamten.com/lawrence/" className="underline text-blue-600" target="_blank">Lawrence Kesteloot</a>.</p>

        <Buttons>
            <Button href={"#" + makeImageCardId(0)}>Start Test</Button>
        </Buttons>

        <ClearData userDb={userDb} setUserDb={setUserDb}/>
    </section>;
}

import Buttons from "./buttons";
import Button from "./button";
import {makeImageCardId} from "./imagecard";
import {UserDb, withNoGuesses} from "../services/userdb";

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

    if (anyGuesses) {
        return <>
            <p>You seem to have taken this test before. If you’d like, you can reset
            all of the answers.</p>

            <Buttons>
                <Button action={resetAnswers}>Reset Answers</Button>
            </Buttons>
        </>;
    } else {
        return <></>;
    }
}

export default function Intro({
                                  userDb,
                                  setUserDb
                              }: {
    userDb: UserDb,
    setUserDb: (userDb: UserDb) => void
}) {
    return <div id="intro" className="min-h-screen snap-center max-w-prose p-4 pt-16 mx-auto">
        <h1 className="text-5xl py-4">AI Art Turing Test</h1>

        <p className="my-4"><a href="https://www.astralcodexten.com/p/ai-art-turing-test" className="underline text-blue-700" target="_blank">Scott Alexander</a> gathered
        50 pieces of art, half human-made and half AI-made, and got 11,000 people to try to
        tell the difference. This site will ask you the same 50 questions, and also
        (optionally) shows you the answer after you guess.</p>

        <p className="my-4">This version of the test was put together
            by <a href="https://www.teamten.com/lawrence/" className="underline text-blue-700" target="_blank">Lawrence Kesteloot</a>.</p>

        <ClearData userDb={userDb} setUserDb={setUserDb}/>

        <Buttons>
            <Button href={"#" + makeImageCardId(0)}>Start Test</Button>
        </Buttons>
    </div>;
}

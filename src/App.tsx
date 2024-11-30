import { useEffect } from "react";
import imageDb from "./services/imagedb";
import ImageCard, {makeImageCardId} from "./components/imagecard";
import Intro from "./components/intro";
import Results from "./components/results";
import {useUserDb} from "./services/userdb";

export default function App() {
    const [userDb, setUserDb] = useUserDb();

    useEffect(() => {
        function clickListener(e: Event) {
            // Walk up the tree.
            let element: Element | null = e.target as Element;
            while (element !== null && element.nodeName !== "A") {
                element = element.parentElement;
            }
            if (element !== null) {
                const a = element as HTMLAnchorElement;
                if (a.href !== "") {
                    document.documentElement.classList.remove("snap-y");
                    setTimeout(() => {
                        document.documentElement.classList.add("snap-y");
                    }, 1000);
                }
            }
        }
        document.addEventListener("click", clickListener);
        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, []);

    return <div>
        <Intro userDb={userDb} setUserDb={setUserDb}/>
        {imageDb.images.map((_, id) => <ImageCard id={id} key={makeImageCardId(id)} userDb={userDb}
                                                  setUserDb={setUserDb}/>)}
        <Results userDb={userDb} setUserDb={setUserDb}/>
    </div>;
}

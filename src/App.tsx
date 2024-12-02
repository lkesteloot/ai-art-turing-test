import { useEffect } from "react";
import imageDb, {makeImageCardId} from "./services/imagedb";
import ImageCard from "./components/image_card.tsx";
import Intro from "./components/intro";
import Results from "./components/results";
import {useUserDb} from "./services/userdb";
import {temporarilyDisableSnap} from "./services/utils.ts";

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
                    temporarilyDisableSnap();
                }
            }
        }
        document.addEventListener("click", clickListener);
        return () => {
            document.removeEventListener("click", clickListener);
        };
    }, []);

    return <div className="bg-fixed bg-circle-gradient from-stone-900 from-0% via-stone-900 via-50% to-stone-950 to-100%">
        <Intro userDb={userDb} setUserDb={setUserDb}/>
        {imageDb.images.map((_, id) => <ImageCard id={id} key={makeImageCardId(id)} userDb={userDb}
                                                  setUserDb={setUserDb}/>)}
        <Results userDb={userDb} setUserDb={setUserDb}/>
    </div>;
}

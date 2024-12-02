import imageDb, {makeImageCardId} from "./services/imagedb";
import ImageCard from "./components/image_card.tsx";
import Intro from "./components/intro";
import Results from "./components/results";
import {useUserDb} from "./services/userdb";

export default function App() {
    const [userDb, setUserDb] = useUserDb();

    return <div className="bg-fixed bg-circle-gradient from-stone-900 from-0% via-stone-900 via-50% to-stone-950 to-100%">
        <Intro userDb={userDb} setUserDb={setUserDb}/>
        {imageDb.images.map((_, id) => <ImageCard id={id} key={makeImageCardId(id)} userDb={userDb}
                                                  setUserDb={setUserDb}/>)}
        <Results userDb={userDb} setUserDb={setUserDb}/>
    </div>;
}

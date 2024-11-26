import imageDb from "./services/imagedb";
import ImageCard, {makeImageCardId} from "./components/imagecard";
import Intro from "./components/intro";
import Results from "./components/results";
import {useUserDb} from "./services/userdb";

export default function Test() {
    const [userDb, setUserDb] = useUserDb();

    return <div>
        <Intro userDb={userDb} setUserDb={setUserDb}/>
        { imageDb.images.map((_, id) => <ImageCard id={id} key={makeImageCardId(id)} userDb={userDb} setUserDb={setUserDb}/>) }
        <Results userDb={userDb} setUserDb={setUserDb}/>
    </div>;
}

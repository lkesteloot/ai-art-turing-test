
import imageDb from "../data/imagedb.json";

export interface Image {
    url: string;
    title: string;
    human: boolean;
    attribution: string;
    attributionUrl?: string;
    note?: string;
}

export interface ImageDb {
    images: Image[];
}

export default imageDb as ImageDb;

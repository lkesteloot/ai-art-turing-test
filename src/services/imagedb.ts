
import imageDb from "../data/imagedb.json";

export interface Image {
    url: string;
    title: string;
    human: boolean;
    attribution: string;
    attributionUrl?: string;
    note?: string;
    extension: string;
}

export interface ImageDb {
    images: Image[];
}

export default imageDb as ImageDb;

export function getImageUrl(id: number, image: Image): string {
    return "/images/" + id + "." + image.extension;
    // return image.url;
}

export function makeImageCardId(id: number): string {
    return "image-" + id;
}

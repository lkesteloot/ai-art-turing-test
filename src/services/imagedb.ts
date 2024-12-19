
import imageDb from "../data/imagedb.json";

/**
 * Information about each image.
 */
export interface Image {
    url: string;
    title: string;
    human: boolean;
    attribution: string;
    attributionUrl?: string;
    note?: string;
    extension: string;
}

/**
 * Top level image DB structure.
 */
export interface ImageDb {
    images: Image[];
}

export default imageDb as ImageDb;

/**
 * Get the URL for the image itself.
 */
export function getImageUrl(id: number, image: Image): string {
    return "https://www.teamten.com/lawrence/ai-art-turing-test-images/" +
        id + "." + image.extension;
}

/**
 * Make an HTML ID for the image.
 */
export function makeImageCardId(id: number): string {
    return "image-" + id;
}

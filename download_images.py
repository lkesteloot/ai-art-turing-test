
# Download form images, because I sometimes get throttled when I access them
# directly.

import urllib.request
import json
import os

def main():
    with open("src/data/imagedb.json") as f:
        imagedb = json.load(f)

    for index, image in enumerate(imagedb["images"]):
        local_pathname = f"public/images/{index}.{image["extension"]}"

        if not os.path.exists(local_pathname):
            print(f"Downloading {image["title"]} ({index})")
            url = image["url"]
            blob = urllib.request.urlopen(url).read()

            with open(local_pathname, "wb") as f:
                f.write(blob)

main()

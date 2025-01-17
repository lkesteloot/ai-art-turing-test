
# Add width and height to our image database.

import json, subprocess, re

SIZE_PATTERN = r"(\d{3,})\s*[x×]\s*(\d{3,})"

def main():
    with open("src/data/imagedb.json") as f:
        imagedb = json.load(f)

    for index, image in enumerate(imagedb["images"]):
        local_pathname = f"public/images/{index}.{image["extension"]}"
        output = subprocess.run(["file", local_pathname], capture_output=True, text=True).stdout

        match = re.search(SIZE_PATTERN, output)
        if match:
            image["width"] = int(match.group(1))
            image["height"] = int(match.group(2))
            #print(index, image["width"], image["height"])
        else:
            print("Can't find size in output of \"file\":")
            print(output)

    with open("src/data/imagedb-out.json", "w") as f:
        json.dump(imagedb, f, indent=4, ensure_ascii=False)
        f.write("\n")

main()

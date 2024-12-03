
"""
Analyze the Excel file published by Scott Alexander, analyze the responses,
and generate source files used in the website for statistics.
"""

import os
import collections
import csv
import json

# Scott originally didn't count unanswered questions, but this isn't fair
# because people can increase their score by not answering questions
# they're unsure about. We score missing answers as wrong.
TREAT_MISSING_AS_WRONG = True

def main():
    script_dir = os.path.dirname(__file__)
    repo_dir = os.path.join(script_dir, "..")
    with open(os.path.join(repo_dir, "src/data/imagedb.json")) as f:
        imagedb = json.load(f)
    images = imagedb["images"]
    titles = [image["title"] for image in images]
    title_to_image = dict((image["title"], image) for image in images)
    image_count = len(titles)

    # Number of people who got this many correct:
    correct_counts = [0]*(len(titles) + 1)
    # Number of people who got this one correct:
    question_correct_counts = [0]*len(titles)
    header = None
    with open(os.path.join(script_dir, "responses.csv")) as f:
        for row_number, row in enumerate(csv.reader(f)):
            if row_number == 0:
                header = row
                title_to_columns = collections.defaultdict(lambda: [])
                for column_number, title in enumerate(header):
                    title_to_columns[title].append(column_number)
                for title in titles:
                    if len(title_to_columns[title]) != 2:
                        print("Title does not have two columns:", title)
            else:
                valid_column_count = sum(int(cell != "") for cell in row)
                if valid_column_count > 10:
                    #print("Valid column count:", valid_column_count)
                    correct_count = 0
                    count = 0
                    incorrect_titles = []
                    for title_index, title in enumerate(titles):
                        image = title_to_image[title]
                        guess_column, grade_column = title_to_columns[title]
                        guess = row[guess_column].lower()
                        if guess != "" or TREAT_MISSING_AS_WRONG:
                            his_grade = row[grade_column] == "1"
                            my_grade = guess != "" and (guess == "human") == image["human"]
                            if his_grade != my_grade and not TREAT_MISSING_AS_WRONG:
                                print("Inconsistent grading:", row_number, title,
                                      guess, row[grade_column], his_grade, my_grade, sep="/")
                            if my_grade:
                                correct_count += 1
                                question_correct_counts[title_index] += 1
                            else:
                                incorrect_titles.append(title)
                            count += 1
                    if count != 0:
                        my_score = correct_count / count
                        if not TREAT_MISSING_AS_WRONG:
                            his_score = float(row[-1])
                            if abs(my_score - his_score) > 0.001:
                                print("Inconsistent score:", row_number, my_score / count, row[-1])
                        if count == len(titles):
                            correct_counts[correct_count] += 1
                            if False:
                                if correct_count == 49:
                                    print("Only miss:", incorrect_titles)

    # For Plotter graphing.
    if False:
        # Chart number of people who got each score.
        print("Correct [domain]\tCount")
        for correct_count, user_count in enumerate(correct_counts):
            print(correct_count, user_count)

    # For Plotter graphing.
    if False:
        # Chart number of people who got each question right.
        print("Correct [domain]\tCount")
        for correct_count, user_count in enumerate(sorted(question_correct_counts, reverse=True)):
            print(correct_count, user_count)

    # Generate code used in site.
    with open(os.path.join(repo_dir, "src/data/responses.json"), "w") as f:
        responses = {
            "correct_counts": correct_counts,
            "question_correct_counts": question_correct_counts,
        }
        json.dump(responses, f, indent=4, sort_keys=True)

    if False:
        print("People who did the whole test:", sum(correct_counts))

main()

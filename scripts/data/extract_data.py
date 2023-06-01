"""Extract a list words from 'input.txt' to "output.json"."""
import logging
import os
import re
from json import dump
from typing import Iterator


class Extract:
    def __init__(
        self,
        path_input: str = "input.txt",
        path_output: str = "output.json",
        print_duplicates: bool = True,
    ) -> None:
        """
        Extract txt file containing vocabulary to a json file.

        Input txt file format: question - answer (extra information).

        Args:
            path_input (str, optional): path to a txt file, from which data is loaded. Defaults to "input.txt".
            path_output (str, optional): path to output json file, to which data is saved. Defaults to "output.json".
            print_duplicates (bool, optional): print duplicates to console. Defaults to True.
        """
        # use paths relative to the script, not user's pwd
        script_dir: str = os.path.realpath(os.path.dirname(__file__))
        logging.debug(f"Found script's directory: '{script_dir}'.")
        self.path_input: str = os.path.join(script_dir, path_input)
        self.path_output: str = os.path.join(script_dir, path_output)
        self.print_duplicates: bool = print_duplicates
        return None

    def _load_input_txt_file(self) -> Iterator[str]:
        """
        Yield a processed line from the input TXT file.

        Replace non-standard dashes with "-", ignore lines shorter than 4 characters.

        Yields:
            Iterator[str]: a single line from the text file as string.
        """
        with open(file=self.path_input, mode="r", encoding="utf-8") as f:
            for line in f:
                line: str = line.strip().replace("–", "-").replace("—", "-")
                if len(line) < 4:
                    logging.debug(
                        f"Fetching next line, because '{line}' is shorter than "
                        "4 characters."
                    )
                    continue
                logging.debug(f"Returning line '{line}'.")
                yield line

    @property
    def output_dict(self) -> dict[str, dict[str, str]]:
        """
        Return extracted dictionary from self.input_text.

        Structure: {question: answer, extra}

        Returns:
            dict: Extracted dictionary.
        """
        drop_statistics: dict[str, int] = dict()
        # "key": {"answer": answer, "extra": extra}}
        r: dict[str, dict[str, str]] = dict()
        for num, line in enumerate(self._load_input_txt_file(), start=1):
            if " - " not in line:
                logging.warning(
                    f"{num}. Dropping '{line}' because it doesn't contain a hyphen."
                )
                drop_statistics["no_hyphen"] = drop_statistics.get("no_hyphen", 0) + 1
                continue
            extra: str = str()
            # if contains extra info in parenthesis, cut it out of "i", and store it in "extra"
            if "(" in line:
                match_object = re.search(pattern=r"(.*)\s\((.*)\)", string=line)
                if match_object:
                    line: str = match_object.group(1)
                    extra: str = match_object.group(2).strip()
                else:
                    logging.warning(
                        f"{num}. Dropping '{line}' because failed to match extra using "
                        "Regex."
                    )
                    drop_statistics["regex_fail"] = (
                        drop_statistics.get("regex_fail", 0) + 1
                    )
                    continue
            k_and_v: list[str] = line.split(" - ")
            if len(k_and_v) != 2:
                logging.warning(
                    f"{num}. Dropping '{line}' because it didn't split into "
                    "exactly 2 items."
                )
                drop_statistics["not_two_items"] = (
                    drop_statistics.get("not_two_items", 0) + 1
                )
                continue
            # prepare json items
            key: str = k_and_v[0].strip()
            answer: str = k_and_v[1].strip()
            # check for duplicates
            if key in r.keys():
                if self.print_duplicates:
                    logging.warning(
                        f"{num}. Dropping '{line}' because it's a duplicate."
                    )
                drop_statistics["duplicate"] = drop_statistics.get("duplicate", 0) + 1
                continue
            # print(f"{num}. {key} = {answer} ({extra})")
            r.update({key: {"answer": answer, "extra": extra}})
            logging.debug(f"{num}. OK: appended entry: '{key}' - '{answer}' ({line})")
        logging.info(f"OK: extracted '{len(r)}' words; dropped: '{drop_statistics}'.")
        return r

    def save(self) -> bool:
        """
        Save extracted dictionary to JSON.

        If dictionary not extracted yet, extract, then save.

        Returns:
            bool: True if succeeded, False if failed.
        """
        try:
            # extract txt before opening additional file handle
            data: dict[str, dict[str, str]] = self.output_dict
            with open(file=self.path_output, mode="w", encoding="utf-8") as f:
                dump(data, f, indent=4, sort_keys=True, ensure_ascii=False)
            logging.info(f"OK: saved words to json, see: '{self.path_output}'.")
        except Exception as e:
            logging.exception(f"Failed to save json: {e}.")
            return False
        else:
            return True


def main() -> None:
    # setup logger
    logging.basicConfig(
        datefmt="%G-%m-%d %T",
        format="%(asctime)s [%(levelname)s] %(filename)s : %(funcName)s() (%(lineno)d) - %(message)s",
        level=logging.INFO,
    )
    app: Extract = Extract()
    status_code: bool = app.save()
    logging.info(
        "Everything worked as expected." if status_code else "Failed to process file."
    )
    return None


if __name__ == "__main__":
    main()

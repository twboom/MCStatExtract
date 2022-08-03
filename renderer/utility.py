from datetime import datetime
import json


# Generate and append time stamp to the page
def append_time(page) -> str:
    """
    Appends the current time to the page
    :param page: The page to append the time to
    :return: The page with the time appended
    """
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    timezone = datetime.now().astimezone().tzinfo
    content = f'Generated this file at {time} ({timezone})'
    comment = f'<!-- {content} -->'
    return page + comment


# Load a JSON file
def json_load(path: str) -> dict:
    """
    Loads a JSON file
    :param path: The path to the JSON file
    :return: The JSON data
    """
    with open(path, 'r') as f:
        data = json.load(f)
    return data

def page_list():
    """
    Return the list of pages to be rendered
    """
    print('Reading config file')
    with open('config/pages.config', 'r') as f:
        lines = f.read().splitlines()

        pages = [] # List of the pages to build

        # Parse the config file
        for line in lines:
            # Split the line into instructions
            instructions = line.split('->')
            source = instructions[0]
            target = instructions[1]

            # Check for title
            target = target.split('|')
            if len(target) == 3:
                title = target[1]
                title_header = target[2]
                target = target[0]
            elif len(target) == 2:
                title = target[1]
                title_header = target[1]
                target = target[0]
            else:
                title = target[0]
                title_header = target[0]
                target = target[0]

            # Check for template usage
            source = source.split(':')
            if len(source) == 2:
                template = source[1]
                source = source[0]
            else:
                template = None
                source = source[0]

            # Add the page to the list
            pages.append({'source': source, 'target': target, 'template': template, 'title': title, 'title_header': title_header})

    return pages
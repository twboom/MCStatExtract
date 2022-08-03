import renderer.minifier as minify
from renderer.utility import append_time
from renderer.dom import get_elements_by_tag_name, append_child, reconstruct_element


# Build the page
def build_page(page) -> None:
    """
    Builds a page
    :param page: An object containing the page's source, target, and template
    """

    print('Building page:', page['target'])

    source = page['source']
    target = page['target']
    template = page['template']
    title = page['title']
    title_header = page['title_header']

    # Read the source file
    with open(f'pages/{source}/{source}.html', 'r') as f:
        html = f.read()

    # Read the template file
    if template is not None:
        output = fill_template(template, html)
    else:
        output = html

    output = output.replace('{{title}}', title)
    output = output.replace('{{title_header}}', title_header)

    output = minify.html(output)

    export_page(output, target, source)


# Fill the template
def fill_template(template, source) -> str:
    with open(f'src/{template}', 'r') as f:
        template = f.read()
    filled_template = template.replace('{{content}}', source)
    return filled_template


# Export the page
def export_page(page, target, source) -> None:
    copy_scripts(page, source)
    page = append_time(page)
    page = include_css(page, source)
    with open(f'build/{target}', 'w') as f:
        f.write(page)


# Include the css directly
def include_css(html, source) -> str:
    css_files = []
    css_files_attrs = []
    files = get_elements_by_tag_name(html, 'link')
    for file in files:
        if file['rel'] == 'stylesheet':
            css_files_attrs.append(reconstruct_element('link', file))
            css = file["href"]
            if "template" in file:
                css = "src/" + css
            css_files.append(css)

    css_html = ''
    for original_file in css_files:
        file = f'pages/{source}/{original_file}'
        if (original_file.startswith("src/")):
            file = original_file
        with open(file, 'r') as f:
            css_html += f.read()
    css_html = minify.css(css_html)
    css_html = f'<style>{css_html}</style>'

    html = append_child(html, 'head', css_html)

    # Remove the old css links
    for file in css_files_attrs:
        if 'template="None"' in file:
            file = file.replace('template="None"', 'template')
        html = html.replace(file, '')

    return html


# Copy over JS files
def copy_scripts(html, source):
    scripts = []
    files = get_elements_by_tag_name(html, "script")
    for file in files:
        if file["src"]:
            scripts.append(file["src"])
    
    for file in scripts:
        with open(f"pages/{source}/{file}", "r") as f:
            js = f.read()
            with open(f"build/{file}", "w") as t:
                t.write(js)
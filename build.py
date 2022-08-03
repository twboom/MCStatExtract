import os
from distutils.dir_util import copy_tree
from shutil import rmtree

from renderer.page import build_page
from renderer.utility import page_list


if __name__ == "__main__":
    print("\n")
    print("Started build script for MCTools")

    # Checks
    print('\nDoing checks')

    if os.path.exists('build'):
        rmtree("build")
    os.mkdir('build')
    os.mkdir("build/js")
    print('Created build directory')
    
    print('Finished checks')

    print('\nStarting build process...')

    # Copying files
    copy_tree('src/assets', 'build/assets')
    print('Copied assets')

    # Getting pages
    print('Reading page config')
    pages = page_list()

    # Building pages
    print("Building pages")
    for page in pages:
        build_page(page)
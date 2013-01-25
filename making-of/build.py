#!/usr/bin/python

import os
import re
import json

def run_command(command):
    """ Runs an arbitrary command and returns the result as a striped string
    """
    return os.popen(command).read().rstrip()

def get_commit_metadata(commit):
    """ Given a commit hash generate pull out a bit of the metadata.
    """
    # Pull out the commit date in ms since epoch.
    date = int(run_command('git log "%s" --pretty="%%ct" -1' % commit)) * 1000

    # Pull out just the subject line.
    title = run_command('git log "%s" --pretty="%%s" -1' % commit).splitlines()[0]

    # Pull out the rest of the body and parse out list items into a nested array.
    lines = run_command('git log "%s" --pretty="%%b" -1' % commit).splitlines()
    parsedLines = []
    listLines = []
    for line in lines:
        line = line.strip()
        if not len(line):
            continue

        if line[0] == '*':
            listLines.append(re.sub('^\*\s*', '', line))
        elif len(listLines):
            parsedLines.append(listLines)
            listLines = []
        else:
            parsedLines.append(line)

    if len(listLines):
        parsedLines.append(listLines)

    data = {
        'hash': commit,
        'date': date,
        'title': title,
        'body': parsedLines,
    }

    return data

if __name__ == "__main__":
    # Remove previously archived commits.
    run_command('rm -rf making-of/commits/')

    # Create the directory where we'll store all the commit archives.
    run_command('mkdir making-of/commits')

    # Get the list of commit hashes.
    commits = run_command('git log --reverse --format="%h"').splitlines()

    commitData = []
    for commit in commits:
        print run_command('git log --oneline "%s" -1' % commit)

        # Generate an archive and untar it inside of the making of directory.
        run_command('git archive --format=tar --prefix="%s"/ "%s" |'
            '(cd making-of/commits/ && tar xf -)' % (commit, commit))

        # cd into the the archive and run the build script if one exists.
        run_command('(cd making-of/commits/"%s" && [ -e build.sh ] && '
            './build.sh)' % commit)

        # Store the meta data into a list to be dumped to a JS file after
        commitData.append(get_commit_metadata(commit))

    output = open('making-of/source/commits.js', 'w')

    output.write('var commits = ' + json.dumps(commitData, indent=4) + ';')
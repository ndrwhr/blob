#!/bin/bash
set -e

while getopts "w" flag; do
    case $flag in
        w) WATCH=1;;
    esac
done

function build {
    echo "Built JS at `date '+%H:%M:%S'`"
    cat lib/*.js source/*.js > app.js
}

compass clean
compass compile
build

if [ -n "$WATCH" ]; then
    compass watch &
    COMPASS_PID=$!

    function stop {
        echo "killing compass..."
        kill -9 $COMPASS_PID;
    }

    trap stop SIGINT

    echo "Watching for changes..."
    while true; do
        CHANGES="$(find ./source ./lib -name "*.js" -newer app.js)"

        if printf "$CHANGES" | grep -q .; then
            unset CHANGES
            build
        fi

        sleep 0.1
    done
fi
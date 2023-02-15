#!/bin/bash
set -e

if [ ! -d dist ]; then
    echo "No \"dist\" directory found! You have to build the project first/again."
    exit 1
fi

set -x # Show commands
rm -rfv .tmp # Remove old temp dir, in case anything wnet wrong
mv -v dist .tmp
git stash
git checkout dist

rm -rfv dist
mv -v .tmp dist
git add dist # This may fail, if nothing changed -> in that case just "git checkout -" to go back :)
git commit -m "Updated on `date`"

git checkout -
git stash pop
set +x

echo "Done. Don't forget to push the \"dist\" branch now!"
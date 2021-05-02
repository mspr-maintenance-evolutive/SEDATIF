#!/bin/bash

#TODO run unit test only if js file extension in added file
echo "Running Unit Test..."
yarn test

RESULT=$?
if [[ "$RESULT" == 0 ]]; then
    echo "Test ✔"
else
    echo "❌ Unit Tests Failed"
fi

exit $RESULT

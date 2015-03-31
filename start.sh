#!/bin/bash
webpack --watch &
cd src/api && node index.js &
cd public && python -m SimpleHTTPServer 8000

#!/bin/bash
webpack
cd src/api && node index.js &
cd public && python -m SimpleHTTPServer 8000

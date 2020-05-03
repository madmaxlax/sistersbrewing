#!/bin/bash
set -o verbose
git add ./*
git commit -m "$1"
git pull --rebase
git push -u origin master 
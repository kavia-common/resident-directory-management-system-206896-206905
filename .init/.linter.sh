#!/bin/bash
cd /home/kavia/workspace/code-generation/resident-directory-management-system-206896-206905/resident_directory_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


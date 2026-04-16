@echo off
echo Installing openai package...
npm install openai

echo.
echo Starting conversion. Ensure OPENAI_API_KEY is set!
echo Example: set OPENAI_API_KEY=sk-your-key-here
echo.
node convert-to-rn.js

pause


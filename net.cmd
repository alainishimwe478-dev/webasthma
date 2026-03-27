@echo off
if /I "%~1" == "use" (
  echo New connections will be remembered.
  echo.
  echo There are no entries in the list.
) else (
  echo net command stub.
  echo %*
)
exit /b 0

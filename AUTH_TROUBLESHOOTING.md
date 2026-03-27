# Authentication Troubleshooting

1. **Clear localStorage**: open DevTools (F12) -> Application -> Local Storage and clear `asthma_user` and `asthma_users` so stale sessions or user records cannot block login.
2. **Refresh and reattempt**: reload the page after clearing storage to ensure the new defaults are rehydrated.
3. **Check the console** for the `Login attempt: { trimmedEmail, foundUser, storedPassword }` log entry; if `foundUser` is undefined, the typed email does not match exactly, so trim spaces and lowercase it as needed.
4. **Use the seeded accounts** to confirm baseline access: `patient@example.com`/`patient123`, `doctor@example.com`/`doctor123`, `admin@example.com`/`admin123`.
5. **Inspect stored users** by temporarily adding `console.log(users)` right after the `useState` initializer in `src/components/Login.jsx`; this reveals exactly what is persisted inside `asthma_users`.

If the checks above still produce errors, copy the console logs for the login attempt and send them along so we can trace what the component is receiving.

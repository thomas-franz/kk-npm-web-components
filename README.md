# NPM publishing repo for kk-web-components

https://www.npmjs.com/package/kk-web-components

## How to publish a new version to NPM

---

## General rules:

1. **Published NPM versions have to correlate with the git tag in this repo**
2. **To be able to publish to NPM, you'll need to:**

-   have access to the kk NPM login (1Password)
-   be on the npm@krankikom.de mailing list

---

### Testing

1. in root dir, run `npm i`
2. in root dir, run `npm run dev` or `npm run build`
3. if node_modules appears in `/package` dir, delete it there, rerun `npm i` in root dir, proceed from step 2.

---

### Taking changes and tagging in this repo

1. checkout master, pull
2. take changes
3. in `package/package.json` update the tag, for example from `1.2.0` to `1.2.1`  
   **always increase the tag version depending on your changes, last digit should not reflect breaking changes**
4. add, commit and push changes
5. create a new tag, naming it `v` + your new version from `package/package.json`  
   `git tag -a v1.2.1 -m "Fix typo so that..."`
6. push tag to repo `git push origin v1.2.1`
   All done with the git part (hooraay)

---

Tip: Not every new tag needs to be published on NPM, sometimes it's just changes surrounding the `/package` that have no use to our NPM package.

---

### Publishing the nrew version to NPM

1. cd into the package folder `cd package`
2. login to npm `npm login` with creds from 1Password
3. within the login process, npm will send an auth code to npm@krankikom.de
4. once logged in, check again if the `package/package.json` version is correct
5. do a dry run `npm publish --dry-run`
6. now that you're sure, do the real thing: `npm publish`
7. you did it! https://www.npmjs.com/package/kk-web-components
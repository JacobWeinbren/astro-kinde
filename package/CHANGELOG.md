# astro-kinde

## 2.1.1

### Patch Changes

- Updated the `README.md` with useful clarifications for new users.

## 2.1.0

### Minor Changes

- Adds accessToken to locals storage for SDK management use.

## 2.0.0

### Major Changes

- 13780ee: Properly handles authentication for users using introspect. This uses the API call from oauth2/introspect. Also, the code to implement the management SDK is removed.

### Patch Changes

- 65c9b64: Refactors the project to mirror Florian's Integration Template. Makes the project a pnpm workspace. Also fixes some naming and exporting issues with the package.

# Kinde Astro Integration Instructions

## Installation

1. Install the package:

```bash
npm install kinde-astro
```

2. Add the integration to your `astro.config.mjs`:

```ts
import { defineConfig } from "astro/config";
import kinde from "kinde-astro";

export default defineConfig({
    integrations: [kinde()],
});
```

3. Setup your env.d.ts

```ts
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        isAuthenticated: boolean;
    }
}
```

## Configuration

Configure the integration by passing options to the `kinde` function in `astro.config.mjs`:

```js
import dotenv from "dotenv";

dotenv.config();

kinde({
    clientId: process.env.PUBLIC_KINDE_CLIENT_ID,
    clientSecret: process.env.PUBLIC_KINDE_CLIENT_SECRET,
    domain: process.env.PUBLIC_KINDE_DOMAIN,
    callbackUri: "http://localhost:4321/api/kinde/callback",
    signedInUri: "http://localhost:4321",
    signedOutUri: "http://localhost:4321",
});
```

You can set the uris based on your `NODE_ENV` to handle development and production environments.

## Usage

The integration automatically injects the following routes:

-   `/api/kinde/login`: Redirects to the Kinde login page
-   `/api/kinde/register`: Redirects to the Kinde registration page
-   `/api/kinde/callback`: Handles the OAuth callback
-   `/api/kinde/signout`: Handles user sign-out
-   `/api/kinde/isAuthenticated`: Checks if the user is authenticated
-   `/api/kinde/getUser`: Retrieves the authenticated user's profile

You can use these routes in your Astro pages to handle authentication.

Example usage in an Astro page:

```astro
---;
const isAuthenticated = Astro.local.isAuthenticated;
---

{isAuthenticated ? (
	<a href="/api/kinde/signout">Sign Out</a>
  ) : (
	<a href="/api/kinde/login">Login</a>
  )}
```

That's it! You now have Kinde authentication set up in your Astro project.

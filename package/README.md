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

## Configuration

Configure the integration by passing options to the `kinde` function in `astro.config.mjs`:

```js
kinde({
    clientId: import.meta.env.PUBLIC_YOUR_CLIENT_ID,
    domain: import.meta.env.PUBLIC_YOUR_KINDE_DOMAIAN,
    redirectUri: import.meta.env.DEV
        ? "http://localhost:3000/api/auth/callback"
        : "https://yourdomain.com/api/auth/callback",
    signoutUri: import.meta.env.DEV
        ? "http://localhost:3000"
        : "https://yourdomain.com",
    // Optional:
    // responseType: 'code',
    // scope: 'openid email profile offline',
});
```

Make sure to set the `redirectUri` and `signoutUri` based on your `NODE_ENV` to handle development and production environments.

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
---
const response = await fetch('/api/isAuthenticated');
const isAuthenticated = response.ok;
---

{isAuthenticated ? (
	<a href="/api/kinde/signout">Sign Out</a>
  ) : (
	<a href="/api/kinde/login">Login</a>
  )}
```

That's it! You now have Kinde authentication set up in your Astro project.

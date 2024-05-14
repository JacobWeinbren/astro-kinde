# Kinde Astro Integration

This Astro integration provides authentication functionality using Kinde.

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
    clientId: "YOUR_CLIENT_ID",
    domain: "YOUR_DOMAIN",
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

-   `/api/auth/login`: Redirects to the Kinde login page
-   `/api/auth/register`: Redirects to the Kinde registration page
-   `/api/auth/callback`: Handles the OAuth callback
-   `/api/auth/signout`: Handles user sign-out
-   `/api/auth/isAuthenticated`: Checks if the user is authenticated
-   `/api/auth/getUser`: Retrieves the authenticated user's profile

You can use these routes in your Astro pages to handle authentication.

Example usage in an Astro page:

```astro
---
const response = await fetch('/api/isAuthenticated');
const isAuthenticated = response.ok;
---

{isAuthenticated ? (
<button onclick="fetch('/api/signout', { method: 'POST' })">Sign Out</button>
) : (
<button onclick="fetch('/api/login', { method: 'POST' })">Login</button>
)}
```

That's it! You now have Kinde authentication set up in your Astro project.

# Astro Kinde Integration

![Bundle Size](https://img.shields.io/badge/bundle%20size-70KB-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This package provides an Astro integration for Kinde, an authentication and user management platform. It simplifies the process of adding authentication to your Astro application using Kinde's OAuth 2.0 flow.

## Installation

1. Install the package:

```bash
npm install astro-kinde
```

2. Add the integration to your `astro.config.mjs`:

```ts
import { defineConfig } from "astro/config";
import kinde from "astro-kinde";

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

| Option       | Description                                  | Example Value                              |
| ------------ | -------------------------------------------- | ------------------------------------------ |
| clientId     | The client ID for your Kinde application     | process.env.PUBLIC_KINDE_CLIENT_ID         |
| clientSecret | The client secret for your Kinde application | process.env.PUBLIC_KINDE_CLIENT_SECRET     |
| domain       | The domain for your Kinde application        | process.env.PUBLIC_KINDE_DOMAIN            |
| callbackUri  | The URI to redirect to after authentication  | "http://localhost:4321/api/kinde/callback" |
| signedInUri  | The URI to redirect to after signing in      | "http://localhost:4321"                    |
| signedOutUri | The URI to redirect to after signing out     | "http://localhost:4321"                    |

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

Authenticating Astro Pages is simple:

```astro
---
const isAuthenticated = Astro.locals.isAuthenticated;
---

{isAuthenticated ? (
	<a href="/api/kinde/signout">Sign Out</a>
) : (
	<a href="/api/kinde/login">Login</a>
  <a href="/api/kinde/register">Register</a>
)}
```

Retrieving a user profile:

```astro
---
  import { getUserData } from 'astro-kinde';
  let userData = await getUserData(Astro);
---
```

That's it! You now have Kinde authentication set up in your Astro project.

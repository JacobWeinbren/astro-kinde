# Astro Kinde Integration

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This package provides an Astro integration for [Kinde](https://kinde.com/), simplifying the process of adding authentication to your Astro application using Kinde's OAuth 2.0 flow.

## Features

-   Easy setup and configuration
-   Automatically injects authentication routes
-   Provides authentication state in Astro pages
-   Integrates with Kinde Management SDK for user and application management

## Installation

1. Create a [Kinde back-end web account](https://kinde.com/) and set the following environment variables:

```bash
KINDE_MANAGEMENT_CLIENT_ID=your_management_client_id
KINDE_MANAGEMENT_CLIENT_SECRET=your_management_client_secret
KINDE_DOMAIN=your_kinde_domain
```

2. Install the package and its dependencies:

```bash
npm install astro-kinde dotenv
```

Note: The `dotenv` module is required for loading environment variables.

3. Add the integration to your `astro.config.mjs`:

```ts
import { defineConfig } from "astro/config";
import kinde from "astro-kinde";

export default defineConfig({
    integrations: [kinde()],
});
```

4. Setup your `env.d.ts`:

```ts
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        isAuthenticated: boolean;
        accessToken: string | undefined;
    }
}
```

## Configuration

Configure the integration by passing options to the `kinde` function in `astro.config.mjs`.

```ts
import { defineConfig } from "astro/config";
import kinde from "astro-kinde";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    output: "server", // Necessary for Astro headers
    integrations: [
        kinde({
            clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID,
            clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET,
            domain: process.env.KINDE_DOMAIN,
            callbackUri: "http://localhost:4321/api/kinde/callback",
            signedInUri: "http://localhost:4321",
            signedOutUri: "http://localhost:4321",
            sessionMaxAge: 3600,
        }),
    ],
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

### Checking Authentication Status

You can check the authentication status in two ways:

1. Using `Astro.locals`:

```astro
---
const isAuthenticated = Astro.locals.isAuthenticated;
---
```

2. Using the `isAuthenticated` route:

```astro
---
const isAuthenticated = await fetch('/api/kinde/isAuthenticated').then(res => res.json());
---
```

### Redirecting Authenticated Users

```astro
---
if (isAuthenticated) {
return Astro.redirect('/example');
}
---
```

### Conditional Rendering Based on Authentication

```astro
{isAuthenticated ? (
    <a href="/api/kinde/signout">Sign Out</a>
) : (
    <a href="/api/kinde/login">Login</a>
)}
```

### Registration with Pre-filled Email
```astro
<a href="/api/kinde/register?login_hint=user@example.com">Register</a>
```

You can pass through query parameters to the login/register routes to control the behaviour of the Kinde flow. See what they are on the [Kinde site](https://docs.kinde.com/developer-tools/about/using-kinde-without-an-sdk/). For example:

## Management SDK

Kinde provides a Management SDK that you can use to manage your users and applications.
To use the Management SDK:

1. If using separately - remember to store the env variables from the previous steps.

2. Install the SDK:

```bash
npm install @kinde-oss/kinde-management-api-js
```

3. Initialise the SDK in `astro.config.mts`:

```ts
import { init } from "@kinde/management-api-js";

// Run the Kinde initialisation
init();
```

4. Use the SDK in your Astro pages:

```astro
---
import { Oauth, OpenAPI } from "@kinde/management-api-js";

const isAuthenticated = Astro.locals.isAuthenticated;
const accessToken = Astro.locals.accessToken;

if (isAuthenticated) {
  OpenAPI.TOKEN = accessToken;
  const userProfile = await Oauth.getUserProfileV2();
  console.log(userProfile);
}
---
```

That's it! You now have Kinde authentication set up in your Astro project and can use the Management SDK to manage your users and applications.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

By contributing to Astro-Kinde, you agree that your contributions will be licensed under its MIT License.

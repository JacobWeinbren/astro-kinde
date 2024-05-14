# kinde-astro

An Astro Integration for Kinde Authentication

## Setup

First, install the `kinde-astro` module:

```
bash
npm install kinde-astro
```

Create a configuration file `src/config.ts`:

```typescript
import { AuthConfig } from "kinde-astro";
const config: AuthConfig = {
    clientId: "your-client-id",
    redirectUri:
        process.env.NODE_ENV === "production"
            ? "https://yourdomain.com/callback"
            : "http://localhost:3000/callback",
    responseType: "code",
    scope: "openid profile email",
    domain:
        process.env.NODE_ENV === "production"
            ? "https://yourdomain.com"
            : "http://localhost:3000",
};
```

## Usage

### 1. Login

Create a login page `src/pages/login.astro`:

```astro
---
import { createAuthUrl } from 'kinde-astro';
import config from '../config/auth';
const loginUrl = createAuthUrl(config);
Astro.redirect(loginUrl);
---
```

### 2. Register

Create a register page `src/pages/register.astro`:

```astro
---
import { createAuthUrl } from 'kinde-astro';
import config from '../config/auth';
const registerUrl = ${config.domain}/register?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=${config.responseType}&scope=${config.scope};
Astro.redirect(registerUrl);
---
```

### 3. Handle Callback

Create a callback handler `src/pages/callback.astro`:

```astro
---
import { handleCallback } from 'kinde-astro';
import config from '../config/auth';
const { tokens, user } = await handleCallback(Astro.request, config);
Astro.cookies.set('auth_tokens', JSON.stringify(tokens));
Astro.cookies.set('user', JSON.stringify(user));
Astro.redirect('/');
---
```


### 4. Check Profile

Create a profile page `src/pages/profile.astro`:



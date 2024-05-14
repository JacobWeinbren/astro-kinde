export interface Config {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
    state?: string;
    domain: string;
    clientSecret?: string;
    [key: string]: any;
}

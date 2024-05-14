export interface Config {
    clientId: string;
    callbackUri: string;
    signedInUri: string;
    signedOutUri: string;
    responseType: string;
    scope: string;
    state?: string;
    domain: string;
    clientSecret?: string;
    [key: string]: any;
}

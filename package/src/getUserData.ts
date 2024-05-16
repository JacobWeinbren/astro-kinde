import { kindeApiRequest } from "./calls.ts";

export async function getUserData() {
    return kindeApiRequest("/kinde/getUser");
}

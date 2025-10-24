import { createAuthClient } from 'better-auth/react'
import { createAuthClient as createAuthClientClient } from "better-auth/client";
const authClient = createAuthClientClient();
const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
export const { signIn, signUp, signOut, useSession,changePassword } = createAuthClient();
export { signInGoogle };
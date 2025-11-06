import { signIn, signOut, useSession as useNextAuthSession, getSession as nextGetSession } from "next-auth/react";

// Provide a proper hook (name starts with `use`) so React hooks rules are satisfied.
export function useSession() {
	const s = useNextAuthSession();
	return { data: s?.data ?? null, isPending: s?.status === "loading" };
}

export const authClient = {
	useSession,
	signIn: {
		social: ({ provider, callbackURL, disableRedirect }: { provider: string; callbackURL?: string; disableRedirect?: boolean }) =>
			signIn(provider, { callbackUrl: callbackURL, redirect: disableRedirect ? false : undefined }),
	},
	signOut: (opts?: any) => signOut(opts),
	// Return shape compatible with previous authClient.getSession() usage: { data: session }
	getSession: async () => {
		const s = await nextGetSession();
		return { data: s ?? null };
	},
};

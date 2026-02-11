// Server client runs on server side, so we need to pass cookies between server and client
// Why cookies? well it's because HTTP is stateless, so we need to store session data in cookies!
// this is so we don't send session data (passwords, etc.) with every request!
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            // This object tells Supabase how to read/write cookies in server environment
            // Browser uses `document.cookie` to read/write cookies, so we need to mimic that here!
            // This is a workaround to get the user's session data in server components!
            cookies: {
                getAll() {
                    // Supabase asks: "What cookies do you have?"
                    // We answer: "Here are all the cookies from the request!"
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // Supabase asks: "Set these cookies!"
                    // We answer: "We do: Write them using Next.js cookies API!"
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

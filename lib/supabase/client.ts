// Client client runs on client side, so we can use it in client components
// Why not use the server client? well it's because the server client can't access cookies
// and we need to access cookies to get the user's session data!
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
}

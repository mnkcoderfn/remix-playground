import { redirect } from '@remix-run/node';
import { verifyJWT } from './jwt.server';
import { authCookie } from './auth.server';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function requireAuth(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    const token = await authCookie.parse(cookieHeader);

    const payload = token && await verifyJWT(token);
    if (!payload) {
        throw redirect("/sign-in");
    }

    return payload;
}

export async function protectedLoader({ request }: LoaderFunctionArgs) {
    const user = await requireAuth(request);
    return { user };
} 
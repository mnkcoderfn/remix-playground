import React from 'react';
import { redirect, useLoaderData } from '@remix-run/react';
import { verifyJWT } from '~/auth/jwt.server';
import { authCookie } from '~/auth/auth.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useUser } from "~/auth/userContext";

export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const token = await authCookie.parse(cookieHeader);

    const payload = token && await verifyJWT(token);
    if (!payload) {
        return redirect("/sign-in");
    }

    return { user: payload };
}

const Dashboard: React.FC = () => {
    const { user } = useUser();
    console.log(user);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Dashboard Page
                    </h2>

                    <p>Welcome {user?.email}</p>
                </div>
            </div>
        </>
    )
};

export default Dashboard;
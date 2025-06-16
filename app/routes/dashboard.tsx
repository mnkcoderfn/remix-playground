import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { protectedLoader } from '~/auth/protected-route.server';

export { protectedLoader as loader };

const Dashboard: React.FC = () => {
    const { user } = useLoaderData<typeof protectedLoader>();
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
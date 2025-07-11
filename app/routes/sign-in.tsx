import React, { useState } from 'react';
import Button from '../components/Button';
import { Form, json, Link, redirect, useActionData } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { authCookie } from '~/auth/auth.server';
import { createJWT } from '~/auth/jwt.server';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createLoaderContext, getUserService, getValidateUtility } from '~/context/loader';

export async function loader({ context }: LoaderFunctionArgs) {
  const loaderContext = createLoaderContext();
  const userService = getUserService(loaderContext);
  
  // You can perform any initialization or validation here
  // For example, check if user is already authenticated
  
  return json({ 
    message: "Sign in page loaded",
    userServiceEmail: userService.getEmail(),
    isEmailValid: userService.isEmailValid()
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const loaderContext = createLoaderContext();
  const userService = getUserService(loaderContext);
  const validateUtility = getValidateUtility(loaderContext);

  // Use injected services for validation
  if (!validateUtility.isValidEmail(email)) {
    return json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    // Use user service for authentication
    const user = await userService.authenticateUser(email, password);
    
    if (!user) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createJWT({ email: user.email });

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await authCookie.serialize(token)
      }
    });
  } catch (error) {
    return json({ error: "Authentication failed" }, { status: 500 });
  }
}

const SignIn: React.FC = () => {

  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement sign-in logic here
    console.log('Sign in attempt with:', { email, password });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {/* Social Sign-in Options */}
            <div className="grid grid-cols-3 gap-4">
              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white p-5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white p-5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <FontAwesomeIcon icon={faFacebook} className="h-7 w-7 text-blue-500" />
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white p-5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <FontAwesomeIcon icon={faXTwitter} className="h-7 w-7" />
              </a>
            </div>

            <div className="relative mt-10">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">OR</span>
              </div>
            </div>

            <Form method="post" className="mt-6 space-y-6">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
              {actionData?.error && <p>{actionData.error}</p>}
            </Form>

            {/* <form action="#" method="POST" className="mt-6 space-y-6">
              <div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <Button
                  type="primary"
                  size="medium"
                  fullWidth={true}
                  color="black"
                >
                  Sign in
                </Button>
              </div>
            </form> */}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
};

export default SignIn;
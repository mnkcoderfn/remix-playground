import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authCookie } from "~/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", { maxAge: 0 })
    }
  });
}

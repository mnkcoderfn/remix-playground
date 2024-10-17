import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import LandingPage from "../components/LandingPage";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <LandingPage />
    </>
  );
}

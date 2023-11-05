import Page from "@/components/page";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";

const Auth = () => {
  const { status } = useSession();

  return (
    <Page
      title={status === "authenticated" ? "SignOut" : "SignIn"}
      className="h-screen w-full flex justify-center"
    >
      {status === "authenticated" ? (
        <button
          className="my-auto font-medium bg-white rounded-md max-h-12 px-12 py-2 flex justify-center mx-auto"
          onClick={() => signOut()}
        >
          <ArrowLeftOnRectangleIcon className="mr-3 -ml-1 my-auto w-4 h-4 text-theme-action" />
          <span className="my-auto text-theme-action-dark">Sign out</span>
        </button>
      ) : (
        <div className="my-auto text-center">
          <p className="text-theme-action-light mb-2">
            Only WhiteListed users are able to log in.
          </p>
          <button
            className="font-medium bg-white rounded-md max-h-12 px-12 py-2 flex justify-center mx-auto"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg
              className="mr-3 -ml-1 my-auto w-4 h-4 text-theme-action"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            <span className="my-auto text-theme-action-dark">
              Sign in with Google
            </span>
          </button>
        </div>
      )}
    </Page>
  );
};

export default Auth;

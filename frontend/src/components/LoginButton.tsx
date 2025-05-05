import { signIn } from "next-auth/react";

const AUTH_PROVIDER = "keycloak";
const LOGIN_BUTTON_LABEL = "Login";

export default function LoginButton() {
  const handleLogin = () => {
    signIn(AUTH_PROVIDER, { callbackUrl: "/dashboard" });
  };
  return (
    <button
      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleLogin}
      type="button"
    >
      {LOGIN_BUTTON_LABEL}
    </button>
  );
}

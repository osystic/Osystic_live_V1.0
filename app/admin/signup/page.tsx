import { notFound } from "next/navigation";
import AdminSignupForm from "./SignupForm";

export const metadata = {
  title: "Request Admin Access",
  robots: { index: false, follow: false },
};

export default function AdminSignupPage() {
  if (process.env.ADMIN_SIGNUP_ENABLED !== "true") notFound();
  return <AdminSignupForm />;
}

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return(
  <div className="flex items-center justify-center pt-28 pb-28">
    <SignIn afterSignOutUrl={"/"}/>
  </div>
  );
}

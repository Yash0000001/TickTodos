import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center pt-28 pb-28">
      <SignUp afterSignOutUrl={"/"}/>
    </div>
  );
}

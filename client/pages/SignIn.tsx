import AppLayout from "@/components/layout/AppLayout";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/store/api";
import { useDispatch } from "react-redux";
import { setTokens } from "@/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Form = { username: string; password: string };

export default function SignInPage() {
  const { register, handleSubmit } = useForm<Form>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: Form) => {
    try {
      const res = await login(values).unwrap();
      if (res?.access && res?.refresh) {
        dispatch(setTokens({ access: res.access, refresh: res.refresh }));
      }
      navigate("/");
    } catch (e) {
      // TODO: show error toast
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-3">
          <input {...register("username", { required: true })} placeholder="Username or Email" className="rounded-md border p-3" />
          <input type="password" {...register("password", { required: true })} placeholder="Password" className="rounded-md border p-3" />
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={isLoading}>Sign in</Button>
            <Link to="/register" className="text-sm text-muted-foreground underline">Create account</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

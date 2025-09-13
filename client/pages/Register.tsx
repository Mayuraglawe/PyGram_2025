import AppLayout from "@/components/layout/AppLayout";
import { useForm } from "react-hook-form";
import { useRegisterMutation, useLoginMutation } from "@/store/api";
import { useDispatch } from "react-redux";
import { setTokens } from "@/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Form = { username: string; email?: string; password: string; confirm: string; role: string };

export default function RegisterPage() {
  const { register, handleSubmit, watch } = useForm<Form>({ defaultValues: { role: "Coordinator" } });
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: Form) => {
    if (values.password !== values.confirm) return alert("Passwords do not match");
    try {
      const res = await registerUser({ username: values.username, email: values.email, password: values.password, role: values.role }).unwrap();
      // If backend returns tokens directly, use them. Otherwise, attempt login.
      if (res?.access && res?.refresh) {
        dispatch(setTokens({ access: res.access, refresh: res.refresh }));
        navigate("/");
        return;
      }
      const loginRes = await login({ username: values.username, password: values.password }).unwrap();
      if (loginRes?.access && loginRes?.refresh) dispatch(setTokens({ access: loginRes.access, refresh: loginRes.refresh }));
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-3">
          <input {...register("username", { required: true })} placeholder="Username" className="rounded-md border p-3" />
          <input {...register("email")} placeholder="Email (optional)" className="rounded-md border p-3" />
          <input type="password" {...register("password", { required: true })} placeholder="Password" className="rounded-md border p-3" />
          <input type="password" {...register("confirm", { required: true })} placeholder="Confirm password" className="rounded-md border p-3" />
          <select {...register("role")} className="rounded-md border p-3">
            <option>Admin</option>
            <option>HoD</option>
            <option>Coordinator</option>
          </select>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={isLoading}>Create account</Button>
            <Link to="/signin" className="text-sm text-muted-foreground underline">Sign in</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

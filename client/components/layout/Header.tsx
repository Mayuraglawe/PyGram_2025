import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/use-theme";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/features/auth/authSlice";
import SignInModal from "@/components/auth/SignInModal";

function LogoImage() {
  const [ok, setOk] = useState(true);
  const src = "https://cdn.builder.io/api/v1/image/assets%2F2eee8cdc1a0849ce9573cd1f6b8b1470%2F532b6195227a44ac868676fe6e2f1685?format=webp&width=800";
  if (ok) {
    return (
      <img
        src={src}
        alt="Py-Gram logo"
        className="h-8 w-8 rounded-md object-cover"
        onError={() => setOk(false)}
      />
    );
  }
  return <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-secondary" />;
}

function SignInAction() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Sign in</Button>
      <SignInModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-secondary text-secondary-foreground" : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
    }`;

  const { theme, toggle } = useTheme();
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* Logo: attempt to load branded image, fallback to gradient mark */}
          {/** Image added from user attachment */}
          <LogoImage />
          <span className="text-lg font-extrabold tracking-tight">Py-Gram 2025</span>
        </Link>

        {/* Local inline logo component to handle load error fallback */}

        {/* Note: LogoImage defined below to avoid additional imports in top-level scope */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/faculty" className={navLinkClass}>Faculty</NavLink>
          <NavLink to="/subjects" className={navLinkClass}>Subjects</NavLink>
          <NavLink to="/classrooms" className={navLinkClass}>Classrooms</NavLink>
          <NavLink to="/batches" className={navLinkClass}>Batches</NavLink>
          <NavLink to="/timetables" className={navLinkClass}>Timetables</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            className="rounded-md p-2 hover:bg-accent/40"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 116.707 2.707 7 7 0 0017.293 13.293z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.22 4.22a1 1 0 011.415 0L6.64 5.22a1 1 0 11-1.415 1.415L4.22 5.636a1 1 0 010-1.415zM13.36 13.36a1 1 0 011.415 0l1.004 1.004a1 1 0 11-1.415 1.415l-1.004-1.004a1 1 0 010-1.415zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.22 15.778a1 1 0 010-1.415L5.22 13.36a1 1 0 111.415 1.415L5.636 15.778a1 1 0 01-1.415 0zM13.36 6.64a1 1 0 010-1.415l1.004-1.004A1 1 0 1115.78 5.636L14.776 6.64a1 1 0 01-1.415 0zM10 6a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          <Button variant="outline" asChild>
            <Link to="/generate">Generate</Link>
          </Button>

          {auth.access ? (
            <div className="flex items-center gap-2">
              <div className="text-sm">Signed in</div>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <SignInAction />
          )}
        </div>
      </div>
    </header>
  );
}

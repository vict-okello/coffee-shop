import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const BRAND = "#7C573C";
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token
      if (remember) localStorage.setItem("admin_token", data.token);
      else sessionStorage.setItem("admin_token", data.token);

      nav("/admin");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-[#f5e6d3] " +
    "placeholder:text-[#e6d3bd]/50 outline-none focus:border-white/25";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0f0f] to-[#120a0a] text-[#f5e6d3] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5"
            style={{ boxShadow: "0 18px 60px rgba(0,0,0,0.35)" }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="mt-4 text-4xl font-semibold font-[cursive]">
            Elza
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-6">
            {err && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-100 text-sm">
                {err}
              </div>
            )}

            <form onSubmit={login} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs text-[#e6d3bd]/70 mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#e6d3bd]/60" />
                  <input
                    className={inputBase + " pl-11"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@coffee.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-[#e6d3bd]/70 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#e6d3bd]/60" />
                  <input
                    className={inputBase + " pl-11 pr-12"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                    aria-label="Toggle password"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4 text-[#e6d3bd]/70" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#e6d3bd]/70" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#e6d3bd]/75 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#7C573C]"
                  />
                  Remember me
                </label>
                <span className="text-xs text-[#e6d3bd]/50">
                  Token expires in ~2h
                </span>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

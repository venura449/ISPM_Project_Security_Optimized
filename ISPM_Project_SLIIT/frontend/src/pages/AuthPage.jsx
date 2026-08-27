import { useState, useEffect } from "react";
import LoginComponent from "../components/LoginForm";

export const AuthPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .auth-page * { font-family: 'Inter', system-ui, sans-serif; }

        .auth-page {
          background: linear-gradient(135deg, #eff6ff 0%, #f8faff 50%, #eef2ff 100%);
          min-height: 100vh;
        }

        .auth-card {
          box-shadow:
            0 4px 6px rgba(37,99,235,0.04),
            0 20px 60px rgba(37,99,235,0.10),
            0 1px 3px rgba(0,0,0,0.06);
        }

        .brand-panel {
          background: linear-gradient(160deg, #1e40af 0%, #2563eb 45%, #3b82f6 100%);
          position: relative;
          overflow: hidden;
        }

        .brand-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 110% -10%, rgba(255,255,255,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at -10% 110%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .brand-dot {
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          position: absolute;
        }

        .form-panel {
          background: #ffffff;
        }

        .fade-up {
          animation: fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={`auth-page flex items-center justify-center p-4 md:p-8 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className="auth-card fade-up w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
          style={{ animationDelay: "0.1s", minHeight: "580px" }}
        >
          {/* BRAND PANEL */}
          <div className="brand-panel w-full md:w-[42%] p-8 lg:p-10 flex flex-col justify-between text-white">
            <div className="brand-dot w-64 h-64 top-[-80px] right-[-60px]" />
            <div className="brand-dot w-40 h-40 bottom-[-40px] left-[-30px]" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5z"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" />
                  <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                iris<span className="text-blue-200">HR</span>
              </span>
            </div>

            <div className="relative z-10 my-8">
              <h1 className="text-3xl font-extrabold">Manage your team</h1>
              <p className="mt-3 text-sm text-blue-100/75">
                Attendance, leave, training, and employee records in one place.
              </p>
            </div>
          </div>

          {/* LOGIN PANEL */}
          <div className="form-panel flex-1 flex flex-col">
            <div className="flex-1 p-8 lg:p-10">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome back
                </h2>
                <p className="text-gray-500 text-sm mt-1.5">
                  Sign in to continue
                </p>
              </div>

              <LoginComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;

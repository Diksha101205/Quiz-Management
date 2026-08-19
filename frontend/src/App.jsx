import { BarChart3, BookOpen, CheckCircle2, Clock, Edit3, LogOut, Moon, Play, Search, Shield, Sun, Trash2, Trophy, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";
import { demoLeaderboard, demoQuizzes } from "./data/demo";

const emptyAuth = { name: "", email: "", password: "" };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("quiz-token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("quiz-user") || "null"));
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [view, setView] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionLoading, setSessionLoading] = useState(Boolean(token));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!token) {
      setSessionLoading(false);
      return;
    }

    api("/auth/me", { token })
      .then((payload) => {
        setUser(payload.user);
        localStorage.setItem("quiz-user", JSON.stringify(payload.user));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("quiz-token");
        localStorage.removeItem("quiz-user");
      })
      .finally(() => setSessionLoading(false));
  }, [token]);

  const saveSession = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("quiz-token", payload.token);
    localStorage.setItem("quiz-user", JSON.stringify(payload.user));
    setView("dashboard");
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/register";
      const body = authMode === "login" ? { email: authForm.email, password: authForm.password } : authForm;
      saveSession(await api(path, { method: "POST", body }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const logout = async () => {
    if (token) api("/auth/logout", { method: "POST", token }).catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem("quiz-token");
    localStorage.removeItem("quiz-user");
  };

  if (sessionLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 text-ink dark:bg-slate-950 dark:text-slate-50">
        <div className="panel p-6 text-center">
          <p className="font-black">Checking your session</p>
          <p className="mt-2 text-sm text-slate-500">One moment.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-100 text-ink dark:bg-slate-950 dark:text-slate-50">
        <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-mint shadow-sm dark:bg-slate-900">
              <Shield size={18} /> Quiz Management
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              Online assessments for admins and students.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              Create quizzes, run timed attempts, score submissions automatically, and track performance from role-based dashboards.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["JWT auth", "Timers", "Analytics"].map((item) => (
                <div key={item} className="panel p-4 text-center text-sm font-bold">{item}</div>
              ))}
            </div>
          </div>

          <form onSubmit={submitAuth} className="panel p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">{authMode === "login" ? "Sign in" : "Create account"}</h2>
              <button type="button" className="btn btn-ghost" onClick={() => setDark(!dark)} title="Toggle theme">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {authMode === "register" && (
              <input className="field mb-3" placeholder="Full name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
            )}
            <input className="field mb-3" placeholder="Email" type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input className="field mb-3" placeholder="Password" type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            {message && <p className="mb-3 rounded-md bg-coral/10 p-3 text-sm font-semibold text-coral">{message}</p>}
            <button className="btn btn-primary w-full" type="submit">{authMode === "login" ? "Login" : "Register"}</button>
            <button type="button" className="mt-4 w-full text-sm font-bold text-mint" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
              {authMode === "login" ? "Need an account?" : "Already registered?"}
            </button>
            <p className="mt-5 rounded-md bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Demo after seeding: admin@quiz.local / Admin@12345 or student@quiz.local / Student@12345
            </p>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-ink dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-mint text-white"><BookOpen size={20} /></div>
            <div>
              <p className="font-black">Quiz Platform</p>
              <p className="text-xs font-semibold text-slate-500">{user.role === "ADMIN" ? "Admin panel" : "Student dashboard"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost" title="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="btn btn-ghost" onClick={logout}><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="panel h-fit p-2">
          {[
            ["dashboard", "Dashboard", BarChart3],
            ["quizzes", "Quizzes", BookOpen],
            [user.role === "ADMIN" ? "users" : "history", user.role === "ADMIN" ? "Users" : "History", Users],
            ["leaderboard", "Leaderboard", Trophy]
          ].map(([id, label, Icon]) => (
            <button key={id} className={`btn mb-1 w-full justify-start ${view === id ? "btn-primary" : "btn-ghost"}`} onClick={() => setView(id)}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <section>
          {view === "dashboard" && <Dashboard user={user} token={token} setView={setView} />}
          {view === "quizzes" && (user.role === "ADMIN" ? <AdminQuizzes token={token} /> : <StudentQuizzes token={token} />)}
          {view === "users" && <AdminUsers token={token} />}
          {view === "history" && <History token={token} />}
          {view === "leaderboard" && <Leaderboard />}
        </section>
      </div>
    </main>
  );
}

function Dashboard({ user, token, setView }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user.role === "ADMIN") api("/admin/analytics", { token }).then(setAnalytics).catch(() => {});
  }, [token, user.role]);

  const stats = user.role === "ADMIN"
    ? [
        ["Students", analytics?.totals.users ?? 0],
        ["Quizzes", analytics?.totals.quizzes ?? 0],
        ["Attempts", analytics?.totals.attempts ?? 0],
        ["Categories", analytics?.totals.categories ?? 0]
      ]
    : [["Available quizzes", "Live"], ["Attempts", "Track"], ["Scores", "Review"], ["Rank", "Compare"]];

  return (
    <div className="space-y-5">
      <div className="panel flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-sm font-bold uppercase text-mint">Welcome, {user.name}</p>
          <h2 className="mt-2 text-3xl font-black">{user.role === "ADMIN" ? "Admin dashboard" : "Ready for your next assessment"}</h2>
        </div>
        {user.role === "ADMIN" && (
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => setView("users")}><Users size={18} /> Users</button>
            <button className="btn btn-primary" onClick={() => setView("quizzes")}><BookOpen size={18} /> Quizzes</button>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => <div className="panel p-5" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}
      </div>
      {user.role === "ADMIN" && (
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h3 className="text-xl font-black">Quiz performance</h3>
          </div>
          {(analytics?.quizPerformance || []).slice(0, 5).map((quiz) => (
            <div className="grid gap-2 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 md:grid-cols-3" key={quiz.id}>
              <p className="font-black">{quiz.title}</p>
              <p className="font-semibold">{quiz.attempts} attempts</p>
              <p className="font-semibold text-mint">Avg {Number(quiz.averageScore).toFixed(1)}</p>
            </div>
          ))}
          {!analytics?.quizPerformance?.length && <p className="p-5 text-slate-500">No quiz attempts yet.</p>}
        </div>
      )}
      {user.role !== "ADMIN" && <button className="btn btn-primary" onClick={() => setView("quizzes")}><Play size={18} /> Open quizzes</button>}
    </div>
  );
}

function AdminQuizzes({ token }) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const blankForm = { id: null, title: "", description: "", durationMinutes: 10, difficulty: "MEDIUM", maxAttempts: 1, categoryId: "" };
  const [form, setForm] = useState(blankForm);
  const [question, setQuestion] = useState({ quizId: "", text: "", options: "Option A\nOption B\nOption C\nOption D", correctIndex: 0, points: 1, negativePoints: 0 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    api("/quizzes", { token }).then(setQuizzes).catch(() => setQuizzes(demoQuizzes));
    api("/categories").then(setCategories).catch(() => setCategories([{ id: "", name: "General" }]));
  };

  useEffect(load, [token]);

  const saveQuiz = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const body = { ...form, categoryId: form.categoryId || null };
      delete body.id;
      await api(form.id ? `/quizzes/${form.id}` : "/quizzes", { method: form.id ? "PUT" : "POST", token, body });
      setForm(blankForm);
      setMessage(form.id ? "Quiz updated" : "Quiz created");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const addQuestion = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api(`/quizzes/${question.quizId}/questions`, {
        method: "POST",
        token,
        body: { ...question, options: question.options.split("\n").filter(Boolean) }
      });
      setMessage("Question added");
      setQuestion({ ...question, text: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const editQuiz = (quiz) => {
    setForm({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      durationMinutes: quiz.durationMinutes,
      difficulty: quiz.difficulty,
      maxAttempts: quiz.maxAttempts || 1,
      categoryId: quiz.categoryId || ""
    });
  };

  const deleteQuiz = async (quizId) => {
    setError("");
    try {
      await api(`/quizzes/${quizId}`, { method: "DELETE", token });
      setMessage("Quiz deleted");
      if (form.id === quizId) setForm(blankForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Quiz management</h2>
          <span className="rounded-md bg-white px-3 py-2 text-sm font-black text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">{quizzes.length} total</span>
        </div>
        {quizzes.map((quiz) => (
          <div className="panel grid gap-4 p-5 lg:grid-cols-[1fr_auto]" key={quiz.id}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black">{quiz.title}</p>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${quiz.isPublished ? "bg-mint/10 text-mint" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {quiz.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{quiz.category?.name || "Uncategorized"} · {quiz.difficulty} · {quiz.durationMinutes} min · {quiz._count?.questions ?? 0} questions · {quiz._count?.attempts ?? 0} attempts</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{quiz.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-ghost" title="Edit quiz" onClick={() => editQuiz(quiz)}><Edit3 size={18} /> Edit</button>
              <button className="btn btn-ghost" title="Delete quiz" onClick={() => deleteQuiz(quiz.id)}><Trash2 size={18} /> Delete</button>
              <button className="btn btn-primary" onClick={() => api(`/quizzes/${quiz.id}/publish`, { method: "PATCH", token }).then(load).catch((err) => setError(err.message))}>
                {quiz.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <div className="panel p-6 text-slate-500">No quizzes yet. Create the first quiz from the form.</div>}
      </div>
      <div className="space-y-5">
        <form className="panel space-y-3 p-5" onSubmit={saveQuiz}>
          <div className="flex items-center justify-between">
            <h3 className="font-black">{form.id ? "Edit quiz" : "Create quiz"}</h3>
            {form.id && <button type="button" className="text-sm font-bold text-coral" onClick={() => setForm(blankForm)}>Cancel</button>}
          </div>
          <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="field" type="number" min="1" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
          <input className="field" type="number" min="1" value={form.maxAttempts} onChange={(e) => setForm({ ...form, maxAttempts: e.target.value })} />
          <select className="field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
            <option>EASY</option><option>MEDIUM</option><option>HARD</option>
          </select>
          <select className="field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">No category</option>
            {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
          <button className="btn btn-primary w-full"><CheckCircle2 size={18} /> {form.id ? "Update quiz" : "Save quiz"}</button>
        </form>
        <form className="panel space-y-3 p-5" onSubmit={addQuestion}>
          <h3 className="font-black">Add question</h3>
          <select className="field" value={question.quizId} onChange={(e) => setQuestion({ ...question, quizId: e.target.value })}>
            <option value="">Select quiz</option>
            {quizzes.map((quiz) => <option value={quiz.id} key={quiz.id}>{quiz.title}</option>)}
          </select>
          <textarea className="field" placeholder="Question" value={question.text} onChange={(e) => setQuestion({ ...question, text: e.target.value })} />
          <textarea className="field" value={question.options} onChange={(e) => setQuestion({ ...question, options: e.target.value })} />
          <input className="field" type="number" min="0" value={question.correctIndex} onChange={(e) => setQuestion({ ...question, correctIndex: e.target.value })} />
          <button className="btn btn-primary w-full"><UserPlus size={18} /> Add question</button>
        </form>
        {message && <p className="rounded-md bg-mint/10 p-3 text-sm font-bold text-mint">{message}</p>}
        {error && <p className="rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">{error}</p>}
      </div>
    </div>
  );
}

function StudentQuizzes({ token }) {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    api(`/quizzes?search=${encodeURIComponent(search)}`).then(setQuizzes).catch(() => setQuizzes(demoQuizzes));
  }, [search]);

  if (attempt) return <Attempt token={token} attempt={attempt} onDone={() => setAttempt(null)} />;

  return (
    <div className="space-y-5">
      <div className="panel flex items-center gap-3 p-3">
        <Search className="text-slate-400" size={20} />
        <input className="w-full bg-transparent outline-none" placeholder="Search quizzes" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div className="panel p-5" key={quiz.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-mint">{quiz.category?.name || "General"}</p>
                <h2 className="mt-1 text-xl font-black">{quiz.title}</h2>
              </div>
              <span className="rounded-md bg-gold/15 px-2 py-1 text-xs font-black text-gold">{quiz.difficulty}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{quiz.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold"><Clock size={16} /> {quiz.durationMinutes} min</span>
              <button className="btn btn-primary" onClick={() => api(`/quizzes/${quiz.id}/start`, { method: "POST", token }).then(setAttempt)}>
                <Play size={18} /> Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Attempt({ token, attempt, onDone }) {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(attempt.quiz.durationMinutes * 60);
  const [result, setResult] = useState(null);
  const question = attempt.quiz.questions[index];

  useEffect(() => {
    if (result) return undefined;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [result]);

  const submit = async () => {
    const payload = await api(`/quizzes/${attempt.quiz.id}/submit`, { method: "POST", token, body: { attemptId: attempt.attemptId, answers } });
    setResult(payload);
  };

  if (result) {
    return (
      <div className="panel p-6">
        <h2 className="text-3xl font-black">Result</h2>
        <p className="mt-2 text-xl font-bold text-mint">Score: {result.attempt.score} / {result.attempt.totalPoints}</p>
        <button className="btn btn-primary mt-5" onClick={onDone}>Back to quizzes</button>
      </div>
    );
  }

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">{attempt.quiz.title}</h2>
        <span className="rounded-md bg-coral/10 px-3 py-2 font-black text-coral">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
      </div>
      <p className="text-lg font-bold">{index + 1}. {question.text}</p>
      <div className="mt-4 grid gap-3">
        {question.options.map((option, optionIndex) => (
          <button key={option} className={`btn justify-start ${answers[question.id] === optionIndex ? "btn-primary" : "btn-ghost"}`} onClick={() => setAnswers({ ...answers, [question.id]: optionIndex })}>
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</button>
        {index < attempt.quiz.questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>Next</button>
        ) : (
          <button className="btn btn-primary" onClick={submit}>Submit quiz</button>
        )}
      </div>
    </div>
  );
}

function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = () => api("/users", { token }).then(setUsers).catch(() => setUsers([]));

  useEffect(() => { load(); }, [token]);

  const updateUser = async (userId, body) => {
    setMessage("");
    setError("");
    try {
      await api(`/users/${userId}`, { method: "PUT", token, body });
      setMessage("User updated");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (user) => {
    setMessage("");
    setError("");
    try {
      await api(`/users/${user.id}/status`, { method: "PATCH", token, body: { isActive: !user.isActive } });
      setMessage(user.isActive ? "User deactivated" : "User activated");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-2xl font-black">User management</h2>
          <p className="text-sm text-slate-500">Activate accounts and assign admin or student roles.</p>
        </div>
        <span className="rounded-md bg-mint/10 px-3 py-2 text-sm font-black text-mint">{users.length} users</span>
      </div>
      {message && <p className="rounded-md bg-mint/10 p-3 text-sm font-bold text-mint">{message}</p>}
      {error && <p className="rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">{error}</p>}
      <div className="panel overflow-hidden">
        {users.map((user) => (
          <div className="grid gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 lg:grid-cols-[1fr_160px_140px_170px]" key={user.id}>
            <div>
              <p className="font-black">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <select className="field" value={user.role} onChange={(e) => updateUser(user.id, { role: e.target.value })}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
            <span className={`flex items-center justify-center rounded-md px-2 py-1 text-xs font-black ${user.isActive ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>{user.isActive ? "Active" : "Inactive"}</span>
            <button className="btn btn-ghost" onClick={() => toggleStatus(user)}>{user.isActive ? "Deactivate" : "Activate"}</button>
          </div>
        ))}
        {users.length === 0 && <p className="p-5 text-slate-500">No users found.</p>}
      </div>
    </div>
  );
}

function History({ token }) {
  const [attempts, setAttempts] = useState([]);
  useEffect(() => { api("/attempts", { token }).then(setAttempts).catch(() => setAttempts([])); }, [token]);
  return <ListPanel title="Previous attempts" rows={attempts.map((attempt) => [`${attempt.quiz.title}`, `${attempt.score} / ${attempt.totalPoints}`, attempt.status])} />;
}

function Leaderboard() {
  const [rows, setRows] = useState(demoLeaderboard);
  useEffect(() => { api("/leaderboard").then(setRows).catch(() => {}); }, []);
  return <ListPanel title="Leaderboard" rows={rows.map((row, index) => [`#${index + 1} ${row.name}`, `${row.totalScore} pts`, `${row.attempts} attempts`])} />;
}

function ListPanel({ title, rows }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800"><h2 className="text-2xl font-black">{title}</h2></div>
      {rows.length === 0 && <p className="p-5 text-slate-500">No records yet.</p>}
      {rows.map((row) => (
        <div className="grid gap-2 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 md:grid-cols-3" key={row.join("-")}>
          {row.map((cell) => <p className="font-semibold" key={cell}>{cell}</p>)}
        </div>
      ))}
    </div>
  );
}

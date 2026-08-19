import { BarChart3, BookOpen, CheckCircle2, Clock, Edit3, LogOut, Moon, Play, Search, Shield, Sun, Trash2, Trophy, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";
import { demoAttempts, demoLeaderboard, demoQuizDetails, demoQuizzes } from "./data/demo";

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
            ...(user.role === "ADMIN" ? [["categories", "Categories", CheckCircle2]] : []),
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
          {view === "categories" && <CategoryManager token={token} />}
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
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (user.role === "ADMIN") api("/admin/analytics", { token }).then(setAnalytics).catch(() => {});
    if (user.role === "STUDENT") api("/attempts", { token }).then(setAttempts).catch(() => setAttempts(demoAttempts));
  }, [token, user.role]);

  const submittedAttempts = attempts.filter((attempt) => attempt.status === "SUBMITTED");
  const averageScore = submittedAttempts.length
    ? submittedAttempts.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / submittedAttempts.length
    : 0;
  const passedAttempts = submittedAttempts.filter((attempt) => attempt.passed).length;
  const stats = user.role === "ADMIN"
    ? [
        ["Students", analytics?.studentStats?.total ?? analytics?.totals.users ?? 0],
        ["Published quizzes", analytics?.quizStats?.published ?? 0],
        ["Submitted attempts", analytics?.attemptStats?.submitted ?? analytics?.totals.attempts ?? 0],
        ["Pass rate", `${Number(analytics?.attemptStats?.passRate ?? 0).toFixed(1)}%`]
      ]
    : [
        ["Attempts", submittedAttempts.length],
        ["Average score", `${averageScore.toFixed(1)}%`],
        ["Passed", passedAttempts],
        ["Failed", Math.max(0, submittedAttempts.length - passedAttempts)]
      ];

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
        {user.role === "STUDENT" && (
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => setView("history")}><Clock size={18} /> History</button>
            <button className="btn btn-primary" onClick={() => setView("quizzes")}><Play size={18} /> Quizzes</button>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => <div className="panel p-5" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}
      </div>
      {user.role === "ADMIN" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h3 className="text-xl font-black">Quiz performance</h3>
            </div>
            {(analytics?.quizPerformance || []).slice(0, 6).map((quiz) => (
              <ChartRow
                key={quiz.id}
                label={quiz.title}
                value={Number(quiz.averagePercentage || 0)}
                detail={`${quiz.submitted} submitted · ${quiz.passed} passed · ${quiz.failed} failed`}
              />
            ))}
            {!analytics?.quizPerformance?.length && <p className="p-5 text-slate-500">No quiz attempts yet.</p>}
          </div>
          <div className="panel p-5">
            <h3 className="text-xl font-black">Attempt analytics</h3>
            <div className="mt-4 space-y-4">
              <MetricBar label="Passed" value={analytics?.attemptStats?.passed || 0} total={analytics?.attemptStats?.submitted || 0} color="bg-mint" />
              <MetricBar label="Failed" value={analytics?.attemptStats?.failed || 0} total={analytics?.attemptStats?.submitted || 0} color="bg-coral" />
              <MetricBar label="In progress" value={analytics?.attemptStats?.inProgress || 0} total={(analytics?.attemptStats?.submitted || 0) + (analytics?.attemptStats?.inProgress || 0)} color="bg-gold" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800"><p className="text-sm text-slate-500">Drafts</p><p className="font-black">{analytics?.quizStats?.drafts || 0}</p></div>
              <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800"><p className="text-sm text-slate-500">Active students</p><p className="font-black">{analytics?.studentStats?.active || 0}</p></div>
            </div>
          </div>
        </div>
      )}
      {user.role !== "ADMIN" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h3 className="text-xl font-black">Performance chart</h3>
            </div>
            {submittedAttempts.slice(0, 6).map((attempt) => (
              <ChartRow
                key={attempt.id}
                label={attempt.quiz.title}
                value={Number(attempt.percentage || 0)}
                detail={`${attempt.score} / ${attempt.totalPoints} · ${attempt.passed ? "Passed" : "Failed"}`}
              />
            ))}
            {submittedAttempts.length === 0 && <p className="p-5 text-slate-500">No attempts yet.</p>}
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h3 className="text-xl font-black">Recent history</h3>
            </div>
            {submittedAttempts.slice(0, 4).map((attempt) => (
              <div className="border-b border-slate-100 p-4 last:border-0 dark:border-slate-800" key={attempt.id}>
                <p className="font-black">{attempt.quiz.title}</p>
                <p className="mt-1 text-sm text-slate-500">{Number(attempt.percentage || 0).toFixed(1)}% · {attempt.passed ? "Passed" : "Failed"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChartRow({ label, value, detail }) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div className="border-b border-slate-100 p-4 last:border-0 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-black">{label}</p>
        <p className="text-sm font-black text-mint">{percent.toFixed(1)}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-md bg-mint" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function MetricBar({ label, value, total, color }) {
  const percent = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-black">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-md ${color}`} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
    </div>
  );
}

function CategoryManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => api("/categories").then(setCategories).catch(() => setCategories([]));

  useEffect(() => { load(); }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api(form.id ? `/categories/${form.id}` : "/categories", {
        method: form.id ? "PUT" : "POST",
        token,
        body: { name: form.name }
      });
      setForm({ id: null, name: "" });
      setMessage(form.id ? "Category updated" : "Category created");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    setMessage("");
    setError("");
    try {
      await api(`/categories/${categoryId}`, { method: "DELETE", token });
      if (form.id === categoryId) setForm({ id: null, name: "" });
      setMessage("Category deleted");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-2xl font-black">Category management</h2>
          <p className="text-sm text-slate-500">Organize quizzes by subject or module.</p>
        </div>
        {categories.map((category) => (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800" key={category.id}>
            <p className="font-black">{category.name}</p>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={() => setForm(category)}><Edit3 size={18} /> Edit</button>
              <button className="btn btn-ghost" onClick={() => deleteCategory(category.id)}><Trash2 size={18} /> Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="p-5 text-slate-500">No categories yet.</p>}
      </div>
      <div className="space-y-4">
        <form className="panel space-y-3 p-5" onSubmit={saveCategory}>
          <div className="flex items-center justify-between">
            <h3 className="font-black">{form.id ? "Edit category" : "Create category"}</h3>
            {form.id && <button type="button" className="text-sm font-bold text-coral" onClick={() => setForm({ id: null, name: "" })}>Cancel</button>}
          </div>
          <input className="field" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <button className="btn btn-primary w-full"><CheckCircle2 size={18} /> {form.id ? "Update category" : "Save category"}</button>
        </form>
        {message && <p className="rounded-md bg-mint/10 p-3 text-sm font-bold text-mint">{message}</p>}
        {error && <p className="rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">{error}</p>}
      </div>
    </div>
  );
}

function AdminQuizzes({ token }) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const blankForm = { id: null, title: "", description: "", durationMinutes: 10, difficulty: "MEDIUM", maxAttempts: 1, passingScorePercent: 60, categoryId: "" };
  const blankQuestion = { id: null, quizId: "", text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", points: 1, negativePoints: 0 };
  const [form, setForm] = useState(blankForm);
  const [question, setQuestion] = useState(blankQuestion);
  const [questions, setQuestions] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    api("/quizzes", { token }).then(setQuizzes).catch(() => setQuizzes(demoQuizzes));
    api("/categories").then(setCategories).catch(() => setCategories([{ id: "", name: "General" }]));
  };

  useEffect(load, [token]);
  useEffect(() => {
    if (!selectedQuizId) {
      setQuestions([]);
      return;
    }
    api(`/quizzes/${selectedQuizId}/questions`, { token }).then(setQuestions).catch(() => setQuestions([]));
  }, [selectedQuizId, token]);

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
      const quizId = question.quizId || selectedQuizId;
      const options = question.options.map((option) => option.trim()).filter(Boolean);
      const body = {
        text: question.text,
        options,
        correctIndex: Number(question.correctIndex),
        explanation: question.explanation,
        points: Number(question.points),
        negativePoints: Number(question.negativePoints)
      };
      await api(question.id ? `/questions/${question.id}` : `/quizzes/${quizId}/questions`, {
        method: question.id ? "PUT" : "POST",
        token,
        body
      });
      setMessage(question.id ? "Question updated" : "Question added");
      setQuestion({ ...blankQuestion, quizId });
      setSelectedQuizId(quizId);
      load();
      api(`/quizzes/${quizId}/questions`, { token }).then(setQuestions).catch(() => {});
    } catch (err) {
      setError(err.message);
    }
  };

  const editQuestion = (item) => {
    setSelectedQuizId(item.quizId);
    setQuestion({
      id: item.id,
      quizId: item.quizId,
      text: item.text,
      options: [...item.options, "", "", "", ""].slice(0, Math.max(4, item.options.length)),
      correctIndex: item.correctIndex,
      explanation: item.explanation || "",
      points: item.points,
      negativePoints: item.negativePoints
    });
  };

  const deleteQuestion = async (questionId) => {
    setError("");
    try {
      await api(`/questions/${questionId}`, { method: "DELETE", token });
      setMessage("Question deleted");
      if (question.id === questionId) setQuestion({ ...blankQuestion, quizId: selectedQuizId });
      api(`/quizzes/${selectedQuizId}/questions`, { token }).then(setQuestions).catch(() => {});
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOption = (optionIndex, value) => {
    const nextOptions = [...question.options];
    nextOptions[optionIndex] = value;
    setQuestion({ ...question, options: nextOptions });
  };

  const addOption = () => {
    if (question.options.length < 6) setQuestion({ ...question, options: [...question.options, ""] });
  };

  const removeOption = (optionIndex) => {
    if (question.options.length <= 2) return;
    const nextOptions = question.options.filter((_, index) => index !== optionIndex);
    setQuestion({ ...question, options: nextOptions, correctIndex: Math.min(question.correctIndex, nextOptions.length - 1) });
  };

  const editQuiz = (quiz) => {
    setForm({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      durationMinutes: quiz.durationMinutes,
      difficulty: quiz.difficulty,
      maxAttempts: quiz.maxAttempts || 1,
      passingScorePercent: quiz.passingScorePercent || 60,
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
              <button className="btn btn-ghost" onClick={() => {
                setSelectedQuizId(quiz.id);
                setQuestion({ ...blankQuestion, quizId: quiz.id });
              }}>Questions</button>
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
          <input className="field" type="number" min="0" max="100" value={form.passingScorePercent} onChange={(e) => setForm({ ...form, passingScorePercent: e.target.value })} />
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
          <div className="flex items-center justify-between">
            <h3 className="font-black">{question.id ? "Edit question" : "Add question"}</h3>
            {question.id && <button type="button" className="text-sm font-bold text-coral" onClick={() => setQuestion({ ...blankQuestion, quizId: selectedQuizId })}>Cancel</button>}
          </div>
          <select className="field" value={question.quizId || selectedQuizId} onChange={(e) => {
            setSelectedQuizId(e.target.value);
            setQuestion({ ...question, quizId: e.target.value });
          }}>
            <option value="">Select quiz</option>
            {quizzes.map((quiz) => <option value={quiz.id} key={quiz.id}>{quiz.title}</option>)}
          </select>
          <textarea className="field" placeholder="Question" value={question.text} onChange={(e) => setQuestion({ ...question, text: e.target.value })} />
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div className="grid grid-cols-[1fr_auto] gap-2" key={optionIndex}>
                <input className="field" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(e) => updateOption(optionIndex, e.target.value)} />
                <button type="button" className="btn btn-ghost" onClick={() => removeOption(optionIndex)} title="Remove option"><Trash2 size={16} /></button>
              </div>
            ))}
            {question.options.length < 6 && <button type="button" className="btn btn-ghost w-full" onClick={addOption}>Add option</button>}
          </div>
          <select className="field" value={question.correctIndex} onChange={(e) => setQuestion({ ...question, correctIndex: Number(e.target.value) })}>
            {question.options.map((_, optionIndex) => <option value={optionIndex} key={optionIndex}>Correct answer: option {optionIndex + 1}</option>)}
          </select>
          <textarea className="field" placeholder="Explanation shown after submission" value={question.explanation} onChange={(e) => setQuestion({ ...question, explanation: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="field" type="number" min="0.25" step="0.25" value={question.points} onChange={(e) => setQuestion({ ...question, points: e.target.value })} />
            <input className="field" type="number" min="0" step="0.25" value={question.negativePoints} onChange={(e) => setQuestion({ ...question, negativePoints: e.target.value })} />
          </div>
          <button className="btn btn-primary w-full"><UserPlus size={18} /> {question.id ? "Update question" : "Add question"}</button>
        </form>
        {selectedQuizId && (
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <h3 className="font-black">Questions</h3>
            </div>
            {questions.map((item, itemIndex) => (
              <div className="border-b border-slate-100 p-4 last:border-0 dark:border-slate-800" key={item.id}>
                <p className="font-black">{itemIndex + 1}. {item.text}</p>
                <p className="mt-1 text-sm text-slate-500">Correct: {item.options[item.correctIndex]}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-ghost" onClick={() => editQuestion(item)}><Edit3 size={18} /> Edit</button>
                  <button className="btn btn-ghost" onClick={() => deleteQuestion(item.id)}><Trash2 size={18} /> Delete</button>
                </div>
              </div>
            ))}
            {questions.length === 0 && <p className="p-4 text-sm text-slate-500">No questions for this quiz yet.</p>}
          </div>
        )}
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
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/quizzes?search=${encodeURIComponent(search)}`).then(setQuizzes).catch(() => setQuizzes(demoQuizzes));
  }, [search]);

  const openDetails = async (quiz) => {
    setError("");
    try {
      setSelectedQuiz(await api(`/quizzes/${quiz.id}`));
    } catch {
      setSelectedQuiz({ ...quiz, questions: demoQuizDetails[quiz.id]?.questions || [] });
    }
  };

  const startQuiz = async (quizId) => {
    setError("");
    try {
      setAttempt(await api(`/quizzes/${quizId}/start`, { method: "POST", token }));
    } catch (err) {
      if (demoQuizDetails[quizId]) {
        setAttempt({ attemptId: `demo-${Date.now()}`, quiz: demoQuizDetails[quizId], demo: true });
        return;
      }
      setError(err.message);
    }
  };

  if (attempt) return <Attempt token={token} attempt={attempt} onDone={() => setAttempt(null)} />;

  if (selectedQuiz) {
    return (
      <div className="space-y-5">
        <button className="btn btn-ghost" onClick={() => setSelectedQuiz(null)}>Back to listing</button>
        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-mint">{selectedQuiz.category?.name || "General"}</p>
              <h2 className="mt-1 text-3xl font-black">{selectedQuiz.title}</h2>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{selectedQuiz.description}</p>
            </div>
            <span className="rounded-md bg-gold/15 px-3 py-2 text-sm font-black text-gold">{selectedQuiz.difficulty || "PRACTICE"}</span>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Duration</p><p className="font-black">{selectedQuiz.durationMinutes} min</p></div>
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Questions</p><p className="font-black">{selectedQuiz.questions?.length || selectedQuiz._count?.questions || 0}</p></div>
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800"><p className="text-sm text-slate-500">Attempts</p><p className="font-black">{selectedQuiz.maxAttempts || "Allowed"}</p></div>
          </div>
          {error && <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">{error}</p>}
          <button className="btn btn-primary mt-6" onClick={() => startQuiz(selectedQuiz.id)}><Play size={18} /> Start quiz</button>
        </div>
      </div>
    );
  }

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
              <button className="btn btn-primary" onClick={() => openDetails(quiz)}>
                Details
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
  const [submitting, setSubmitting] = useState(false);
  const question = attempt.quiz.questions[index];

  useEffect(() => {
    if (result) return undefined;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [result]);

  const submit = async (autoSubmitted = false) => {
    if (result || submitting) return;
    setSubmitting(true);
    if (attempt.demo) {
      const totalPoints = attempt.quiz.questions.reduce((sum, item) => sum + Number(item.points || 1), 0);
      let score = 0;
      const review = attempt.quiz.questions.map((item) => {
        const selectedIndex = answers[item.id];
        const isSkipped = selectedIndex === undefined;
        const isCorrect = selectedIndex === item.correctIndex;
        const earnedPoints = isSkipped ? 0 : isCorrect ? Number(item.points || 1) : 0;
        score += earnedPoints;
        return { ...item, questionId: item.id, selectedIndex, isSkipped, isCorrect, earnedPoints };
      });
      const percentage = totalPoints ? (score / totalPoints) * 100 : 0;
      const passingScorePercent = attempt.quiz.passingScorePercent || 60;
      setResult({ attempt: { score, totalPoints, percentage, passed: percentage >= passingScorePercent }, review, passingScorePercent });
      setSubmitting(false);
      return;
    }
    try {
      const payload = await api(`/quizzes/${attempt.quiz.id}/submit`, { method: "POST", token, body: { attemptId: attempt.attemptId, answers, autoSubmitted } });
      setResult(payload);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (seconds === 0 && !result) submit(true);
  }, [seconds, result]);

  if (result) {
    return (
      <div className="space-y-5">
        <ResultReview result={result} />
        <button className="btn btn-primary" onClick={onDone}>Back to quizzes</button>
      </div>
    );
  }

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">{attempt.quiz.title}</h2>
        <span className="rounded-md bg-coral/10 px-3 py-2 font-black text-coral">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {attempt.quiz.questions.map((item, questionIndex) => (
          <button
            className={`h-9 w-9 rounded-md text-sm font-black ${questionIndex === index ? "bg-mint text-white" : answers[item.id] !== undefined ? "bg-gold/20 text-gold" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
            key={item.id}
            onClick={() => setIndex(questionIndex)}
          >
            {questionIndex + 1}
          </button>
        ))}
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
          <button className="btn btn-primary" disabled={submitting} onClick={() => submit(false)}>{submitting ? "Submitting" : "Submit quiz"}</button>
        )}
      </div>
    </div>
  );
}

function ResultReview({ result }) {
  const attempt = result.attempt;
  const percentage = Number(result.percentage ?? attempt.percentage ?? 0);
  const passed = result.passed ?? attempt.passed;
  const passingScorePercent = Number(result.passingScorePercent ?? 60);

  return (
    <div className="space-y-5">
      <div className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Result</h2>
            <p className="mt-2 text-xl font-bold text-mint">Score: {attempt.score} / {attempt.totalPoints}</p>
          </div>
          <span className={`rounded-md px-3 py-2 text-sm font-black ${passed ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>
            {passed ? "Passed" : "Failed"} · {percentage.toFixed(1)}%
          </span>
        </div>
        <p className="mt-4 text-sm text-slate-500">Passing score: {passingScorePercent}%</p>
      </div>
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h3 className="text-xl font-black">Answer review</h3>
        </div>
        {(result.review || []).map((item, itemIndex) => (
          <div className="border-b border-slate-100 p-5 last:border-0 dark:border-slate-800" key={item.questionId || item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-black">{itemIndex + 1}. {item.text}</p>
              <span className={`rounded-md px-2 py-1 text-xs font-black ${item.isCorrect ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>
                {item.isSkipped ? "Skipped" : item.isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {item.options.map((option, optionIndex) => (
                <p className={`rounded-md p-3 text-sm font-semibold ${optionIndex === item.correctIndex ? "bg-mint/10 text-mint" : optionIndex === item.selectedIndex ? "bg-coral/10 text-coral" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`} key={option}>
                  {option}
                </p>
              ))}
            </div>
            {item.explanation && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.explanation}</p>}
          </div>
        ))}
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
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/attempts", { token }).then(setAttempts).catch(() => setAttempts([])); }, [token]);

  const openAttempt = async (attemptId) => {
    setError("");
    try {
      setSelectedResult(await api(`/attempts/${attemptId}`, { token }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (selectedResult) {
    return (
      <div className="space-y-5">
        <button className="btn btn-ghost" onClick={() => setSelectedResult(null)}>Back to history</button>
        <ResultReview result={selectedResult} />
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <h2 className="text-2xl font-black">Attempt history</h2>
      </div>
      {error && <p className="m-4 rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">{error}</p>}
      {attempts.map((attempt) => (
        <div className="grid gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 md:grid-cols-[1fr_140px_120px_150px]" key={attempt.id}>
          <div>
            <p className="font-black">{attempt.quiz.title}</p>
            <p className="text-sm text-slate-500">{attempt.quiz.category?.name || "General"} · {new Date(attempt.startedAt).toLocaleDateString()}</p>
          </div>
          <p className="font-semibold">{attempt.score} / {attempt.totalPoints}</p>
          <span className={`flex items-center justify-center rounded-md px-2 py-1 text-xs font-black ${attempt.passed ? "bg-mint/10 text-mint" : "bg-coral/10 text-coral"}`}>{attempt.passed ? "Passed" : "Failed"}</span>
          <button className="btn btn-ghost" onClick={() => openAttempt(attempt.id)}>Review</button>
        </div>
      ))}
      {attempts.length === 0 && <p className="p-5 text-slate-500">No attempts yet.</p>}
    </div>
  );
}

function Leaderboard() {
  const [rows, setRows] = useState(demoLeaderboard.map((row, index) => ({ ...row, rank: index + 1, averagePercentage: 0, bestPercentage: 0 })));
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    api("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    api(`/leaderboard${categoryId ? `?categoryId=${categoryId}` : ""}`)
      .then((payload) => setRows(payload.rows || payload))
      .catch(() => {});
  }, [categoryId]);

  return (
    <div className="space-y-5">
      <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-2xl font-black">Leaderboard</h2>
          <p className="text-sm text-slate-500">{categoryId ? "Category ranking" : "Overall ranking"}</p>
        </div>
        <select className="field max-w-xs" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Overall leaderboard</option>
          {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
        </select>
      </div>
      <div className="panel overflow-hidden">
        {rows.map((row, index) => (
          <div className="grid gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 md:grid-cols-[90px_1fr_140px_140px_120px]" key={row.userId}>
            <p className="text-xl font-black text-mint">#{row.rank || index + 1}</p>
            <p className="font-black">{row.name}</p>
            <p className="font-semibold">{row.totalScore} pts</p>
            <p className="font-semibold">{Number(row.averagePercentage || 0).toFixed(1)}% avg</p>
            <p className="font-semibold">{row.attempts} attempts</p>
          </div>
        ))}
        {rows.length === 0 && <p className="p-5 text-slate-500">No leaderboard records yet.</p>}
      </div>
    </div>
  );
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

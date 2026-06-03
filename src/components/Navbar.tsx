import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold text-slate-800">学习计划工作台</h1>
        </Link>
        <nav className="text-sm text-slate-500">管理你的学习安排</nav>
      </div>
    </header>
  )
}

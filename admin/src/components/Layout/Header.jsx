export default function Header({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
        Logout
      </button>
    </header>
  )
}

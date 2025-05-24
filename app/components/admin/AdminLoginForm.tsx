'use client'

type Props = {
    password: string
    setPassword: (p: string) => void
    login: () => void
    message?: string
}

export default function AdminLoginForm({ password, setPassword, login, message }: Props) {
    return (
        <main className="p-6 max-w-sm mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Accesso Admin</h1>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full"
                placeholder="Password"
            />
            <button
                onClick={login}
                className="bg-black text-white px-4 py-2 rounded w-full"
            >
                Entra
            </button>
            {message && <p className="text-red-600">{message}</p>}
        </main>
    )
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';

export default function SignIn() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data: users, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .limit(1)
            .single();

        if (dbError || !users) {
            setError('Username tidak ditemukan.');
            setLoading(false);
            return;
        }

        // Cek password dengan bcrypt
        const passwordMatch = await bcrypt.compare(password, users.password);

        if (!passwordMatch) {
            setError('Password salah.');
            setLoading(false);
            return;
        }

        Cookies.set('user_id', users.id, { expires: 1 });
        Cookies.set('username', users.username, { expires: 1 });
        Cookies.set('role', users.role, { expires: 1 });
        router.push('/dashboard');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Sign In</h1>
            <form onSubmit={handleSignIn}>
                <div className="mb-4">
                    <label className="block text-sm mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-4">
                        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                    </p>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

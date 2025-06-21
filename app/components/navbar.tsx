'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('user_id');
        Cookies.remove('username');
        Cookies.remove('role');
        router.push('/signin');
    };

    return (
        <nav className="bg-blue-600 text-white">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-lg font-bold">
                    Hello{username ? `, ${username}` : ''}
                </h1>

                <div className="hidden md:flex space-x-4">
                    <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                    <button onClick={handleLogout} className="hover:underline">
                        Logout
                    </button>
                </div>
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-2">
                    <Link href="/dashboard" className="block hover:underline" onClick={() => setMenuOpen(false)}>
                        Dashboard
                    </Link>
                    <button onClick={handleLogout} className="block hover:underline w-full text-left">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

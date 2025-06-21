'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import Link from 'next/link';

interface Product {
    id: number;
    nama_produk: string;
    harga_satuan: number;
    quantity: number;
}

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roles, setRoles] = useState<string | undefined>(undefined);
    const router = useRouter();
    useEffect(() => {
        const role = Cookies.get('role');
        setRoles(role);
    }, []);

    const deleteProduct = async (id: number) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            setProducts(products.filter(product => product.id !== id));
        }
    }
    useEffect(() => {
        const isLogedIn = Cookies.get('user_id');
        if (!isLogedIn) {
            router.push('/signin');
            return;
        };

        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*').order('id', { ascending: true });

            if (error) {
                setError(error.message);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Dashboard - Products</h1>
                        {roles === 'admin' && (
                            <button className="bg-black text-white px-4 py-2 rounded" onClick={() => router.push("/products/create")}>+ Add Product</button>
                        )}
                    </div>


                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center">Error: {error}</p>
                    ) : (
                        <div className="overflow-x-auto border rounded-lg shadow">
                            <table className="min-w-full text-sm text-left text-gray-700 bg-white">
                                <thead className="bg-gray-200 text-gray-900">
                                    <tr>
                                        <th className="px-4 py-2 border">ID</th>
                                        <th className="px-4 py-2 border">Nama Produk</th>
                                        <th className="px-4 py-2 border">Harga Satuan</th>
                                        <th className="px-4 py-2 border">Quantity</th>
                                        {roles === 'admin' && (
                                            <th className="px-4 py-2 border">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={product.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{index + 1}</td>
                                            <td className="px-4 py-2 border">{product.nama_produk}</td>
                                            <td className="px-4 py-2 border">Rp {product.harga_satuan.toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-2 border">{product.quantity}</td>
                                            {roles === 'admin' && (
                                                <td className="px-4 py-2 border">
                                                    <button className="text-blue-600 hover:underline" onClick={() => router.push(`/products/edit/${product.id}`)}>Edit</button>
                                                    <button className="text-red-600 hover:underline ml-2" onClick={async () => deleteProduct(product.id)}>Delete</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

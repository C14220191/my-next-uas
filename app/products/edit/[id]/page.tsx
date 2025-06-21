'use client';
import { supabase } from "@/app/lib/supabaseClient"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { use } from "react";
import Navbar from "@/app/components/navbar";


export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [roles, setRoles] = useState<string | undefined>(undefined);
    const unwrappedParams = use(params);
    useEffect(() => {
        const role = Cookies.get("role");
        if (role){
            router.push("/signin");
            return;
        }else if (role !== "admin") {
            router.push("/dashboard");
            return;
        }
        setRoles(role);
    }, []);

    const handleEditProduct = async () => {
        setLoading(true);
        const isLogedIn = Cookies.get("role");
        if (!isLogedIn || roles !== "admin") {
            setError("You do not have permission to edit products.");
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from("products")
            .update({ nama_produk: productName, harga_satuan: productPrice, quantity: productQuantity })
            .eq("id", unwrappedParams.id);

        if (error) {
            setError(error.message);
        } else {
            router.push("/dashboard")
        }
        setLoading(false);
    };
    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", unwrappedParams.id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setProductName(data.nama_produk);
                setProductPrice(data.harga_satuan);
                setProductQuantity(data.quantity);
            }
        };

        fetchProduct();
    }, [unwrappedParams.id]);
    return (
        <>
            <Navbar />
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="mb-4">
                        <label className="block mb-2">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Product Price</label>
                        <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(Number(e.target.value))}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Product Quantity</label>
                        <input
                            type="number"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(Number(e.target.value))}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                    <button
                        onClick={handleEditProduct}
                        disabled={loading}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </section>
        </>
    );
}

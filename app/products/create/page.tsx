'use client';
import { supabase } from "@/app/lib/supabaseClient";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/app/components/navbar";


export default function CreateProductPage() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [productQuantity, setProductQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const roles = Cookies.get("role");

    useEffect(() => {
        if(roles){
            router.push("/signin");
            return;
        }else if (roles !== "admin") {
            router.push("/dashboard");
            return;
        }
    }, []);
    const handleCreateProduct = async () => {
        setLoading(true);
        const isLogedIn = Cookies.get("user_id");
        if (!isLogedIn || roles !== "admin") {
            setError("You do not have permission to create products.");
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from("products")
            .insert([{ name: productName, price: productPrice, quantity: productQuantity }]);

        if (error) {
            setError(error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Create Product</h1>
                    <p>Role: {roles}</p>
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
                        onClick={handleCreateProduct}
                        className="bg-black text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </section>
        </>
    );
}

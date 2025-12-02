"use client";

import React from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";

const VerifyForm = () => {

    const [code, setCode] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

     const handleVerify = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/verifyCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            
            const data = await res.json();

            if(!res.ok) {
                setError(data.message || "Verification failed");
                setLoading(false);
                return;
            }

            // Clear any existing token
            Cookies.remove("token");

            // Sign in with the access token
            const result = await signIn("credentials", {
                access_token: data.access_token,
                redirect: false,
            });

            if (result?.error) {
                setError("Sign in failed after verification");
                return;
            }

            Cookies.set("token", data.access_token, { expires: 3, path: "/" });

            setMessage("Email verified successfully! Redirecting...");
            
            // Redirect to dashboard or home page
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch(err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

  return (
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Verify Your Email
                    </h1>
                    <p className="text-center text-gray-600 mt-2">
                        We sent a code to <span className="font-semibold">{email}</span>
                    </p>

                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            maxLength={6}
                        />
                    </div>

                    {error && (
                        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
                    )}
                    {message && (
                        <p className="mt-3 text-sm text-green-600 text-center">{message}</p>
                    )}

                    <button
                        onClick={handleVerify}
                        disabled={loading || code.length !== 6}
                        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
        </div>
    )
}

export default VerifyForm
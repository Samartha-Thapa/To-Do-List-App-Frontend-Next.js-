'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Cookies from 'js-cookie';

const Login = () => {
    const { data: session } = useSession()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if(session) {
        return (
            <>
                <div className='flex flex-col gap-6'>
                    <Card>
                        <CardContent>
                            <p>Signed in as {session.user?.email}</p>
                            <Button onClick={() => signOut({ callbackUrl: "/"})} variant="outline" className='mt-4'>Sign Out</Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password}),
            });
            const data = await res.json();
            
            if(!res.ok) {
                setError("Verification Failed");
                setLoading(false);
                return;
            }

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if(result?.error) {
                setError(result.error || "Invalid Email or Password");
                return;
            }
                Cookies.set("token", data.access_token, { expires: 3, path: "/" });
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000)
        } catch (err) {
            console.log(err);
            setError('An unexpected error occurred. Please try again');
        } finally {
            setLoading(false);
        }
    }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create an account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="name@company.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='relative'>
                        <label 
                            htmlFor="password" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input 
                            type={showPassword ? "text": "password"} 
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-9 text-purple-300 hover:text-purple-100 transition-colors'
                            aria-label={showPassword ? "Hide Password" : "Show Password"}
                        >
                            {showPassword ? <FiEyeOff className='h-4 w-4' /> : <FiEye className='h-4 w-4' />}
                        </button>
                    </div>
                    <button disabled={loading} type="submit" className="w-full text-white bg-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        {loading ? "Logging..." : "Login to your account"}
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
    </section>
  )
}

export default Login
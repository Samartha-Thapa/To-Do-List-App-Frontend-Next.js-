'use client'

import React, { FormEvent, useState } from 'react'
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null);
        setLoading(true);

        if(password !== confirmPassword) {
            setError('Password donot match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                    email,
                    password,
                }),
            });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            router.push(`/verify?email=${encodeURIComponent(email)}`);
        } catch (err) {
            console.log(err);
            setError('An unexpected error occurred');
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
                    <div>
                        {error && <p className='text-red-500 text-sm'>{error}</p>}
                        <label 
                            htmlFor="userName" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your UserName</label>
                        <input 
                            type="text" 
                            value={userName} 
                            name="userName" 
                            id="userName" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Sam Cook" 
                            required
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={loading}
                         />
                    </div>
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input 
                            type="email" 
                            value={email} 
                            name="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="name@company.com" 
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='relative'>
                        <label 
                            htmlFor="password" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                                Password
                        </label>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            value={password} 
                            name="password" 
                            id="password" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
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
                    <div className='relative'>
                        <label 
                            htmlFor="confirm-password" 
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            name="confirm-password" 
                            id="confirm-password" 
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading} 
                        />
                        <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute right-3 top-9 text-purple-300 hover:text-purple-100 transition-colors'
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <FiEyeOff className='h-4 w-4' /> : <FiEye className='h-4 w-4' /> }
                        </button>
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input 
                                id="terms" 
                                aria-describedby="terms" 
                                type="checkbox" 
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                                required />
                        </div>
                        <div className="ml-3 text-sm">
                            <label 
                                htmlFor="terms" 
                                className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                        </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full border text-white bg-black pointer bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        {loading ? "Creating account..." : "Create an account"}
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
    </section>
  )
}

export default Register;
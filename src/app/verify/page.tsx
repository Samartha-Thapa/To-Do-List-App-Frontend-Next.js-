import VerifyForm from '@/components/verify-form';
import React from 'react'
import { Suspense } from 'react';

export default function VerifyPage() {

    function Fallback() {
        return <p>Fallback Suspense</p>
    }
       return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Suspense fallback={<Fallback />}>
                <VerifyForm />
            </Suspense>
        </div>
    );
}
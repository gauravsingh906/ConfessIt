'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
    const router = useRouter();
    const [altTextIndex, setAltTextIndex] = useState(0);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const { toast } = useToast();

    // Alternating paragraph texts
    const alternatingParagraphs = [
        'Join us to explore the power of anonymous feedback.',
        'Your thoughts can help shape a better experience.',
        'Engage in conversations without revealing your identity.',
        'Your voice matters—share your feedback freely.',
        'Connect with others through honest and anonymous discussions.',
    ];

    useEffect(() => {
        // Alternate the paragraph every 3 seconds
        const textInterval = setInterval(() => {
            setAltTextIndex((prev) => (prev + 1) % alternatingParagraphs.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(textInterval);
    }, []);

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            console.log("Sign-in result:", result);

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast({
                        title: 'Login Failed',
                        description: 'Incorrect username or password',
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
            } else if (result?.url) {
                console.log("Redirecting to dashboard");
                router.replace("/dashboard");
                console.log("Redirect executed");
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            toast({
                title: 'Unexpected Error',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-animated-gradient text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-transparent rounded-lg shadow-md backdrop-blur-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome back!
                    </h1>
                    <p className={`mb-4 transition-opacity duration-1000 ${altTextIndex % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        {alternatingParagraphs[altTextIndex]}
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <Input {...field} className="bg-transparent border-gray-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} className="bg-transparent border-gray-300" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='w-full' type="submit">Sign In</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-black hover:text-blue-600">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Loader2Icon } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();
    const [altTextIndex, setAltTextIndex] = useState(0);

    // Zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    // Alternating paragraph texts
    const alternatingParagraphs = [
        'Join us and be part of a community that values your voice.',
        'Share your thoughts anonymously to foster open discussions.',
        'Your feedback can lead to impactful changes.',
        'Embrace the freedom of expressing your views without revealing your identity.',
        'Together, we can create a more inclusive environment.'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setAltTextIndex((prev) => (prev + 1) % alternatingParagraphs.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking Username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('api/sign-up', data);
            toast({
                title: 'Success',
                description: response.data.message
            });
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? "Error checking Username";
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-animated-gradient text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-transparent rounded-lg shadow-md backdrop-blur-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Join ConfessIt
                    </h1>
                    <p className={`mb-4 transition-opacity duration-1000 ${altTextIndex % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        {alternatingParagraphs[altTextIndex]}
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }} />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;

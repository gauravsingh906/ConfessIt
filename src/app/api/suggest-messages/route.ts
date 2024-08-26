// /app/api/suggest-messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        // Assuming result.response is directly accessible and is a text string or JSON
        const response = await result.response; // Adjust this if it's not a direct text or JSON response

        return NextResponse.json({
            success: true,
            message: response.text(),
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        }, { status: 500 });
    }
}

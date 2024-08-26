import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';



export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        //url se aaye data ko sahi form me convert karta hai like % to -
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 500
            })
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, {
                status: 200
            })
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired please signup again to get new code"
            }, {
                status: 400
            })
        }
        else {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            }, {
                status: 400
            })
        }
    }
    catch (error) {
        console.log("Error Checking Username", error);
        return Response.json({
            success: false,
            message: "Error checking Username"
        }, {
            status: 500
        })
    }
}
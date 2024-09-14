import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    //localhost:3000/api/cuu?username=gaurav?product=phone
    await dbConnect();
    const { searchParams } = new URL(request.url);
    try {

        const queryParams = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result)  //todo remove
        if (!result.success) {
            //sare hi error hote hai result.error.format() me
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
            }, {
                status: 400
            })
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        }, {
            status: 200
        })
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
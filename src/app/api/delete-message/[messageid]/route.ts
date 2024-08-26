import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    await dbConnect();
    const messageid = params.messageid;

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 404
        })
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            {
                $pull: { messages: { _id: messageid } }
            })

        if (updateResult.matchedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or Already deleted"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            messages: "Message Deleted"
        }, {
            status: 200
        })
    }
    catch (error) {
        console.log("Error found in delete-message route", error);
        return Response.json({
            success: false,
            message: "Error found in delete-message route"
        }, {
            status: 500
        })
    }
}



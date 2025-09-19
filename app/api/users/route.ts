import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { uid, name, email } = await request.json();

        if(!uid || !email) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 })
        }

        const user = await User.findOneAndUpdate(
            { uid: uid },
            {
                $set: {
                    email: email,
                    name: name,
                    lastLogin: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                    savedTrips: [],
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        return NextResponse.json({
            message: 'User created or updated successfully',
            user,
        }, { status: 200 })

    } catch (error) {
        console.error('Failed to create/update user:', error);
        return NextResponse.json({ 
            error: 'Failed to create/update user' 
        }, { status: 500 });
    }
}
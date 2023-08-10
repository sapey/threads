"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectionToDB } from "../mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

export async function udpateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: Params): Promise<void> {
    connectionToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );
    
        if(path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failded to create/update user: ${error.message}`)
    }
}
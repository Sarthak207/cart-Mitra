import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "cartMitra" });

// Inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    {
        event: "clerk/user.created",
    },
    async ({ event }) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`,
                imageURL: image_url,
            };
            await connectDB();
            await User.create(userData);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
);

// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    {
        event: "clerk/user.updated",
    },
    async ({ event }) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            const userData = {
                email: email_addresses[0].email_address,
                name: `${first_name} ${last_name}`,
                imageURL: image_url,
            };
            await connectDB();
            await User.findByIdAndUpdate(id, userData, { new: true });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
);

// Inngest function to delete user from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk",
    },
    {
        event: "clerk/user.deleted",
    },
    async ({ event }) => {
        try {
            const { id } = event.data;
            await connectDB();
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
);
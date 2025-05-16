import User from "../models/user.model.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        try {
            await whook.verify(JSON.stringify(req.body), headers);
        } catch (verifyError) {
            console.error("Webhook verification failed:", verifyError.message);
            return res.status(401).json({ success: false, message: "Unauthorized webhook signature." });
        }

        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
        };

        switch (type) {
            case 'user.created':
                await User.create(userData);
                break;
            case 'user.updated':
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case 'user.deleted':
                await User.findByIdAndDelete(data.id);
                break;
            default:
                console.log(`Unhandled event type: ${type}`);
        }

        res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;

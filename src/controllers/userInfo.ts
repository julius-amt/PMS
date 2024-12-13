import { Response, Request } from "express";
import User from "@/models/users";

class UserInfoController {
    static async currentUserInfo(req: Request, res: Response) {
        const userId = req!.user!.id;
        const userInfo = await User.findById(userId);

        if (!userInfo) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const userData = {
            avatar: userInfo.avatar,
            username: userInfo.username,
        };

        res.json({ user: userData });
    }
}

export default UserInfoController;

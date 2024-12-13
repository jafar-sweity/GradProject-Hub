import { Request, Response } from "express";
import UserCommunity from "../MongoDB/user.js"; // MongoDB UserCommunity Model

interface IUserCommunity {
  _id: any;
  user_id: string;
  username: string;
  avatarurl?: string;
  followers?: { user_id: number }[];
  following?: string[];
  posts?: string[];
  createdAt: Date;
}
export async function getUserInfoByUserName(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userName } = req.params;
    const { currentUserId } = req.query; // assuming you pass the logged-in user's ID as a query parameter

    if (!userName) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const userCommunity: IUserCommunity | null = await UserCommunity.findOne({
      username: userName,
    });

    if (!userCommunity) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const currentUser = await UserCommunity.findOne({
      user_id: currentUserId,
    });
    // Check if the logged-in user is following the profile

    const isFollowedByUser = userCommunity.followers?.some(
      (follower: { user_id: number }) => {
        return follower.user_id === Number(currentUserId);
      }
    );

    const responseData = {
      id: userCommunity._id.toString(),
      user_id: userCommunity.user_id,
      username: userCommunity.username,
      avatarurl: userCommunity.avatarurl || null,
      followersCount: userCommunity.followers?.length || 0,
      followingCount: userCommunity.following?.length || 0,
      postsCount: userCommunity.posts?.length || 0,
      createdAt: userCommunity.createdAt,
      isFollowedByUser, // Add the follow status here
    };

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({
      message: "Error fetching user info",
      error: error.message,
    });
  }
}

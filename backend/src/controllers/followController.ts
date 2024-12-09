import { Request, Response } from "express";
import Follow from "../MongoDB/follow.js"; // Import the Follow model
import UserCommunity from "../MongoDB/user.js"; // Import the UserCommunity model

export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // User to follow
    const { currentUserId } = req.query; // Current user's ID
   

    if (!currentUserId) {
      res.status(400).json({ message: "Invalid or missing currentUserId" });
      return;
    }
    console.log("id", id);
    console.log("currentUserId", currentUserId);
    const currentUserCommunity = await UserCommunity.findOne({
      user_id: Number(currentUserId),
    });

    const userToFollow = await UserCommunity.findOne({ user_id: Number(id) });

    if (!currentUserCommunity || !userToFollow) {
      res.status(404).json({ message: "User not found in community" });
      return;
    }

    const existingFollow = await Follow.findOne({
      follower_id: currentUserCommunity._id,
      following_id: userToFollow._id,
    });

    if (existingFollow) {
      res.status(400).json({ message: "Already following this user" });
      return;
    }
 
    const newFollow = new Follow({
      follower_id: currentUserCommunity._id,
      following_id: userToFollow._id,
    });

    await newFollow.save();

    userToFollow.followers.push({ user_id: Number(currentUserId) });
    await userToFollow.save();

    currentUserCommunity.following.push({ user_id: Number(id) });
    await currentUserCommunity.save();
    
    res.status(200).json({
      message: `Successfully followed user ${id}`,
      followersCount: userToFollow.followers.length,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
};
export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // User to unfollow
    const { currentUserId } = req.params; // Current user's ID

    if (!currentUserId || isNaN(Number(currentUserId))) {
      res.status(400).json({ message: "Invalid or missing currentUserId" });
      return;
    }

    const currentUserCommunity = await UserCommunity.findOne({
      user_id: Number(currentUserId),
    });

    const userToUnfollow = await UserCommunity.findOne({ user_id: Number(id) });

    if (!currentUserCommunity || !userToUnfollow) {
      res.status(404).json({ message: "User not found in community" });
      return;
    }

    await Follow.deleteOne({
      follower_id: currentUserCommunity._id,
      following_id: userToUnfollow._id,
    });

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (follower) => follower.user_id !== Number(currentUserId)
    );
    await userToUnfollow.save();

    currentUserCommunity.following = currentUserCommunity.following.filter(
      (follow) => follow.user_id !== Number(id)
    );
    await currentUserCommunity.save();

    res.status(200).json({
      message: `Successfully unfollowed user ${id}`,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
};

export const getFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // User ID
    const { currentUserId } = req.params; // Current user's ID

    const userCommunity = await UserCommunity.findOne({ user_id: Number(id) })
      .populate("followers.user_id", "name")
      .exec();

    if (!userCommunity) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isFollowing = userCommunity.followers.some(
      (follower) => follower.user_id === Number(currentUserId)
    );

    res.status(200).json({
      followersCount: userCommunity.followers.length,
      isFollowing,
      followers: userCommunity.followers,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching followers", error: error.message });
  }
};

export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // User ID

    const userCommunity = await UserCommunity.findOne({ user_id: Number(id) })
      .populate("following.user_id", "name")
      .exec();

    if (!userCommunity) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ following: userCommunity.following });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching following list", error: error.message });
  }
};

export const getFollowerInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.query.currentUserId as string;

    console.log("currentUserId", currentUserId + "and userId", userId);
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Find the target user
    const user = await UserCommunity.findOne({ user_id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // const currentUserId = req.query.currentUserId as string;

    let isFollowedByUser = false;

    if (currentUserId) {
      const currentUser = await UserCommunity.findOne(
        { user_id: currentUserId },
        { following: 1 }
      );

      if (currentUser) {
        isFollowedByUser = currentUser.following.some(
          (f) => f.user_id === Number(userId) // Ensure the same type for comparison
        );
      }
    }

    res.status(200).json({
      userId: user.user_id,
      isFollowedByUser,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      avatar: user.avatarurl, // Optional: Include additional details
    });
  } catch (error) {
    console.error("Error fetching follower info:", error);
    res.status(500).json({ message: "Error fetching follower info" });
  }
};

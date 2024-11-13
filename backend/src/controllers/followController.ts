import { Request, Response } from "express";
import UserCommunity from "../MongoDB/user.js"; 

// Follow a user
export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // User to follow
    const currentUser = req.user; // Assuming the authenticated user is available via req.user

    if (!currentUser) {
      res.status(401).json({ message: "Current user not authenticated" });
      return;
    }

    const userToFollow = await UserCommunity.findOne({ user_id: id });
    if (!userToFollow) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (
      userToFollow.followers.some(
        (follower) => follower.user_id === currentUser.user_id
      )
    ) {
      res.status(400).json({ message: "Already following this user" });
      return;
    }

    userToFollow.followers.push({ user_id: currentUser.user_id });
    await userToFollow.save();

    const currentUserCommunity = await UserCommunity.findOne({
      user_id: currentUser.user_id,
    });
    if (currentUserCommunity) {
      currentUserCommunity.following.push({ user_id: Number(id) });
      await currentUserCommunity.save();
    }

    res.status(200).json({ message: `Successfully followed user ${id}` });
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
    const { id } = req.params;
    const currentUser = req.user;

    if (!currentUser) {
      res.status(401).json({ message: "Current user not authenticated" });
      return;
    }

    const userToUnfollow = await UserCommunity.findOne({ user_id: id });
    if (!userToUnfollow) {
      res.status(404).json({ message: "User not found" });
    }

    if (!userToUnfollow) {
      return;
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (follower) => follower.user_id !== currentUser.user_id
    );
    await userToUnfollow.save();

    const currentUserCommunity = await UserCommunity.findOne({
      user_id: currentUser.user_id,
    });
    if (currentUserCommunity) {
      currentUserCommunity.following = currentUserCommunity.following.filter(
        (follow) => follow.user_id !== Number(id)
      );
      await currentUserCommunity.save();
    }

    res.status(200).json({ message: `Successfully unfollowed user ${id}` });
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
    const { id } = req.params;

    const userCommunity = await UserCommunity.findOne({ user_id: id }).populate(
      "followers.user_id",
      "name"
    );
    if (!userCommunity) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ followers: userCommunity.followers });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching followers", error: error.message });
  }
};

// Get a user's following list
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userCommunity = await UserCommunity.findOne({ user_id: id }).populate(
      "following.user_id",
      "name"
    );
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

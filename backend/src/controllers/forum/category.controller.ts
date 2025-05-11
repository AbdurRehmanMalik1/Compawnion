import { Request, Response } from "express";
import { ForumCategory, ForumPostModel } from "../../models/forum/forum.model";

// Helper functions for category metadata
const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    [ForumCategory.NUTRITION]: "Pet Nutrition",
    [ForumCategory.TRAINING]: "Training & Behavior",
    [ForumCategory.HEALTH]: "Health & Wellness",
    [ForumCategory.BEHAVIOR]: "Behavior Problems",
    [ForumCategory.GROOMING]: "Grooming & Care",
    [ForumCategory.ADOPTION]: "Adoption Advice",
    [ForumCategory.BREEDS]: "Breed Information",
    [ForumCategory.EMERGENCY]: "Emergency Care",
    [ForumCategory.GENERAL]: "General Discussion",
  };
  return (
    displayNames[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
};

const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    [ForumCategory.NUTRITION]:
      "Discuss pet food, dietary needs, and nutrition advice for all pets.",
    [ForumCategory.TRAINING]:
      "Share training tips, techniques, and success stories.",
    [ForumCategory.HEALTH]:
      "General health topics, preventative care, and wellness advice.",
    [ForumCategory.BEHAVIOR]:
      "Help with understanding and addressing problematic pet behaviors.",
    [ForumCategory.GROOMING]:
      "Tips for grooming, bathing, and general pet care.",
    [ForumCategory.ADOPTION]: "Advice on pet adoption, fostering, and rescue.",
    [ForumCategory.BREEDS]:
      "Information about different pet breeds, characteristics, and needs.",
    [ForumCategory.EMERGENCY]:
      "Urgent care information and emergency preparedness.",
    [ForumCategory.GENERAL]:
      "General pet discussions that don't fit in other categories.",
  };
  return descriptions[category] || "Discussions related to " + category;
};

// Get all categories with post counts
const getCategories = async (req: Request, res: Response) => {
  // Create an array of all categories
  const categories = Object.values(ForumCategory);

  // Get post counts for each category
  const categoryCounts = await ForumPostModel.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  // Create a map of category to count
  const countMap = categoryCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  // Format response
  const formattedCategories = categories.map((category) => ({
    name: category,
    count: countMap[category] || 0,
    displayName: getCategoryDisplayName(category),
    description: getCategoryDescription(category),
  }));

  res.status(200).json({
    success: true,
    data: formattedCategories,
  });
};

// Get posts by category
const getPostsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "lastActivityAt",
    order = "desc",
  } = req.query;

  // Validate category
  if (!Object.values(ForumCategory).includes(category as ForumCategory)) {
    res.status(400).json({
      success: false,
      message: "Invalid category",
    });
    return;
  }

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Determine sort order
  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions: any = {};

  // Special case for sorting by activity
  if (sortBy === "lastActivityAt") {
    sortOptions.isPinned = -1; // Pinned posts first
    sortOptions.lastActivityAt = sortOrder;
  } else {
    sortOptions[sortBy as string] = sortOrder;
  }

  // Get posts
  const posts = await ForumPostModel.find({
    category,
    isDeleted: false,
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  // Get total count for pagination
  const total = await ForumPostModel.countDocuments({
    category,
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: posts,
    category: {
      name: category,
      displayName: getCategoryDisplayName(category as string),
      description: getCategoryDescription(category as string),
    },
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  });
};

// Get forum statistics
const getForumStats = async (req: Request, res: Response) => {
  // Get total counts
  const totalPosts = await ForumPostModel.countDocuments({ isDeleted: false });

  // Get most active categories
  const categoryStats = await ForumPostModel.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Get most viewed posts
  const mostViewedPosts = await ForumPostModel.find({ isDeleted: false })
    .sort({ viewCount: -1 })
    .limit(5)
    .select("title viewCount category")
    .lean();

  // Get most upvoted posts
  const mostUpvotedPosts = await ForumPostModel.find({ isDeleted: false })
    .sort({ upvoteCount: -1 })
    .limit(5)
    .select("title upvoteCount category")
    .lean();

  // Format category stats
  const formattedCategoryStats = categoryStats.map((stat) => ({
    name: stat._id,
    displayName: getCategoryDisplayName(stat._id),
    count: stat.count,
  }));

  res.status(200).json({
    success: true,
    data: {
      totalPosts,
      topCategories: formattedCategoryStats,
      mostViewedPosts,
      mostUpvotedPosts,
    },
  });
};

export const forumCategoryController = {
  getCategories,
  getPostsByCategory,
  getForumStats,
};

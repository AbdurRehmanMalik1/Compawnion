import mongoose, { Document, Schema } from "mongoose";
import { ForumCategory } from "./forum.model";

export interface ForumCategoryInfo extends Document {
  _id: mongoose.Types.ObjectId;
  name: ForumCategory;
  displayName: string;
  description: string;
  icon: string; // URL or icon name
  color: string; // Hex color code
  order: number; // For custom ordering in UI
  postCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ForumCategoryInfo>(
  {
    name: {
      type: String,
      enum: Object.values(ForumCategory),
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    order: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const ForumCategoryModel = mongoose.model<ForumCategoryInfo>(
  "ForumCategory",
  CategorySchema
);

// Function to initialize default categories
export const initializeDefaultCategories = async () => {
  const defaultCategories = [
    {
      name: ForumCategory.NUTRITION,
      displayName: "Pet Nutrition",
      description:
        "Discuss pet diets, food recommendations, and nutritional needs for different pets.",
      icon: "food-bowl",
      color: "#4CAF50",
      order: 1,
    },
    {
      name: ForumCategory.TRAINING,
      displayName: "Training & Behavior",
      description:
        "Share training tips, behavior modification techniques, and success stories.",
      icon: "dog-training",
      color: "#2196F3",
      order: 2,
    },
    {
      name: ForumCategory.HEALTH,
      displayName: "Pet Health",
      description:
        "Discuss general health concerns, preventive care, and wellness tips.",
      icon: "medical",
      color: "#F44336",
      order: 3,
    },
    {
      name: ForumCategory.BEHAVIOR,
      displayName: "Behavior Problems",
      description:
        "Get help with behavioral issues like aggression, anxiety, and destructive behaviors.",
      icon: "paw-alert",
      color: "#FF9800",
      order: 4,
    },
    {
      name: ForumCategory.GROOMING,
      displayName: "Grooming & Care",
      description: "Tips for grooming, bathing, and general pet maintenance.",
      icon: "pet-grooming",
      color: "#9C27B0",
      order: 5,
    },
    {
      name: ForumCategory.ADOPTION,
      displayName: "Adoption & Rescue",
      description:
        "Share adoption stories, rescue information, and help for new pet parents.",
      icon: "pet-house",
      color: "#00BCD4",
      order: 6,
    },
    {
      name: ForumCategory.BREEDS,
      displayName: "Breeds & Species",
      description:
        "Discuss specific breeds, species characteristics, and breed-specific care.",
      icon: "pet-breeds",
      color: "#795548",
      order: 7,
    },
    {
      name: ForumCategory.EMERGENCY,
      displayName: "Emergency & First Aid",
      description:
        "Information about pet emergencies, first aid, and urgent care situations.",
      icon: "emergency",
      color: "#E91E63",
      order: 8,
    },
    {
      name: ForumCategory.GENERAL,
      displayName: "General Discussion",
      description:
        "For all other pet-related topics and community conversations.",
      icon: "chat-bubbles",
      color: "#607D8B",
      order: 9,
    },
  ];

  // Check if categories already exist
  const count = await ForumCategoryModel.countDocuments();
  if (count === 0) {
    // Insert default categories
    await ForumCategoryModel.insertMany(defaultCategories);
    console.log("Default forum categories initialized");
  }
};

export default ForumCategoryModel;

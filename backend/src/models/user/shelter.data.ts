import mongoose from "mongoose";

export interface ShelterData {
  shelterName: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone?: string;
  description?: string;
}

const shelterDataSchema = new mongoose.Schema<ShelterData>({
  shelterName: {
    type: String,
    required: [true, "Please provide shelter name"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Please provide shelter address"],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (v: number[]) {
          return (
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 && // longitude
            v[1] >= -90 &&
            v[1] <= 90
          ); // latitude
        },
        message:
          "Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.",
      },
    },
  },
  phone: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

// Create 2dsphere index for geospatial queries
shelterDataSchema.index({ location: "2dsphere" });

export { shelterDataSchema };

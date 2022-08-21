import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    imageKey: { type: String },
  },
  { timestamps: true },
);

imageSchema.virtual('tires', {
  localField: '_id',
  foreignField: 'image',
  ref: 'Tire',
});

const Image = mongoose.model('Image', imageSchema);

export default Image;

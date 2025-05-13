import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Please log in');
    return await ctx.storage.generateUploadUrl();
  },
});

export const processAndStoreImage = mutation({
  args: {
    storageId: v.id('_storage'),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Please log in');

    return await ctx.db.insert('images', {
      storageId: args.storageId,
      userId,
      description: args.description,
    });
  },
});

export const listImages = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db.query('images').order('desc').collect();

    return Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        const likes = await ctx.db
          .query('likes')
          .withIndex('by_image', (q) => q.eq('imageId', image._id))
          .collect();

        return {
          ...image,
          url,
          likeCount: likes.length,
        };
      }),
    );
  },
});

export const listMyImages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const images = await ctx.db
      .query('images')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();

    return Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        const likes = await ctx.db
          .query('likes')
          .withIndex('by_image', (q) => q.eq('imageId', image._id))
          .collect();

        return {
          ...image,
          url,
          likeCount: likes.length,
        };
      }),
    );
  },
});

export const deleteImage = mutation({
  args: { imageId: v.id('images') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Please log in');

    const image = await ctx.db.get(args.imageId);
    if (!image || image.userId !== userId) {
      throw new Error('Not authorized to delete this image');
    }

    await ctx.storage.delete(image.storageId);
    await ctx.db.delete(args.imageId);
  },
});

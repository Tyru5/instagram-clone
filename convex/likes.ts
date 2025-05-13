import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const toggleLike = mutation({
  args: { imageId: v.id('images') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Please log in');

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_user_and_image', (q) => q.eq('userId', userId).eq('imageId', args.imageId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert('likes', {
        imageId: args.imageId,
        userId,
      });
    }
  },
});

export const isLiked = query({
  args: { imageId: v.id('images') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const existing = await ctx.db
      .query('likes')
      .withIndex('by_user_and_image', (q) => q.eq('userId', userId).eq('imageId', args.imageId))
      .unique();

    return !!existing;
  },
});

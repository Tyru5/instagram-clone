import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

const applicationTables = {
  images: defineTable({
    storageId: v.id('_storage'),
    userId: v.id('users'),
    description: v.optional(v.string()),
  }).index('by_user', ['userId']),

  likes: defineTable({
    imageId: v.id('images'),
    userId: v.id('users'),
  })
    .index('by_image', ['imageId'])
    .index('by_user_and_image', ['userId', 'imageId']),

  comments: defineTable({
    imageId: v.id('images'),
    userId: v.id('users'),
    comment: v.string(),
  })
    .index('by_image', ['imageId'])
    .index('by_user_and_image', ['userId', 'imageId']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

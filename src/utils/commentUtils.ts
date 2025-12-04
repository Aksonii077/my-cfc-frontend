
import { Comment } from '@/types/comments';

export const getCommentsByEntity = (comments: Comment[], entityId: number, entityType: string) => {
  return comments.filter(
    comment => comment.entityId === entityId && comment.entityType === entityType && !comment.parentId
  );
};

export const updateCommentInList = (comments: Comment[], commentId: number, updates: Partial<Comment>) => {
  return comments.map(comment => {
    // Check if this is the comment to update
    if (comment.id === commentId) {
      return { ...comment, ...updates };
    }
    
    // Check if the comment is in replies
    if (comment.replies) {
      return {
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, ...updates } 
            : reply
        )
      };
    }
    
    return comment;
  });
};

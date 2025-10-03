import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewAPI } from '@/services/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { Edit, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ReviewCardProps {
  review: any;
  onUpdate: () => void;
  onDelete: () => void;
}

const ReviewCard = ({ review, onUpdate, onDelete }: ReviewCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = review.userId?._id === user?.id || review.userId === user?.id;

  const handleDelete = async () => {
    try {
      await reviewAPI.delete(review._id);
      toast.success('Review deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <h4 className="font-semibold">Edit Review</h4>
        </CardHeader>
        <CardContent>
          <ReviewForm
            bookId={review.bookId}
            existingReview={review}
            onSuccess={() => {
              setIsEditing(false);
              onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {review.userId?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{review.reviewText}</p>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewCard;

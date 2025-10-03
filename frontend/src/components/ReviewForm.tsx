import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { reviewAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import StarRating from './StarRating';
import { toast } from 'sonner';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  bookId: string;
  existingReview?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ bookId, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      reviewText: existingReview?.reviewText || '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true);
      const reviewData = {
        rating: data.rating,
        reviewText: data.reviewText,
      };
      if (existingReview) {
        await reviewAPI.update(existingReview._id, reviewData);
        toast.success('Review updated successfully');
      } else {
        await reviewAPI.create({ ...reviewData, bookId });
        toast.success('Review added successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRatingChange={field.onChange}
                  interactive
                  size="lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reviewText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this book..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;

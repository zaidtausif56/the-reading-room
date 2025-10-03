import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookAPI, reviewAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import RatingChart from '@/components/RatingChart';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
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

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await bookAPI.getById(id!);
      setBook(response.data);
    } catch (error) {
      toast.error('Failed to fetch book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getByBook(id!);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  const handleDelete = async () => {
    try {
      await bookAPI.delete(id!);
      toast.success('Book deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const isOwner = book?.addedBy?._id === user?.id || book?.addedBy === user?.id;

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!book) {
    return <div className="container mx-auto px-4 py-12 text-center">Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Book Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{book.genre}</Badge>
                  <Badge variant="outline">{book.year}</Badge>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={book.averageRating || 0} size="lg" />
                  <span className="text-lg font-medium">
                    {book.averageRating ? book.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>

              {isAuthenticated && isOwner && (
                <div className="flex md:flex-col gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/books/${id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{book.description}</p>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        {reviews.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingChart reviews={reviews} />
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {isAuthenticated && !showReviewForm ? (
              <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
            ) : !isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">Log in</Link> or{' '}
                <Link to="/signup" className="text-primary hover:underline">sign up</Link> to post a review.
              </p>
            )}
          </div>

          {showReviewForm && (
            <Card>
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  bookId={id!}
                  onSuccess={() => {
                    fetchReviews();
                    fetchBookDetails();
                    setShowReviewForm(false);
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No reviews yet. Be the first to review this book!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onUpdate={fetchReviews}
                  onDelete={fetchReviews}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the book and all its
                reviews.
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
      </div>
    </div>
  );
};

export default BookDetails;

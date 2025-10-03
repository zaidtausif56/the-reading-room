import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookCard from '@/components/BookCard';
import ReviewCard from '@/components/ReviewCard';
import { User, BookOpen, Star } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [booksResponse, reviewsResponse] = await Promise.all([
        userAPI.getBooks(),
        userAPI.getReviews(),
      ]);
      setUserBooks(booksResponse.data);
      setUserReviews(reviewsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{userBooks.length}</p>
                  <p className="text-sm text-muted-foreground">Books Added</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{userReviews.length}</p>
                  <p className="text-sm text-muted-foreground">Reviews Written</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="books">My Books</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-6">
            {userBooks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p className="mb-4">You haven't added any books yet.</p>
                  <Link to="/books/add" className="text-primary hover:underline font-medium">
                    Add your first book →
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBooks.map((book: any) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p className="mb-4">You haven't written any reviews yet.</p>
                  <Link to="/" className="text-primary hover:underline font-medium">
                    Browse books to review →
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review: any) => (
                  <div key={review._id}>
                    <Link
                      to={`/books/${review.bookId?._id}`}
                      className="text-sm text-primary hover:underline mb-2 inline-block"
                    >
                      Review for: {review.bookId?.title}
                    </Link>
                    <ReviewCard
                      review={review}
                      onUpdate={fetchUserData}
                      onDelete={fetchUserData}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

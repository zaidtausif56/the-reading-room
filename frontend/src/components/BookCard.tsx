import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    averageRating?: number;
    reviewCount?: number;
  };
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/books/${book._id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-book-hover cursor-pointer group">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{book.author}</p>
            </div>
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{book.genre}</Badge>
            <span className="text-xs text-muted-foreground">{book.year}</span>
          </div>

          {book.averageRating !== undefined && (
            <div className="flex items-center gap-2">
              <StarRating rating={book.averageRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                ({book.reviewCount || 0} {book.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <span className="text-sm text-primary font-medium group-hover:underline">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;

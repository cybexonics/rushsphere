import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import { Button } from './ui/button';

const ProductCard = ({
  id,
  name,
  slug,
  price,
  old_price,
  images,
  rating = 4, // default if missing
  vendor = 'Unknown Seller',
  isNew,
  other,
  features,
  addToWishList,
}) => {
  const discount = old_price ? Math.round(((old_price - price) / old_price) * 100) : null;
  const defaultImage = '/placeholder.jpg'; // You can use a placeholder or logo

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <Link to={`/product/${slug || id}`} className="block relative">
        <div className="overflow-hidden h-52 relative">
          <img 
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {discount}% OFF 
            </div>
          )}

          {isNew && (
            <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
              NEW
            </div>
          )}

          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-1.5"
            online={()=>addToWishList()}
          >
            <Heart className="h-full w-full text-slate-600" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${slug || id}`} className="block flex-1">
            <h3 className="font-medium text-slate-800 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-slate-500 mb-2">by {vendor.name}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                size={16}
                className={`${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-1">({rating})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-indigo-600">${price}</span>
            {old_price !== 0 && (
              <span className="text-sm text-slate-500 line-through ml-2">${old_price}</span>
            )}
          </div>
          <Button 
            size="sm"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;


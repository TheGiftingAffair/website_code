import { CachedImage } from "./CachedImage";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  description,
}: ProductCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/product/${id}`}>
        <div className="h-60 relative">
          <CachedImage
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            data-product-image="true"
          />
        </div>
        <div className="p-4 bg-[#f9f9f9]">
          <h3 className="font-alegreya font-bold text-xl mb-2">{name}</h3>
          {description && (
            <p className="text-gray-600 font-mont text-sm mb-3">
              {description.substring(0, 100)}...
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="font-mont font-semibold text-lg text-bg4">
              ${price}
            </span>
            <button className="bg-bg4/90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-bg4">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

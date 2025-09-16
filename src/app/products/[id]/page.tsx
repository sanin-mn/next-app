import AddToCartButton from '../../components/AddToCartButton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getProductDetails(id) {
    
  const res = await fetch(`${API_BASE_URL}/api/products/details.php?id=${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch product details.');
  }

  const data = await res.json();
  return data.product;
}

export default async function ProductDetailsPage({ params }) {
  const product = await getProductDetails(params.id);

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <div className="p-8 flex flex-col md:flex-row gap-8">
      <img src={product.image} alt={product.name} className="w-full md:w-1/2 rounded-lg shadow-lg" />
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-green-600 mb-4">${product.price}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
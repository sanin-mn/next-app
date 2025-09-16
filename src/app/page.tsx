import Link from 'next/link';

async function getProducts() {
  const res = await fetch('https://globosoft.co.uk/ecommerce-api/api/products/list.php');
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function HomePage() {
  const { products = [] } = await getProducts();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg text-green-600">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
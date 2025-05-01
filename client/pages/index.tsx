
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout showSidebar={false}>
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-3xl font-bold text-center">Latest Products</h1>
        <p className="text-center text-gray-600">No Products available.</p>

      </div>
    </Layout>
  );
}

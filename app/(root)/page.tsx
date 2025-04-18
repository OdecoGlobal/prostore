import ProductList from "@/components/shared/product/product-list";
import { getLatestProduct } from "@/lib/actions/product.action";
export const metadata = {
  title: "Home",
};
const HomePage = async () => {
  const latestProducts = await getLatestProduct();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
};

export default HomePage;

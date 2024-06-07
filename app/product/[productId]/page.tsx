import Container from "@/app/components/Container";
import ProductDetail from "@/app/product/[productId]/ProductDetail";
import ListRating from "@/app/product/[productId]/ListRating";
import {products} from "@/utils/products";

interface IParams {
  productId: string;
}

const Product = ({ params }: { params: IParams }) => {
  const product = products.find(item => item.id === params.productId);

  return (
    <div className="p-8">
      <Container>
        <ProductDetail product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  )
}

export default Product;
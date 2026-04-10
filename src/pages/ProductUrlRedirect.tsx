import { Navigate, useParams } from "react-router-dom";

/** Shopify-style `/products/:handle` → app route `/product/:handle` */
const ProductUrlRedirect = () => {
  const { handle } = useParams<{ handle: string }>();
  if (!handle) return <Navigate to="/" replace />;
  return <Navigate to={`/product/${encodeURIComponent(handle)}`} replace />;
};

export default ProductUrlRedirect;

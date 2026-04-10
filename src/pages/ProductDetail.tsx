import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
            View collections
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: `${product.title} × ${quantity}`, position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <Link to="/collections" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to collections</span>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
              {images[selectedImage]?.node ? (
                <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border'}`}>
                    <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">{product.title}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                ${parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)} {selectedVariant?.price.currencyCode}
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            
            {/* Variant selection */}
            {product.options.map((option, optIdx) => (
              option.values.length > 1 && (
                <div key={optIdx} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v, vIdx) => {
                      const optValue = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                      // Deduplicate
                      const prevSame = product.variants.edges.findIndex(pv => pv.node.selectedOptions.find(o => o.name === option.name)?.value === optValue);
                      if (prevSame !== vIdx) return null;
                      return (
                        <button
                          key={vIdx}
                          onClick={() => setSelectedVariantIdx(vIdx)}
                          className={`px-4 py-2 rounded-md text-sm border transition-colors ${vIdx === selectedVariantIdx ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-foreground'} ${!v.node.availableForSale ? 'opacity-40 line-through' : ''}`}
                          disabled={!v.node.availableForSale}
                        >
                          {optValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></Button>
                <span className="w-12 text-center text-lg font-medium text-foreground">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShoppingCart className="w-5 h-5 mr-2" />Add to Cart</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

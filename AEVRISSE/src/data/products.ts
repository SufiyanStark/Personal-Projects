export type ProductColor = {
  name: string;
  value: string;
};

export type ProductCategory = "hoodies" | "tshirts" | "shirts" | "jackets" | "trousers" | "coats";

export type Product = {
  id: string;
  name: string;
  collection: string;
  category: ProductCategory;
  price: number;
  currency: "INR";
  colors: ProductColor[];
  sizes: string[];
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

const standardSizes = ["S", "M", "L", "XL"];
const trouserSizes = ["30", "32", "34", "36"];

const dimensions: Record<string, { width: number; height: number }> = {
  "coat-03": { width: 2752, height: 1536 },
  "hoodie-04": { width: 2048, height: 2048 },
  "jacket-01": { width: 2048, height: 2048 },
  "jacket-03": { width: 1376, height: 768 },
  "shirt-04": { width: 2752, height: 1536 },
  "trousers-02": { width: 1536, height: 2752 },
  "tshirt-01": { width: 2752, height: 1536 },
};

const productSeed: Array<{
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  color: ProductColor;
  description: string;
}> = [
  { id: "hoodie-01", name: "AEVRISSE Merlot Sculpted Hoodie", category: "hoodies", price: 8900, color: { name: "Merlot", value: "#5a202b" }, description: "A heavy fleece silhouette with sculpted volume and a deep merlot finish." },
  { id: "hoodie-02", name: "AEVRISSE Obsidian Heavyweight Hoodie", category: "hoodies", price: 9200, color: { name: "Obsidian", value: "#171717" }, description: "Dense cotton fleece shaped for a clean architectural drape." },
  { id: "hoodie-03", name: "AEVRISSE Sage Form Hoodie", category: "hoodies", price: 8800, color: { name: "Sage", value: "#9fae9a" }, description: "Soft textured knit with a restrained sage tone and relaxed shoulder line." },
  { id: "hoodie-04", name: "AEVRISSE Bone Essential Hoodie", category: "hoodies", price: 8400, color: { name: "Bone", value: "#e4ded1" }, description: "A luminous bone hoodie with clean rib finishing and quiet proportion." },
  { id: "tshirt-01", name: "AEVRISSE Olive Draped Tee", category: "tshirts", price: 5200, color: { name: "Olive", value: "#3d4435" }, description: "Compact jersey with a fluid front and softened sleeve geometry." },
  { id: "tshirt-02", name: "AEVRISSE Graphite Core Tee", category: "tshirts", price: 5600, color: { name: "Graphite", value: "#2b2b2b" }, description: "A dark foundational tee cut with subtle volume and matte depth." },
  { id: "tshirt-03", name: "AEVRISSE Porcelain Crew Tee", category: "tshirts", price: 5100, color: { name: "Porcelain", value: "#e9e3d8" }, description: "A bright crewneck essential with refined weight and crisp finishing." },
  { id: "tshirt-04", name: "AEVRISSE Ink Relaxed Tee", category: "tshirts", price: 5400, color: { name: "Ink", value: "#1b2130" }, description: "A relaxed dark tee with a smooth surface and quiet structure." },
  { id: "shirt-01", name: "AEVRISSE Chalk Studio Shirt", category: "shirts", price: 9600, color: { name: "Chalk", value: "#ded8ca" }, description: "Tailored cotton shirting with a pale chalk tone and precise collar line." },
  { id: "shirt-02", name: "AEVRISSE Charcoal Atelier Shirt", category: "shirts", price: 9900, color: { name: "Charcoal", value: "#2b2926" }, description: "A dark architectural shirt with clean placket detail and soft volume." },
  { id: "shirt-03", name: "AEVRISSE Moss Utility Shirt", category: "shirts", price: 10400, color: { name: "Moss", value: "#505a43" }, description: "Utility-inflected shirting with restrained pocketing and a muted moss cast." },
  { id: "shirt-04", name: "AEVRISSE Stone Fluid Shirt", category: "shirts", price: 9800, color: { name: "Stone", value: "#b8afa0" }, description: "A fluid stone shirt balancing polish with ease." },
  { id: "jacket-01", name: "AEVRISSE Obsidian Structured Blazer", category: "jackets", price: 16800, color: { name: "Obsidian", value: "#111111" }, description: "A sculpted black blazer with sharp lapels and a formal matte finish." },
  { id: "jacket-02", name: "AEVRISSE Umber Cropped Jacket", category: "jackets", price: 14900, color: { name: "Umber", value: "#6f4d35" }, description: "Cropped outerwear with warm umber depth and structured shoulder balance." },
  { id: "jacket-03", name: "AEVRISSE Slate Work Jacket", category: "jackets", price: 13800, color: { name: "Slate", value: "#4a5254" }, description: "A utilitarian jacket refined into a quiet slate showroom piece." },
  { id: "jacket-04", name: "AEVRISSE Nightfall Tailored Jacket", category: "jackets", price: 15900, color: { name: "Nightfall", value: "#161a20" }, description: "Dark tailoring with a close, composed silhouette and clean front line." },
  { id: "trousers-01", name: "AEVRISSE Taupe Pleated Trouser", category: "trousers", price: 11800, color: { name: "Taupe", value: "#9b8068" }, description: "Pleated tailoring with a soft taupe fall and elongated line." },
  { id: "trousers-02", name: "AEVRISSE Black Column Trouser", category: "trousers", price: 12400, color: { name: "Black", value: "#111111" }, description: "A long black trouser with vertical discipline and formal restraint." },
  { id: "trousers-03", name: "AEVRISSE Sand Relaxed Trouser", category: "trousers", price: 11200, color: { name: "Sand", value: "#c2ad90" }, description: "Relaxed sand tailoring with considered fullness and softened crease." },
  { id: "trousers-04", name: "AEVRISSE Charcoal Wide Trouser", category: "trousers", price: 12600, color: { name: "Charcoal", value: "#282726" }, description: "Wide-leg charcoal trousers with a calm, architectural fall." },
  { id: "coat-01", name: "AEVRISSE Obsidian Long Coat", category: "coats", price: 21900, color: { name: "Obsidian", value: "#111111" }, description: "A long dark coat with strong vertical presence and precise lapel structure." },
  { id: "coat-02", name: "AEVRISSE Camel Gallery Coat", category: "coats", price: 22600, color: { name: "Camel", value: "#a47b55" }, description: "A warm camel coat cut for gallery-like movement and soft authority." },
  { id: "coat-03", name: "AEVRISSE Storm Wool Coat", category: "coats", price: 23200, color: { name: "Storm", value: "#363a3d" }, description: "A storm-toned coat with sculptural weight and quiet evening polish." },
  { id: "coat-04", name: "AEVRISSE Midnight Column Coat", category: "coats", price: 23800, color: { name: "Midnight", value: "#15171d" }, description: "A dramatic long coat with deep midnight texture and elongated proportion." },
];

export const products: Product[] = productSeed.map((product) => {
  const imageSize = dimensions[product.id] ?? { width: 2816, height: 1536 };

  return {
    ...product,
    collection: "COLLECTION 01",
    currency: "INR",
    colors: [product.color],
    sizes: product.category === "trousers" ? trouserSizes : standardSizes,
    image: `/models/clothing/clean/${product.id}.png`,
    imageWidth: imageSize.width,
    imageHeight: imageSize.height,
  };
});

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

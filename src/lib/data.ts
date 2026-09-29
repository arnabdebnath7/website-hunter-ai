export const PHONE_DISPLAY = "+91 95471 96455";
export const PHONE_TEL = "+919547196455";
export const WA_NUMBER = "919734794901";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;
export const ADDRESS =
  "Contai Bypass Rd, beside Central Bus Stand, Banamali Pur, Contai, Purba Medinipur, West Bengal 721404";
export const ADDRESS_SHORT = "Contai Bypass Road, Contai, West Bengal";
export const HOURS = "11:00 AM – 10:30 PM";
export const MAP_EMBED =
  "https://www.google.com/maps?q=Restaurant+Niketa,+Contai+Bypass+Road,+Contai,+Purba+Medinipur,+West+Bengal+721404&output=embed";
export const MAP_LINK =
  "https://www.google.com/maps/dir/?api=1&destination=Restaurant+Niketa+Contai+Bypass+Road+West+Bengal";
export const MAP_REVIEWS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Restaurant+Niketa+Contai+reviews";

/* ------------------------------ menu data ------------------------------ */

export type Badge = "Bestseller" | "Chef's Signature";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  price2?: number;
  veg: boolean;
  img?: string;
  badge?: Badge;
  desc?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const item = (
  name: string,
  price: number,
  veg: boolean,
  options: Pick<MenuItem, "price2" | "img" | "badge" | "desc"> = {}
): MenuItem => ({ id: slug(name), name, price, veg, ...options });

const menuImages = [
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=82",
] as const;

const menuImage = (name: string, _category: string) => menuImages[slug(name).length % menuImages.length];

const withImages = (category: string, items: MenuItem[]) =>
  items.map((i) => ({ ...i, img: i.img ?? menuImage(i.name, category) }));

export const favourites: MenuItem[] = withImages("Everyone's Favourite", [
  item("Chicken Biryani", 185, false, { badge: "Bestseller", desc: "Aromatic Kolkata-style favourite" }),
  item("Chicken Special Biryani", 279, false, { badge: "Chef's Signature", desc: "Egg, alu and rich dum rice" }),
  item("Mutton Biryani", 240, false, { badge: "Bestseller", desc: "Tender mutton with fragrant rice" }),
  item("Mutton Special Biryani", 395, false, { desc: "Special portion for biryani lovers" }),
  item("Fish Finger", 305, false, { badge: "Bestseller", desc: "Crisp golden fish starter" }),
  item("Chicken Lollipop", 205, false, { desc: "Classic Indo-Chinese starter" }),
  item("Dragon Chicken", 275, false, { badge: "Chef's Signature", desc: "Fiery house-special chicken" }),
  item("Chilli Chicken", 180, false, { badge: "Bestseller", desc: "Wok tossed chilli favourite" }),
  item("Chicken Hakka Noodles", 170, false, { desc: "Wok-tossed noodles" }),
  item("Chicken Kasha", 200, false, { desc: "Bengali-style rich gravy" }),
  item("Paneer Tikka", 200, true, { desc: "Tandoor grilled paneer" }),
  item("Cold Coffee with Ice Cream", 160, true, { desc: "Creamy chilled favourite" }),
]);

export const menuCategories: MenuCategory[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    items: withImages("Breakfast", [
      item("Tea", 50, true),
      item("Coffee", 60, true),
      item("Omelette", 55, false),
      item("Egg Toast", 55, false),
      item("Egg Boil", 55, false),
      item("Aloo Paratha", 75, true),
      item("Paneer Paratha", 85, true),
    ]),
  },
  {
    id: "soup",
    label: "Soup",
    items: withImages("Soup", [
      item("Veg Hot & Sour Soup", 105, true),
      item("Cream of Tomato Soup", 95, true),
      item("Veg Clear Soup", 95, true),
      item("Sweet Corn Soup Veg", 105, true),
      item("Sweet Corn Soup Chicken", 115, false),
      item("Chicken Noodles Soup", 115, false),
      item("Chicken Clear Soup", 95, false),
      item("Chicken Thai Soup", 130, false),
      item("Chicken Manchow Soup", 130, false),
      item("Chicken Hot & Sour Soup", 115, false),
      item("Mix Thai Soup", 140, false),
      item("Chicken Lung Fung Soup", 140, false),
      item("Tom Yum Soup", 130, false),
    ]),
  },
  {
    id: "starter",
    label: "Starter",
    items: withImages("Starter", [
      item("Fish Finger", 305, false),
      item("French Fries", 140, true),
      item("Onion Pakora", 130, true),
      item("Veg Pakora", 140, true),
      item("Egg Pakora", 135, false),
      item("Chicken Pakora", 190, false),
      item("Paneer Pakora", 170, true),
      item("Chicken 65", 210, false),
      item("BBQ Chicken Wings", 210, false),
      item("Chicken Wings Pepper Fry", 200, false),
      item("Chicken Lollipop", 205, false),
      item("Golden Fry Prawn", 400, false),
      item("Veg Crispy", 205, true),
      item("Crispy Chilli Babycorn", 200, true),
      item("Crispy Chicken", 250, false),
      item("Union Chicken Dry", 200, false),
      item("Sesame Chicken Dry", 190, false),
      item("Chilli Potato", 195, true),
      item("Black Pepper Chicken", 260, false),
      item("Chicken Popcorn", 200, false),
    ]),
  },
  {
    id: "biryani",
    label: "Biryani",
    items: withImages("Biryani", [
      item("Chicken Biryani", 185, false),
      item("Chicken Special Biryani", 279, false),
      item("Mutton Biryani", 240, false),
      item("Mutton Special Biryani", 395, false),
    ]),
  },
  {
    id: "rice",
    label: "Rice",
    items: withImages("Rice", [
      item("Steamed Rice", 65, true),
      item("Jeera Rice", 110, true),
      item("Curd Rice", 155, true),
      item("Veg Pulao", 165, true),
      item("Kaju Khazana Pulao", 190, true),
      item("Hara Pulao", 165, true),
      item("Kashmiri Pulao", 195, true),
      item("Chicken Fried Rice", 170, false),
      item("Egg Fried Rice", 150, false),
      item("Veg Fried Rice", 140, true),
      item("Mixed Fried Rice", 210, false),
      item("Lemon Coriander Rice", 150, true, { price2: 200 }),
    ]),
  },
  {
    id: "indian-main-course",
    label: "Indian Main Course",
    items: withImages("Indian Main Course", [
      item("Chicken Masala", 200, false),
      item("Chicken Kasha", 200, false),
      item("Chicken Curry", 190, false),
      item("Chicken Varta", 265, false),
      item("Chicken Handi", 285, false),
      item("Chicken Rezala", 170, false),
      item("Chicken Korma", 235, false),
      item("Chicken Makhani", 275, false),
      item("Chicken Bhuna Masala", 265, false),
      item("Chicken Butter Masala", 235, false),
      item("Chicken Tikka Butter Masala", 275, false),
      item("Pepper Chicken Masala", 210, false),
      item("Reshmi Butter Masala", 285, false),
      item("Chicken Do Pyaza", 235, false),
      item("Mutton Nawabi", 390, false),
      item("Mutton Do Pyaza", 380, false),
      item("Chicken Lucknowi", 255, false),
      item("Karai Chicken", 210, false),
      item("Mutton Karai", 375, false),
      item("Keema Matar", 285, false),
      item("Keema Masala", 350, false),
      item("Palak Keema", 295, false),
      item("Mutton Handi", 380, false),
      item("Egg Curry", 105, false),
      item("Egg Tadka", 140, false),
    ]),
  },
  {
    id: "bengali-local-main-course",
    label: "Bengali / Local Main Course",
    items: withImages("Bengali / Local Main Course", [
      item("Katla Kalia (Local Fish)", 190, false),
      item("Katla Fry", 155, false),
      item("Pomfret Fry", 370, false),
      item("Chicken Aloo Jhol", 142, false),
      item("Jhinge Posto", 115, true),
    ]),
  },
  {
    id: "veg-indian-main-course",
    label: "Veg Indian Main Course",
    items: withImages("Veg Indian Main Course", [
      item("Aloo Jeera", 155, true),
      item("Dal Fry", 120, true),
      item("Moong Dal", 88, true),
      item("Green Peas Masala", 188, true),
      item("Matar Paneer", 228, true),
      item("Kadai Paneer", 269, true),
      item("Paneer Pasanda", 356, true),
      item("Palak Paneer", 242, true),
      item("Malai Kofta", 255, true),
      item("Aloo Gobi Masala", 188, true),
    ]),
  },
  {
    id: "chinese",
    label: "Chinese",
    items: withImages("Chinese", [
      item("Veg Chowmein", 140, true),
      item("Egg Chowmein", 150, false),
      item("Chicken Chowmein", 170, false),
      item("Mixed Chowmein", 210, false),
      item("Veg Hakka Noodles", 140, true),
      item("Chicken Hakka Noodles", 170, false),
      item("Paneer Manchurian", 180, true),
      item("Veg Manchurian", 140, true),
      item("Gobi Manchurian", 150, true),
      item("Chilli Paneer", 170, true),
      item("Chilli Chicken", 180, false),
      item("Dragon Chicken", 275, false),
      item("Chicken Manchurian", 190, false),
      item("Szechwan Chicken", 200, false),
      item("Ginger Chicken", 200, false),
      item("Garlic Chicken", 185, false),
      item("Sesame Chicken", 200, false),
      item("Sweet & Sour Chicken", 265, false),
      item("Szechwan Fried Chicken", 255, false),
      item("Szechwan Fried Fish", 305, false),
      item("American Chopsuey", 290, false),
      item("Chicken Pan Fried Noodles", 295, false),
    ]),
  },
  {
    id: "tandoor",
    label: "Tandoor",
    items: withImages("Tandoor", [
      item("Fish Tikka", 355, false),
      item("Paneer Tikka", 200, true),
      item("Chicken Tikka", 210, false),
      item("Chicken Reshmi Kebab", 245, false),
      item("Chicken Boti Kebab", 255, false),
      item("Chicken Seekh Kebab", 285, false),
      item("Veg Seekh Kebab", 190, true),
      item("Chicken Hariyali Kebab (6 Pcs)", 330, false),
    ]),
  },
  {
    id: "breads",
    label: "Breads",
    items: withImages("Breads", [
      item("Butter Naan", 65, true),
      item("Tandoori Roti", 40, true),
      item("Garlic Naan", 80, true),
      item("Butter Tandoori Roti", 55, true),
      item("Onion Naan", 80, true),
      item("Masala Kulcha", 100, true),
    ]),
  },
  {
    id: "burger",
    label: "Burger",
    items: withImages("Burger", [
      item("Chicken Burger", 124, false),
      item("Cheese Chicken Burger", 144, false),
      item("Extra Cheese Chicken Burger", 154, false),
    ]),
  },
  {
    id: "pizza",
    label: "Pizza",
    items: withImages("Pizza", [
      item("Mushroom Pizza", 205, true),
      item("Paneer Pizza", 205, true),
      item("Extra Veg Pizza", 210, true),
      item("Chicken Tikka Pizza", 220, false),
      item("Chicken BBQ Pizza", 220, false),
      item("Chicken Peri Peri Pizza", 220, false),
      item("Chicken Dominant Pizza", 275, false),
    ]),
  },
  {
    id: "ice-cream",
    label: "Ice Cream",
    items: withImages("Ice Cream", [
      item("Black Currant", 85, true),
      item("Two In One", 75, true),
      item("Vanilla", 75, true),
    ]),
  },
  {
    id: "beverages",
    label: "Beverages",
    items: withImages("Beverages", [
      item("Mineral Water", 20, true),
      item("Fresh Lime Soda", 65, true),
      item("Cold Drinks", 55, true),
      item("Masala Cold Drinks", 65, true),
      item("Mango Juice", 85, true),
      item("Orange Juice", 85, true),
      item("Litchi Juice", 85, true),
      item("Pineapple Juice", 85, true),
      item("Cold Coffee", 115, true),
      item("Cold Coffee with Ice Cream", 160, true),
    ]),
  },
  {
    id: "lassi",
    label: "Lassi",
    items: withImages("Lassi", [
      item("Plain Lassi", 85, true),
      item("Sweet Lassi", 85, true),
      item("Mango Lassi", 100, true),
      item("Strawberry Lassi", 100, true),
    ]),
  },
  {
    id: "mocktail",
    label: "Mocktail",
    items: withImages("Mocktail", [
      item("Pink Lady", 130, true),
      item("Floods", 105, true),
      item("Sunset Cooler", 130, true),
      item("Mango Blossom", 150, true),
      item("Orange Blossom", 150, true),
      item("Pineapple Blossom", 150, true),
      item("Chocolate Shake", 130, true),
      item("Mango Shake", 130, true),
      item("Strawberry Shake", 130, true),
    ]),
  },
];

/** Lookup for the cart (favourites & category rows share ids). */
export const menuItemById: Record<string, MenuItem> = {};
menuCategories.forEach((c) => c.items.forEach((i) => (menuItemById[i.id] = i)));
favourites.forEach((i) => {
  if (!menuItemById[i.id]) menuItemById[i.id] = i;
});

/* ------------------------------ gallery ------------------------------ */

export interface GalleryItem {
  img: string;
  title: string;
  tag: string;
  ratio: "3 / 4" | "4 / 3" | "4 / 5";
}

export const gallery: GalleryItem[] = [
  { img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=82", title: "The Dining Room", tag: "Ambience", ratio: "3 / 4" },
  { img: "https://images.unsplash.com/photo-1517248135467-4c7b7a9b4c1a?auto=format&fit=crop&w=1200&q=82", title: "Fire & Wok", tag: "Chinese Kitchen", ratio: "4 / 3" },
  { img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=82", title: "From the Tandoor", tag: "Live Fire", ratio: "3 / 4" },
  { img: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1200&q=82", title: "Slow Dum", tag: "Signature", ratio: "4 / 5" },
  { img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=82", title: "Wok-Tossed Hakka", tag: "Chinese Kitchen", ratio: "3 / 4" },
  { img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=82", title: "The Spice Library", tag: "Our Craft", ratio: "4 / 3" },
  { img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=82", title: "Sweet Endings", tag: "Desserts", ratio: "3 / 4" },
  { img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=82", title: "House Starters", tag: "Appetisers", ratio: "4 / 5" },
];

/* ------------------------------ reviews ------------------------------ */

export interface Review {
  name: string;
  meta: string;
  text: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    name: "Soumyadeep Maity",
    meta: "Dines since 2015 · Contai",
    text: "The mutton biryani here is easily the best in Contai. Fragrant, layered, and the meat falls off the bone. Niketa has quietly turned our Sunday lunches into a family ritual.",
    rating: 5,
  },
  {
    name: "Priyanka Jana",
    meta: "Anniversary dinner",
    text: "Took my parents for their anniversary — the team set our table beautifully and the paneer dishes were silky perfection.",
    rating: 5,
  },
  {
    name: "Sk Arif Hossain",
    meta: "Regular guest",
    text: "Dragon chicken with mixed fried rice — flaming hot, exactly how I like it. Beats most city restaurants.",
    rating: 4.5,
  },
  {
    name: "Anwesha Das",
    meta: "Family dinner",
    text: "Clean, elegant and genuinely family friendly. The kids love the fish fingers, we love the kasha.",
    rating: 5,
  },
  {
    name: "Rajat Giri",
    meta: "Office lunch group",
    text: "Fast service even at peak hours. The chicken butter masala tastes straight out of a Kolkata dhaba classic.",
    rating: 4.5,
  },
  {
    name: "Moumita Bera",
    meta: "Weekend regular",
    text: "Their chilli chicken is my comfort order, every single time. And the gulab jamun with ice cream to finish — perfect.",
    rating: 5,
  },
  {
    name: "Sourav Pradhan",
    meta: "Google guest · Contai",
    text: "Good place near the bus stand for family dining. Biryani portions are generous, service is quick and the Chinese starters are reliable.",
    rating: 4,
  },
];

export const marqueeItems = [
  "Chicken Biryani",
  "Mutton Biryani",
  "Dragon Chicken",
  "Tandoori Chicken",
  "Chilli Chicken",
  "Hakka Noodles",
  "Chicken Lollipop",
  "Fish Finger",
  "Paneer Tikka",
  "Gulab Jamun",
];

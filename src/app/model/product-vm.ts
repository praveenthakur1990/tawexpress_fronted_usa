export class ProductVM {

}

export class ProductsData {
    categoryId?: number;
    categoryName?: string;
    categoryImage?: string;
    products?: Array<ProductDashboardVM>;
}

export class ProductDashboardVM {
    id?: number;
    price?: number;
    productImage?: string;
    productName?: string;
    categoryName?: string;
    categoryImage?: string;
    subCategoryId?: number;
    subCategoryName?: string;
    isVarient?: boolean;
    productVarients?: Array<ProductVarientVM>;
    defaultVarientId?: number;
    description?: string;
    isDescriptionShow?: boolean;
    isAdded?: boolean;
    categoryId?: number;
    offerType?: string;
    offerValue?: number;
    weeklyCircularId?: number;
    finalValue?: string;
    finalOfferValue?:string;
    bannerImg?:string;
}

export class SubCatProductsData {
    categoryId?: number;
    categoryName?: string;
    subCategoryId?: number;
    subCategoryName?: string;
    products?: Array<ProductDashboardVM>;
}

export class ProductVarientVM {
    id?: number;
    name?: string;
    price?: number;
    image?: string;
}

export class cartItem {
    productId?: number;
    productName?: string;
    qty?: number;
    price?: number;
    productImg?: string;
    productVarientId?: number;
    totalPrice?: number;
    catId?: number;
    offerType?: string;
    offerValue?: number;
    finalValue?: string;
    finalOfferValue?:string;
}


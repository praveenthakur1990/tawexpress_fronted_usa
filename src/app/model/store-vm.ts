export class StoreVM {
    name?: string;
    email?: string;
    mobile?: string;
    contactNumber?: string;
    address?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    countryCode?: string;
    logoPath?: string;
    currencySymbol?: string;
    latitude?: string;
    longitude?: string;
    deliveryCharges?: number;
    taxRate?: number;
    minOrderAmt?: string;
    maxDeliveryAreaInMiles?: string;
    userId?: string;
    taxAmt?: number;
    businessHours?: BusinessVM;
    businessHourList?: Array<BusinessVM>;
    bannerList?: Array<any>;
    advImgList?:Array<any>;
}

export class BusinessVM {
    dayName?: string;
    closeTime?: string;
    closeTime12Hour?: string;
    currentTime?: string;
    isClosed?: boolean;
    openTime?: string;
    openTime12Hour?: string;
    weekDayId?: number;
}
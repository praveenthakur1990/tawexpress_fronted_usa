export class Constants {
    public static get tenantsInfoURL(): string { return "/api/Account/GetTenantsInfo"; }
    public static get getCategoriesURL(): string { return "/api/Category/GetCategories"; }
    public static get getProductsForDashboardURL(): string { return "/api/Product/GetProductsForDashboard"; }
    public static get getProductsByCategoryIdURL(): string { return "/api/Product/GetProductByCategoryIdAPP"; }
    public static get getProductsBySearchStrURL(): string { return "/api/Product/GetProductBySearch"; }
    public static get getRelatedProductsByIdURL(): string { return "/api/Product/GetRelatedProductsById"; }

    public static get getSubCategoriesURL(): string { return "/api/Category/GetSubCategoriesApp"; }
    public static get getBrandsForAppURL(): string { return "/api/Brand/GetBrandsForAPP"; }

    public static get registerURL(): string { return "/api/Account/Register"; }
    public static get changePasswordURL(): string { return "/api/Account/ChangePassword"; }
    public static get verifyOTPURL(): string { return "/api/Account/VerifyOTP"; }
    public static get loginURL(): string { return "/token"; }
    public static get logoutURL(): string { return "/api/Account/Logout"; }
    public static get GenerateOTPURL(): string { return "/api/Account/GenerateOTP"; }

    public static get saveOrderURL(): string { return "/api/Payment/SaveOrder"; }

    public static get saveDeliveryAddressURL(): string { return "/api/DeliveryAddress/AddUpdate"; }
    public static get getDeliveryAddresses(): string { return "/api/DeliveryAddress/Get"; }
    public static get getDeliverySlotDays(): string { return "/api/DeliveryAddress/GetDeliverySlotDays"; }
    public static get getDeliverySlots(): string { return "/api/DeliveryAddress/GetDeliverySlotTimes"; }
    public static get CalculateDistanceURL(): string { return "/api/DeliveryAddress/CalculateDistance"; }

    public static get getOrderListURL(): string { return "/api/Order/GetOrderList"; }
    public static get updatePersonalInfoURL(): string { return "/api/Account/UpdatePersonalInfo"; }

    public static get deliveryAddressSuccessMsg(): string { return "Your delivery address has been added successfully"; }
    public static get sessionExpiredMsg(): string { return "Your session has been expired, please login again"; }
    public static get personalInfoSuccessMsg(): string { return "Your personal info has been updated successfully"; }
    public static get minOrderMsg(): string { return "Order must be greater than "; }
    public static get locationFaAwayMsg(): string { return "Sorry, delivery isn't available for this address"; }

    public static get offlineMsg(): string { return "You can place your order between "; }


    public static get pageSize(): number { return 5 };


    public static get getWeeklyCircularDatesForAPPURL(): string { return "/api/WeeklyCircular/GetWeeklyCircularDates"; }
    public static get getProductsByWeeklyCircularIdAPPURL(): string { return "/api/WeeklyCircular/GetProductByWeeklyCircularId"; }
    public static get getWeeklyCircularInfByIdAPPURL(): string { return "/api/WeeklyCircular/GetWeeklyCircular"; }
    public static get getWeeklyCircularCatgoriesAPPURL(): string { return "/api/WeeklyCircular/GetProductCatWeeklyCircularId"; }

    public static get getWeeklyCircularSubscriberSaveURL(): string { return "/api/WeeklyCircular/SaveWeeklyCircularSubscriber"; }
    public static get getWeeklyCircularVerifySubscriberURL(): string { return "/api/WeeklyCircular/VerifyWeeklyCircularSubscriber"; }

    public static get getWeeklyCircularValidateSubscriberURL(): string { return "/api/WeeklyCircular/ValidateSubscriber"; }

    public static get getSpecialOfferDatesForAPPURL(): string { return "/api/SpecialOffer/GetSpecialOfferDates"; }
    public static get getSpecialOfferInfByIdAPPURL(): string { return "/api/SpecialOffer/GetSpecialOffer"; }
    public static get getProductsBySpecialOfferIdAPPURL(): string { return "/api/SpecialOffer/GetProductBySpecialOfferId"; }
    public static get getSpecialOfferCatgoriesAPPURL(): string { return "/api/SpecialOffer/GetProductCatSpecialOfferId"; }

}

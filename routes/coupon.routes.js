// jshint esversion:6 

// ================================ creating application routes ===================================//
module.exports = app => {
    const coupon = require(`../controllers/coupon.controllers`);

    app.route(`/coupon`)
        .get(coupon.view);

    app.route(`/getCouponList`)
        .get(coupon.getList);

    app.route(`/searchCoupons`)
        .post(coupon.search);

    app.route(`/createCoupon`)
        .post(coupon.createCoupon);

    app.route(`/deleteCoupon/:couponId`)
        .post(coupon.deleteCoupon);
};
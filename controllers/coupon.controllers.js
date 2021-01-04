// jshint esversion:6
const spawn = require('spawn-password');
const coupons = require(`./../models/coupon.models`);
exports.view = (req, res, next) => {
    coupons.find({}).then(coupons => {
        res.status(200).send({
            coupons: coupons,
            err: null,
            msg: null,
            staffInfo: req.session.staff,
        });
    }).catch(err => {
        res.status(404).send({
            coupons: null,
            err: `Could not fetch coupons.`,
            msg: null,
            staffInfo: req.session.staff,
        });
    });
};

exports.search = (req, res, next) => {
    coupons.find({ generatedCode: req.body.searchTerm }).then(coupons => {
        res.status(200).send({
            coupons: coupons,
            err: null,
            msg: null,
            staffInfo: req.session.staff
        });
    }).catch(err => {
        res.status(404).send({
            coupons: null,
            err: `Could not fetch coupons.`,
            msg: null,
            staffInfo: req.session.staff
        });
    });
};

exports.createCoupon = (req, res, next) => {
    console.log(`Generated code`);
    console.log(req.body);
    coupons.create({
        generatedCode: req.body.generatedCode,
        discountType: {
            type: req.body.discountType,
            value: parseInt(req.body.discountValue),
        },
        useType: {
            type: req.body.useType
        },
        dates: {
            expiryDate: req.body.couponExpiryDate,
        },
        username: spawn.spawn(),
    }).then(() => {
        res.redirect(`/coupon`);
    }).catch(err => {
        console.log(err);
        res.status(404).send({
            coupons: [],
            err: err,
            msg: `Unable to create coupon.`,
            staffInfo: req.session.staff
        });
    });
};

exports.deleteCoupon = (req, res, next) => {
    coupons.findByIdAndDelete(req.params.couponId).then(() => {
        res.status(200).send({
            msg: `Successful`,
        });
    }).catch(err => {
        res.status(400).send({
            msg: `Error`,
        });
    });
};

exports.getList = (req, res, next) => {
    coupons.find({}).then(coupons => {
        res.status(200).send({ coupons });
    }).catch(() => {
        res.status(404).send({ coupons: [] });
    });
};

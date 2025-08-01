const Joi = require('joi');

module.exports.listingSchema= Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        images: Joi.string().allow("",null)
    }).required()
})
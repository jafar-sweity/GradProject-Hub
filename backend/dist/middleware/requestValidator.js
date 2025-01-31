const validateRequest = function (schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ errors: error.details.map((error) => error.message) });
        }
        next();
    };
};
export default validateRequest;
//# sourceMappingURL=requestValidator.js.map
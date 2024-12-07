export const productCreateValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name is required",
        },
        isString: {
            errorMessage: "Name should be a string",
        },
    },
    description: {
        notEmpty: {
            errorMessage: "Description is required",
        },
        isString: {
            errorMessage: "Description should be a string",
        },
    },
    categoryId: {
        notEmpty: {
            errorMessage: "Category is required",
        },
        isString: {
            errorMessage: "Category should be a string",
        },
    },
    price: {
        notEmpty: {
            errorMessage: "Price is required",
        },
        isInt: {
            errorMessage: "Price should be a number",
            options: {
                min: 0,
            },
        },
    },
    stock: {
        notEmpty: {
            errorMessage: "Stock is required",
        },
        isInt: {
            errorMessage: "Price should be a number",
            ptions: {
                min: 0,
            },
        },
    },
};

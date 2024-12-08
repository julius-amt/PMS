export const categoryCreationValidationSchema = {
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
};

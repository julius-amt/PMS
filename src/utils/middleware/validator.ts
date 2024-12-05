export const signupValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Name is required",
        },
        isString: {
            errorMessage: "Name should be a string",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isString: {
            errorMessage: "Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password should be at least 6 chars long",
        },
    },
    confirmPassword: {
        notEmpty: {
            errorMessage: "Confirm-Password is required",
        },
        isString: {
            errorMessage: "Confirm-Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Confirm-Password should be at least 6 chars long",
        },
    },
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
};

export const loginValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isString: {
            errorMessage: "Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password should be at least 6 chars long",
        },
    },
};

export const forgotPasswordValidationSchema = {
    email: {
        notEmpty: {
            errorMessage: "Email is required",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
};

export const resetPasswordValidationSchema = {
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isString: {
            errorMessage: "Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password should be at least 6 chars long",
        },
    },
    confirmPassword: {
        notEmpty: {
            errorMessage: "Confirm-Password is required",
        },
        isString: {
            errorMessage: "Confirm-Password should be a string",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Confirm-Password should be at least 6 chars long",
        },
    },
};

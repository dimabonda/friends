import { FC, useContext } from "react";
import { Box, Button, Typography, TextField, useMediaQuery, useTheme, CircularProgress, } from "@mui/material";
import { AuthLayout } from "@/components/AuthLayout";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import paths from '@/paths';
import { useResetPasswordMutation } from "@/state/api/authApi";
import { IUser } from "@/types/User";
import { IAuthError } from "@/types/Errors";

import { useToast } from "@/hooks/useToast";

interface IResetPasswordResponse {
    message: string;
}

const validationSchema = yup.object({
    email: yup.string().required("This field is required").email("Invalid email"),
});

const ResetPassword:FC = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
    const [resetPassword, {isLoading }] = useResetPasswordMutation();

    const { showToast} = useToast();

    const initialValues = {
        email: "",
        submit: null
    }

    const formik = useFormik({
        initialValues,
		validationSchema,
        // validateOnBlur: false,
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                const requestBody = {
                    email: values.email,
                };
                console.log('Request Body for password reset:', requestBody);
                const response: IResetPasswordResponse = await resetPassword(requestBody).unwrap();
                console.log('Password reset response:', response);
                // const user = response.user;
                // if(user && response.jwt && user.confirmed){
                //     localStorage.setItem('accessToken', response.jwt);
                //     navigate(paths.home);
                // } else if (user && user.email && !user.confirmed) {
                //     navigate('/confirmation', {
                //         state: {
                //           email: user.email,
                //           type: 'register',
                //         },
                //     });
                // }
                handleResetForm()
            } catch (err) {
                const error = err as IAuthError;
                showToast(error.data?.error?.message, 'error');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: error.data?.error?.message || "An error occurred" });
                helpers.setSubmitting(false);
            }
        }
    })

    const handleResetForm = () => {
        formik.resetForm()
    }

    return (
        <AuthLayout title="Reset your password">
            <form onSubmit={formik.handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                        "& > div": { gridColumn: isNonMobileScreen ? undefined : "span 4" },
                    }}
                >
                    <TextField
                        label="Email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        name="email"
                        error={
                            !!(formik.touched.email && formik.errors.email)
                        }
                        helperText={
                            formik.touched.email && formik.errors.email
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                </Box>

                  {/* BUTTONS */}
                  <Box>
                    <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m: "2rem 0",
                            p: "1rem",
                            backgroundColor: palette.primary.main,
                            color: palette.background.alt,
                            "&:hover": { color: palette.primary.dark },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: palette.background.alt }} /> : 'SEND'}
                    </Button>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default ResetPassword;
import { FC, useContext } from "react";
import { Box, Button, Typography, TextField, useMediaQuery, useTheme, CircularProgress, } from "@mui/material";
import { AuthLayout } from "@/components/AuthLayout";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import paths from '@/paths';
import { useLoginMutation } from "@/state/api/authApi";
import { IUser } from "@/types/User";
import { IAuthError } from "@/types/Errors";
import { useToast } from "@/hooks/useToast";
import FlexBetween from "@/components/FlexBetween";

interface ILoginResponse {
    jwt?: string;
    user: IUser;
}

const validationSchema = yup.object({
    email: yup.string().required("This field is required").email("Invalid email"),
    password: yup.string().required("This field is required").min(6, "Password must be at least 6 characters"),
});

const Login:FC = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
    const [login, {isLoading }] = useLoginMutation();

    const { showToast} = useToast();

    const initialValues = {
        email: "",
        password: "",
        submit: null
    }

    const formik = useFormik({
        initialValues,
		validationSchema,
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                const requestBody = {
                    identifier: values.email,
                    password: values.password,
                };
                const response: ILoginResponse = await login(requestBody).unwrap();
                const user = response.user;
                if(user && response.jwt && user.confirmed){
                    localStorage.setItem('accessToken', response.jwt);
                    navigate(paths.home);
                } else if (user && user.email && !user.confirmed) {
                    navigate('/confirmation', {
                        state: {
                          email: user.email,
                          type: 'register',
                        },
                    });
                }
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
        <AuthLayout>
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
                    <TextField
                        label="Password"
                        type="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        name="password"
                        error={
                            !!(formik.touched.password && formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
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
                        {isLoading ? <CircularProgress size={24} sx={{ color: palette.background.alt }} /> : 'LOGIN'}
                    </Button>
                    <FlexBetween>
                        <Typography
                            onClick={() => {
                                navigate(paths.auth.register);
                                handleResetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            Don't have an account? Sign Up here.
                        </Typography>
                        <Typography
                            onClick={() => {
                                navigate(paths.auth.resetPassword);
                                handleResetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                },
                            }}
                        >
                            Forgot your password? Reset it here.
                        </Typography>
                    </FlexBetween>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default Login;

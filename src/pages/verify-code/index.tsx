

import { FC, useEffect } from 'react';
import { Box, Button, Typography, TextField, useMediaQuery, useTheme, } from "@mui/material";
import { Navigate } from 'react-router-dom';

import { AuthLayout } from "@/components/AuthLayout";
import { useFormik } from "formik";
import { useNavigate, useLocation } from 'react-router-dom';
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import { IAuthError } from "@/types/Errors";
import VerificationInput from "react-verification-input";
import "./style.css";
import paths from '@/paths';
import { useConfirmUserMutation, useSentPinMutation } from '@/state/api/authApi';

const validationSchema = yup.object({
    code: yup.string().required("This field is required").min(6, "Code must be at least 6 characters"),
});

const VerifyCode: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const theme = useTheme();

    const email = location.state?.email;
    const type = location.state?.type;
    if (!email || !type) {
        return <Navigate to="/login" replace />;
    }

    const [confirmUser, {data}] = useConfirmUserMutation();
    const [sentPin] = useSentPinMutation();

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--input-border-color', theme.palette.neutral.main);
        root.style.setProperty('--input-focus-color', theme.palette.primary.main);
        root.style.setProperty('--input-text-color', theme.palette.neutral.dark);
      }, [theme]);

    const initialValues = {
        code: "",
        submit: null
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        // validateOnBlur: false,
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                const requestBody = {
                    pin: values.code,
                    email
                };
                const response = await confirmUser(requestBody).unwrap();
                if(response && response.jwt && response.user){
                    localStorage.setItem('accessToken', response.jwt);
                    navigate(paths.home);
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
    
    const resentCode = async () => {
        try {
            const requestBody = {
                email
            };
            const response = await sentPin(requestBody).unwrap();
            if(response && response.message){
                showToast(response.message, 'success');
            }
            handleResetForm()
        } catch (err) {
            const error = err as IAuthError;
            showToast(error.data?.error?.message, 'error');
        }
    }

//   React.useEffect(() => {
//     sessionStorage.removeItem("forgotPassword");
//   }, [])

    

    return (
        <AuthLayout>
            <form onSubmit={formik.handleSubmit}>

                <VerificationInput 
                    length={6}
                    placeholder={''}
                    classNames={{
                        container: "verification-input",
                        character: "verification-input__character",
                        characterInactive: "verification-input__character-inactive",
                        characterSelected: "verification-input__character-selected",
                        characterFilled: "verification-input__character-filled",
                    }}
                    onBlur={() => formik.setFieldTouched('code', true)}
                    onChange={(val) => formik.setFieldValue('code', val)}
                    value={formik.values.code}
                />

            </form>
            <Typography
                onClick={
                    resentCode
                }
                sx={{
                    m: "2rem 0 0",
                    textDecoration: "underline",
                    color: theme.palette.primary.main,
                    "&:hover": {
                    cursor: "pointer",
                    color: theme.palette.primary.dark,
                    },
                }}
            >
                Didn't receive the code? Resend
            </Typography>
        </AuthLayout>

  );
}

export default VerifyCode;
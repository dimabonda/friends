import { FC } from "react";
import { 
    Box, 
    Typography,
    TextField,
    Button,
    CircularProgress,
    FormHelperText,
    useMediaQuery, 
    useTheme 
} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "@/components/FlexBetween";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { AuthLayout } from "@/components/AuthLayout";
import paths from '@/paths';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRegisterMutation } from "@/state/api/authApi";
import { setCredentials } from "@/state/slices/authSlice";
import { useToast } from "@/hooks/useToast";
import { IAuthError } from "@/types/Errors";


const validationSchema = yup.object({
    firstName: yup.string().required("This field is required"),
    lastName: yup.string().required("This field is required"),
    email: yup.string().required("This field is required").email("Invalid email"),
    password: yup.string().required("This field is required").min(6, "Password must be at least 6 characters"),
    location: yup.string().required("This field is required"),
    occupation: yup.string().required("This field is required"),
    photo: yup
        .mixed<File>()
        .required("A photo is required")
        .test("fileType", "Unsupported file format", (value) => {
            return value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }),
});


const Register:FC = () => {
    const theme = useTheme();
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [register, {isLoading, isSuccess, isError, data}] = useRegisterMutation()
    const isNonMobileScreen = useMediaQuery("(min-width: 600px)");

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        location: "",
        occupation: "",
        photo: null as File | null,
        submit: null
    }

    const formik = useFormik({
        initialValues,
		validationSchema,
        // validateOnBlur: false,
        onSubmit: async (values, helpers): Promise<void> => {
            try {

                const formData = new FormData();
                formData.append("firstName", values.firstName);
                formData.append("lastName", values.lastName);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("location", values.location);
                formData.append("occupation", values.occupation);
                if(values.photo){
                    formData.append("photo", values.photo);
                }
                const response = await register(formData).unwrap();
                if(response && response.jwt && response.user){
                    localStorage.setItem('accessToken', response.jwt); 
                    navigate(paths.home);
                }
                
                showToast(response.message, 'success');
                handleResetForm();
            } catch (err) {
                const error = err as IAuthError;
                showToast(error.data?.error?.message, 'error');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: error.data?.error?.message || "An error occurred" });
                helpers.setSubmitting(false);

                console.error("Registration Error: ", error);
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
                        label="First Name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                        name="firstName"
                        error={
                            !!(formik.touched.firstName && formik.errors.firstName)
                        }
                        helperText={
                            formik.touched.firstName && formik.errors.firstName
                        }
                        sx={{ gridColumn: "span 2" }}
                    />
                     <TextField
                        label="Last Name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                        name="lastName"
                        error={
                            !!(formik.touched.lastName && formik.errors.lastName)
                        }
                        helperText={
                            formik.touched.lastName && formik.errors.lastName
                        }
                        sx={{ gridColumn: "span 2" }}
                    />
                    
                   
                    <TextField
                        label="Location"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.location}
                        name="location"
                        error={
                            !!(formik.touched.location && formik.errors.location)
                        }
                        helperText={
                            formik.touched.location && formik.errors.location
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Occupation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.occupation}
                        name="occupation"
                        error={
                            !!(formik.touched.occupation && formik.errors.occupation)
                        }
                        helperText={
                            formik.touched.occupation && formik.errors.occupation
                        }
                        sx={{ gridColumn: "span 4" }}
                    />
                    <Box gridColumn="span 4">
                        <Box

                            border={`1px solid ${!!(formik.touched.photo && formik.errors.photo) ? "#d32f2f" : palette.neutral.medium }`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    formik.setFieldValue("photo", acceptedFiles[0]);
                                }}
                                accept={{
                                    "image/jpeg": [],
                                    "image/png": [],
                                    "image/jpg": []
                                }}
                                multiple={false}
                            >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ 
                                            "&:hover": { cursor: "pointer" }, 
                                            backgroundColor: isDragActive ? palette.primary.light : "transparent"
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {!formik.values.photo ? (
                                            <Typography>Add Picture Here</Typography>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{formik.values.photo.name}</Typography>
                                                <EditOutlinedIcon />
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Box>
                        {!!(formik.touched.photo && formik.errors.photo) ? 
                            <FormHelperText sx={{color: "#d32f2f", mx: "14px"}}>{formik.touched.occupation && formik.errors.occupation}</FormHelperText> : null}
                    </Box>
                    

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
                        "&:hover": { color: palette.primary.main },
                    }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: palette.background.alt }} /> : 'REGISTER'}
                    </Button>
                    <Typography
                        onClick={() => {
                            navigate(paths.auth.login);
                            handleResetForm();
                        }}
                        sx={{
                            textDecoration: "underline",
                            color: palette.primary.main,
                            "&:hover": {
                            cursor: "pointer",
                            color: palette.primary.light,
                            },
                        }}
                    >
                        Already have an account? Login here.
                    </Typography>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default Register;
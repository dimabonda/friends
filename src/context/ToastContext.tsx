import { createContext } from "react";
import { AlertColor } from "@mui/material";

type ToastContextType = {
    showToast: (message: string, severity: AlertColor) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);


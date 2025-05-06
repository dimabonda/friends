import { forwardRef, useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { styled } from '@mui/material';

export const StyledSimpleBar = styled(SimpleBar)(({ theme }) => {
    const { palette } = theme;
    const main = palette.neutral.main;

    return {
        '.simplebar-track': {
            backgroundColor: 'transparent',
        },
        '.simplebar-scrollbar:before': {
            width: '5px',
            backgroundColor: `${main}`,
        },
    }
});

interface CustomScrollProps {
    maxHeight: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    onScroll?: (e: Event) => void;
}

export const CustomScroll = forwardRef<HTMLDivElement, CustomScrollProps>(
    ({ maxHeight, children, style, onScroll }, ref) => {

        const simpleBarRef = useRef<any>(null);

        useEffect(() => {
            const scrollElement = simpleBarRef.current?.getScrollElement();

            if (scrollElement && onScroll) {
                scrollElement.addEventListener('scroll', onScroll);
                return () => scrollElement.removeEventListener('scroll', onScroll);
            }
        }, [onScroll]);

        return (
            <div
                ref={ref}
                style={{ maxHeight, overflow: 'hidden', ...style }}
            >
                <StyledSimpleBar style={{ maxHeight: maxHeight }} ref={simpleBarRef}>
                    {children}
                </StyledSimpleBar>
            </div>
        );
    }
);
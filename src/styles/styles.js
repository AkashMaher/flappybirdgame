export const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    img: {
        width: '100%',
        height: 'auto',
        transition: 'transform 0.5s',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
    imgContainer: {
        padding: theme.spacing(2),
        position: 'relative',
    },
    highlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1,
        opacity: 0,
        transition: 'opacity 0.5s',
        '&:hover': {
            opacity: 1,
        },
    },
}));
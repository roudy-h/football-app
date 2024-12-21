import React, { forwardRef } from 'react';
import TextField from '@mui/material/TextField';

const styles = {
    backgroundColor: 'white',
    width: '300px',
};

/**
 * Composant Input pour les formulaires
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre du champ
 * @param {string} props.type - Le type du champ
 * @param {React.Ref} ref - La référence du champ
 */
const Input = forwardRef(function Input(props, ref) {
    return (
        <TextField
            id={props.title}
            className="TextField"
            style={styles}
            label={props.title}
            variant="outlined"
            type={props.type}
            inputRef={ref}
        />
    );
});

export default Input;
import React from 'react'
import './Button.css';

const STYLES = ['btn--primary','btn--outline'];
const SIZES =['btn--medium','btn--small','btn--smallGoals','btn--xs','btn--goal','btn--goalSmaller','btn--large', 'btn--mobile','btn--wide'];
const COLOR = ['primary', 'blue','green','red','maroon'];

export const Button = ({children, type, onClick, buttonStyle, buttonSize, buttonColor}) =>{
    const checkButtonStyle = STYLES.includes(buttonStyle) ?
    buttonStyle : STYLES[0];

    const checkButtonSize = SIZES.includes(buttonSize) ?
    buttonSize : SIZES[0];

    const checkButtonColor = COLOR.includes(buttonColor) ?
    buttonColor : null;
    return(
        <button
      className={`btn ${checkButtonStyle} ${checkButtonSize} ${checkButtonColor}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
    )
}
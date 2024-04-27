import { MouseEventHandler, ReactNode } from 'react';
import { Button } from '@material-tailwind/react';

export default function RoundedButton({
  buttonColor,
  buttonBorderColor,
  buttonIcon,
  buttonText,
  buttonTextColor,
  buttonShape,
  imgRight,
  children,
  onClick,
  disabled,
  type,
}) {
  return (
    <Button
      onClick={onClick}
      style={{
        //backgroundColor: buttonColor,
        // color: buttonTextColor,
        width: 'max-content',
      }}
      type={type || 'button'}
      // color='black'
      className={`rounded-full !border ${buttonColor} ${buttonBorderColor} !normal-case ${buttonTextColor} hover:opacity-50 active:brightness-150  hover:shadow-none focus:shadow-none shadow-none `}
      size='sm'
      ripple={false}
      disabled={disabled || false}
    >
      <div className='flex justify-between items-center gap-1'>
        {children}
        {buttonIcon}
        {buttonText}
        {imgRight}
      </div>
    </Button>
  );
}

'use client';

import {IconType} from "react-icons";
import React from "react";

interface ButtonProps {
  label: string;
  disable?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disable,
  outline,
  small,
  custom,
  icon: Icon,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disable}
      className={`
      disabled:opacity-70
      disabled:cursor-not-allowed
      rounded-md
      hover:opacity-80
      w-full
      border-slate-700
      flex
      items-center
      justify-center
      gap-2
      ${outline ? "bg-white" : "bg-slate-700"}
      ${outline ? "text-slate-700": "text-white"}
      ${small ? "text-sm font-light" : "text-md font-semibold"}
      ${small ? "py-1 px-3 border-[1px]" : "py-3 px-4 border-2"}
      ${custom ? custom : ""}
    `}>
      {Icon && <Icon size={24}/>}
      {label}
    </button>
  )
}

export default Button;
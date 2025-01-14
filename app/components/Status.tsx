import {IconType} from "react-icons";
import React from "react";

interface StatusProps {
  text: string;
  icon: IconType;
  bg?: string;
  color: string;

}

const Status: React.FC<StatusProps> = ({text, icon: Icon, bg, color}) => {
  return (
    <div className={`${color} py-1 rounded flex items-center justify-center gap-1`}>
      {text} <Icon size={18} />
    </div>
  );
}

export default Status;

import Link from "next/link";
import React from "react";

function SidebarOption({ link, title, Icon }) {
  return (
    <Link href={link}>
      <span className="flex items-center space-x-2 hover:text-white cursor-pointer">
        {Icon && <Icon className="w-5 h-5" />}
        {Icon ? <h4>{title}</h4> : <p>{title}</p>}
      </span>
    </Link>
  );
}

export default SidebarOption;

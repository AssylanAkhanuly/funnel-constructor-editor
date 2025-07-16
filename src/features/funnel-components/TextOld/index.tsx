import { HTMLAttributes } from "react";

function Text({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`font-inter ${className}`}>
      {children}
    </div>
  );
}

export default Text;

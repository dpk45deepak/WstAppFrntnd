import { Link, type LinkProps } from "react-router-dom";
import Button from "./Button";
import type { ReactNode } from "react";

interface LinkButtonProps
  extends Omit<LinkProps, "type" | "className"> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

const LinkButton = ({
  children,
  size,
  variant,
  fullWidth,
  loading,
  className,
  ...linkProps
}: LinkButtonProps) => {
  return (
    <Link {...linkProps} className="inline-block">
      <Button
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        loading={loading}
        className={className}
        type="button" // ✅ explicitly safe
      >
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;

import Image from "next/image";

export function PlanItLogo({
  size = 40,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/planit-logo.png"
      alt="Plan-it"
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}

import logo from "@/assets/jakas-logo.png?inline";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="JAKAS" className={cn("h-10 w-auto", className)} />;
}

export function LogoText({ className }: { className?: string }) {
  return <span className={cn("font-display text-3xl font-extrabold tracking-tight text-brand", className)}>JAKAS</span>;
}

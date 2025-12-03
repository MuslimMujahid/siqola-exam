import { Spinner } from "./spinner";
import { cn } from "@/lib/utils/cn";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading = ({ text, fullScreen, className }: LoadingProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "min-h-screen",
        className
      )}
    >
      <Spinner size="lg" />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export { Loading };

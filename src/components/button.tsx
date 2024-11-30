
import type {ReactNode} from "react";
import classNames from "classnames";

export default function Button({
    href,
    action,
    enabled=true,
    glow=false,
    children,
}: {
    href?: string,
    action?: () => void,
    enabled?: boolean,
    glow?: boolean,
    children: ReactNode;
}) {
    const classes = [
        "p-4",
        "rounded-lg",
        "font-bold",
        "text-center",
        "select-none",
        "uppercase",
        "text-lg",
        "transition-shadow",
        "duration-150",
        glow
            ? ["shadow-glow",
                "shadow-cyan-500"]
            : [],
        enabled
            ? ["text-stone-100",
                "bg-ellipse-gradient",
                "from-stone-700",
                "from-0%",
                "to-stone-800",
                "to-100%",
                "hover:text-stone-50",
                "hover:from-stone-600",
                "hover:to-stone-800",
                "cursor-pointer"]
            : ["text-stone-600",
                "bg-stone-700",
                "cursor-default"],
    ];

    return enabled && href
        ? <a href={href} className={classNames(classes)}>{children}</a>
        : <span onClick={enabled ? action : () => {}} className={classNames(classes)}>{children}</span>;
}

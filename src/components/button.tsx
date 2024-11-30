
import type {ReactNode} from "react";
import classNames from "classnames";

export default function Button({
    href,
    action,
    enabled=true,
    children,
}: {
    href?: string,
    action?: () => void,
    enabled?: boolean,
    children: ReactNode;
}) {
    const classes = [
        "p-4",
        "rounded",
        "font-bold",
        "text-center",
        "select-none",
        "uppercase",
        "text-lg",
        enabled
            ? ["text-stone-100", "bg-stone-700", "hover:text-stone-50", "hover:bg-stone-600", "cursor-pointer"]
            : ["text-stone-600", "bg-stone-700", "cursor-default"],
    ];

    return enabled && href
        ? <a href={href} className={classNames(classes)}>{children}</a>
        : <span onClick={enabled ? action : () => {}} className={classNames(classes)}>{children}</span>;
}

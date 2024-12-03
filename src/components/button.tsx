
import type {ReactNode} from "react";
import classNames from "classnames";

/**
 * A simple button. Can be a link or an action.
 */
export default function Button({
    href,
    action,
    enabled=true,
    glow=false,
    emoji,
    children,
}: {
    href?: string,
    action?: () => void,
    enabled?: boolean,
    glow?: boolean,
    emoji?: string,
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
        "flex",
        "items-center",
        "justify-center",
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

    if (!enabled) {
        action = () => {};
    }

    let emojiNode = undefined;
    if (emoji !== undefined) {
        emojiNode = <span className="relative ml-4">
            <span className="text-3xl absolute translate-y-[-50%]">
                {emoji}
            </span>
        </span>;
    }

    if (enabled && href) {
        return <a href={href} className={classNames(classes)}>
            {children}
            {emojiNode}
        </a>;
    } else {
        return <span onClick={action} className={classNames(classes)}>
            {children}
            {emojiNode}
        </span>;
    }
}

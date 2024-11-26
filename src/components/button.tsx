
import {ReactNode} from "react";

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
    const commonClasses = "p-4 rounded font-bold text-center";
    const colorClasses = enabled
        ? "text-white bg-teal-400 hover:bg-teal-300"
        : "text-gray-300 bg-gray-400";

    return enabled && href
        ? <a href={href} className={commonClasses + " " + colorClasses}>{children}</a>
        : <span onClick={enabled ? action : () => {}} className={commonClasses + " " + colorClasses + " cursor-pointer select-none"}>{children}</span>;
}

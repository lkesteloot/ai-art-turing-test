import Button from "./button";
import classNames from "classnames";
import {ReactNode} from "react";

export default function CheckedButton({
                           action,
                           checked,
                           children,
                       }: {
    action: () => void,
    checked: boolean,
    children: ReactNode,
}) {
    return <Button action={action}>
        <div className="flex items-center">
            <span className={classNames(
                "text-3xl",
                "transition-opacity",
                {
                    "opacity-10": !checked,
                }
            )}>✓</span>
            <span className="text-lg grow">{children}</span>
        </div>
    </Button>;
}

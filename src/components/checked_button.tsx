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
    return <Button action={action} glow={checked}>
        <div className="flex items-center">
            <span className={classNames(
                "text-3xl",
                "transition-all",
                {
                    "opacity-10": !checked,
                    "text-cyan-500": checked,
                    "text-glow": checked,
                }
            )}>✓</span>
            <span className={classNames(
                "grow",
                "transition-all",
                "duration-75",
                {
                    "text-glow": checked,
                }
            )}>{children}</span>
        </div>
    </Button>;
}

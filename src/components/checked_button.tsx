import Button from "./button";
import classNames from "classnames";
import {ReactNode} from "react";

/**
 * A button that can have a checkmark on it.
 */
export default function CheckedButton({
                           action,
                           checked,
                           emoji,
                           children,
                       }: {
    action: () => void,
    checked: boolean,
    emoji?: string,
    children: ReactNode,
}) {
    return <Button action={action} glow={checked} emoji={emoji}>
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
    </Button>;
}

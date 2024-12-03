import type {ReactNode} from "react";

/**
 * A row of buttons, all the same size.
 */
export default function Buttons({ children } : { children: ReactNode }) {
    return (
        <nav className="grid gap-4 justify-center" style={{
            gridAutoColumns: "minmax(0, 1fr)",
            gridAutoFlow: "column",
        }}>
            {children}
        </nav>
    );
}

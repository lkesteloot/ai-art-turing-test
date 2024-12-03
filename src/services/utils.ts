
const ORDINAL_SUFFIXES = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
]);

const ORDINAL_PLURAL_RULES = new Intl.PluralRules("en-US", { type: "ordinal" });

/**
 * Given a number, return the ordinal version of it (e.g., 22 will return "22nd").
 */
export function getOrdinalNumber(n: number): string {
    const rule = ORDINAL_PLURAL_RULES.select(n);
    const suffix = ORDINAL_SUFFIXES.get(rule);

    return `${n}${suffix}`;
}

/**
 * Get the sum of the numbers in the array.
 */
export function arraySum(a: number[]): number {
    return a.reduce((sum, value) => sum + value, 0);
}

/**
 * Scroll smoothly to the node with the given selector.
 */
export function scrollToSelector(selector: string): void {
    const node = document.querySelector(selector);
    node?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

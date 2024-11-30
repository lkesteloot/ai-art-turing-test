
const ORDINAL_SUFFIXES = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
]);

const ORDINAL_PLURAL_RULES = new Intl.PluralRules("en-US", { type: "ordinal" });

export function temporarilyDisableSnap() {
    document.documentElement.classList.remove("snap-y");
    setTimeout(() => {
        document.documentElement.classList.add("snap-y");
    }, 1000);
}

export function getOrdinalNumber(n: number): string {
    const rule = ORDINAL_PLURAL_RULES.select(n);
    const suffix = ORDINAL_SUFFIXES.get(rule);

    return `${n}${suffix}`;
}

export function arraySum(a: number[]): number {
    return a.reduce((sum, value) => sum + value, 0);
}

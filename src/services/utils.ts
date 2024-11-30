
export function temporarilyDisableSnap() {
    document.documentElement.classList.remove("snap-y");
    setTimeout(() => {
        document.documentElement.classList.add("snap-y");
    }, 1000);
}

export function extensions(ext: string): string[] {
    const exts: string[] = ext
        .split(",")
        .map((item) => {
            item = item.trim();
            return item && item.length > 0 ? item : false;
        })
        .filter(Boolean) as string[];
    const argumentsList: string[] = process.argv.slice(2);
    return argumentsList
        .map((item) => {
            return exts.some((extItem) => {
                return item.endsWith("." + extItem);
            })
                ? item
                : false;
        })
        .filter(Boolean) as string[];
}

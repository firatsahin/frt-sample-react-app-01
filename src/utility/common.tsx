import AppSettings from "../data/AppSettings";

const setTitle = (title: string | null): void => {
    document.title = (title ? title + ' | ' : '') + AppSettings.seoTitle;
}

export { setTitle }
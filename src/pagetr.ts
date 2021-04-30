import * as vscode from 'vscode'

export const PageTrPreviewScheme = "pagetr-preview";

export function getPageTrUri(uri: vscode.Uri) {
    if (uri.scheme === PageTrPreviewScheme) {
        return uri
    }

    return uri.with({
        scheme: PageTrPreviewScheme,
        path: uri.path + ".tr",
        query: uri.toString()
    });
}

export function isPageTrFile(document:vscode.TextDocument) {
    return document.languageId === 'page-tr'
        && document.uri.scheme !== PageTrPreviewScheme
}
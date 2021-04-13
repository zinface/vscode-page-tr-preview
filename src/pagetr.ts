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


// ; 时间信息
const TrData = "$$date"
// ; 注释
const Comment = '.\\"'
const TrComment = "$$comment"

// ; 标题
const Title = ".TH"
const TrTitle = "$$title"

// ; 节点
const SubTitle = ".SH "
const TrSubTitle = "$$subtitle"

// ; 子节点
const SubSection = ".SS "
const TrSubSection = "$$section"

// ; 节点内容
const SubContent = ".B "
const TrSubContent = "$$subcontent"

// ; 节点内容说明：起始-结束
const ContentBegin = ".RS"
const ContentEnd   = ".RE"
const TrContentBegin = "$$cbegin"
const TrContentEnd   = "$$cend"

// ; 内容字体控制，Bold, Italic, Roman
const FontBold = "\\fB"
const TrFontBold= "$$fb"

const FontItalic = "\\fI"
const TrFontItalic = "$$fi"

const FontRoman = "\\fR"
const TrFontRoman = "$$fr"

const FontEnd = "\\fR"
const TrFontEnd = "$$fe"

export class PageTrManTask {
    static format(temp:string, old:string, now :string): string {
        let temps= temp.split('\n')
        let content:string = ""
        temps.forEach((v)=>{
            content = content + v.trimLeft().replace(old,now) + "\n"
        })
        return content
    }

    private static formatMan(temp: string) {
        // spawn("page-tr")
        // temp = format(temp, TrData, timeObj.String())
        temp = PageTrManTask.format(temp, TrComment, Comment)
        temp = PageTrManTask.format(temp, TrTitle, Title)
        temp = PageTrManTask.format(temp, TrSubTitle, SubTitle)
        temp = PageTrManTask.format(temp, TrSubSection, SubSection)
        temp = PageTrManTask.format(temp, TrSubContent, SubContent)
        temp = PageTrManTask.format(temp, TrContentBegin, ContentBegin)
        temp = PageTrManTask.format(temp, TrContentEnd, ContentEnd)
        temp = PageTrManTask.format(temp, TrFontBold, FontBold)
        temp = PageTrManTask.format(temp, TrFontItalic, FontItalic)
        temp = PageTrManTask.format(temp, TrFontRoman, FontRoman)
        temp = PageTrManTask.format(temp, TrFontEnd, FontEnd)
        return temp
    }

    static getMan(temp:string) {
        return `<HTML><BODY><PRE>${this.formatMan(temp)}</PRE></BODY></HTML>`
    }

    static getHtml(temp:string) {
        return helloHtml;
    }
}

const helloHtml:string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Tr</title>
</head>
<body>
    <h1>Hello, Page-Tr Preview!</h1>
</body>
</html>`;
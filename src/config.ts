
export class ManConfig {
    // ; 时间信息
    static TrData = "$$date"
    // ; 注释
    static Comment = '.\\"'
    static TrComment = "$$comment"

    // ; 标题
    static Title = ".TH"
    static TrTitle = "$$title"

    // ; 节点
    static SubTitle = ".SH "
    static TrSubTitle = "$$subtitle"

    // ; 子节点
    static SubSection = ".SS "
    static TrSubSection = "$$subsection"

    // ; 节点内容
    static SubContent = ".B "
    static TrSubContent = "$$subcontent"

    // ; 节点内容说明：起始-结束
    static ContentBegin = ".RS"
    static ContentEnd   = ".RE"
    static TrContentBegin = "$$cbegin"
    static TrContentEnd   = "$$cend"

    // ; 内容字体控制，Bold, Italic, Roman
    static FontBold = "\\fB"
    static TrFontBold= "$$fb"
    static FontItalic = "\\fI"
    static TrFontItalic = "$$fi"
    static FontRoman = "\\fR"
    static TrFontRoman = "$$fr"
    static FontEnd = "\\fR"
    static TrFontEnd = "$$fe"


    // ; Code Block
    static TrCodeBegin = "$$decode"
    static TrCodeEnd = "$$encode"
}

export class HtmlConfig {

    static Comment = '<!-- $1 -->'
    static TrComment = '.\\"'

    static Title = `\
  <p>
    <span>$1</span>
    <span>$2</span>
    <span>$3</span>
  </p>`
    static TrTitle = ".TH"
    
    static SubTitle = '<b>$1</b>'
    static TrSubTitle = ".SH"

    static SubSection = '<b>$1</b>'
    static TrSubSection = ".SS"

    static SubContent = "<strong>$1</strong>"
    static TrSubContent = ".B"

    // ; 节点内容说明：起始-结束
    static ContentBegin = '<section style="margin-left:4%">'
    static ContentEnd   = '</section>'
    static TrContentBegin = ".RS"
    static TrContentEnd   = ".RE"

    // ; 内容字体控制，Bold, Italic, Roman
    static FontBold = "<b>"
    static FontBoldEnd = "</b>"
    static FontItalic = "<i>"
    static FontItalicEnd = "</i>"
    static FontRoman = ""
    static FontEnd = ""

    // ; 扩展部分
    static HtmlSectionBegin = '<section style="margin-left:8%;">'
    static HtmlSectionEnd = "</section>"

    static TrHtmlCodeBegin = '$$encode'
    static TrHtmlCodeEnd = '$$decode'
    static HtmlCodeBegin = '<pre>'
    static HtmlCodeEnd = '</pre>'
}
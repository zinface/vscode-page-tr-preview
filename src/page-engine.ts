import { HtmlConfig, ManConfig } from "./config"
import { escapePageTrString, escapeString, pairToTuple, Tuple, unescapePageTrString } from "./page-tr-preview"
import { GetDate } from "./utils"

function format(temp:string, old:string | RegExp, now:string): string {
    return temp.split(old).join(now)
}

const Unknow = "Unknow"

function tstr(tag:number = 0) {
    if (tag == 0) return ""
    
    let str = ""

    while(tag > 0) {
        str = "    " + str
        tag -= 1
    }
    return str
}

export class RenderHtml {
    
    static sectionTag = 0;

    /**
     * 内容特征检查(Comment,Title,SubTitle,SubSection,SubContent)
     * @param params 
     * @returns 
     */
    static starWith(params:string):Tuple<string, string, boolean, unknown, unknown> {
        if (params.trimLeft().indexOf(HtmlConfig.TrComment) == 0)return pairToTuple({key:HtmlConfig.TrComment, html:HtmlConfig.Comment, isBeginOrEnd: false, isBeginST:false, isBeginSC:false});
        if (params.trimLeft().indexOf(HtmlConfig.TrTitle) == 0)return pairToTuple({key:HtmlConfig.TrTitle, html:HtmlConfig.Title, isBeginOrEnd: false, isBeginST:false, isBeginSC:false});
        if (params.trimLeft().indexOf(HtmlConfig.TrSubTitle) == 0)return pairToTuple({key:HtmlConfig.TrSubTitle, html:HtmlConfig.SubTitle, isBeginOrEnd: true, isBeginST:true, isBeginSC:false});
        if (params.trimLeft().indexOf(HtmlConfig.TrSubSection) == 0)return pairToTuple({key:HtmlConfig.TrSubSection, html:HtmlConfig.SubSection, isBeginOrEnd: true, isBeginST:true, isBeginSC:false});
        if (params.trimLeft().indexOf(HtmlConfig.TrSubContent) == 0)return pairToTuple({key:HtmlConfig.TrSubContent, html:HtmlConfig.SubContent, isBeginOrEnd: false, isBeginST:false, isBeginSC:true});
        // code block
        if (params.trimLeft().indexOf(HtmlConfig.TrHtmlCodeBegin) == 0)return pairToTuple({key:HtmlConfig.TrHtmlCodeBegin, html:HtmlConfig.HtmlCodeBegin, isBeginOrEnd: false, isBeginST:false, isBeginSC:true});
        if (params.trimLeft().indexOf(HtmlConfig.TrHtmlCodeEnd) == 0)return pairToTuple({key:HtmlConfig.TrHtmlCodeEnd, html:HtmlConfig.HtmlCodeEnd, isBeginOrEnd: false, isBeginST:false, isBeginSC:true});

        return pairToTuple({key:Unknow,html:Unknow,isBeginOrEnd:false,isBeginST:false,isBeginSC:false})
    }

    /**
     * 渲染注释(.\") - Comment
     * @param params 
     */
    static RenderComment(params:string) {
        // return tuple.html.replace("$1", line.replace(tuple.key, "").trim())
        let tuple = this.starWith(params)
        if (tuple.key == ManConfig.Comment) {
            let comment = params.replace(tuple.key,"").trim()
            // comment = escapeString(comment)
            params = tuple.html.replace("$1", comment)
        }
        return params
    }

    /**
     * 渲染头部标题(.TH) - The Header
     * @param params 
     */
    static RenderTheHeader(params:string) {
        let tuple = this.starWith(params)
        
        if (tuple.key == HtmlConfig.TrTitle) {
            let title = params.replace(tuple.key, "").trim().split(" ")
            params = tuple.html.replace("$1", title[0])
                      .replace("$2", title[title.length-1])
                      .replace("$3", title[0])
        }
        return params
    }

    /**
     * 渲染副标题(.SH) - Sub Header
     * @param params 
     */
    static RenderSubHeader(params:string) {
        let tuple = this.starWith(params)

        if (tuple.key == HtmlConfig.TrSubTitle) {
            let subtitle = params.replace(tuple.key, "").trim()
            params = tuple.html.replace("$1", subtitle)
            if (RenderHtml.sectionTag == 1) {
                let pre = ""
                pre += HtmlConfig.HtmlSectionEnd
                pre += '\n'

                params = pre + tstr(RenderHtml.sectionTag - 1) + params 
                params += '\n'
                params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            }
            RenderHtml.sectionTag = 1
        }
        return params
    }
    
    /**
     * 渲染子节点(.SS) - Sub Section
     * @param params 
     */
    static RenderSubSection(params:string) {
        let tuple = this.starWith(params)

        if (tuple.key == HtmlConfig.TrSubSection) {
            let subsection = params.replace(tuple.key, "").trim()
            params = tuple.html.replace("$1", subsection)
            if (RenderHtml.sectionTag == 2) {
                let pre = "<br/>"
                pre += HtmlConfig.HtmlSectionEnd
                pre += '\n'

                params = pre + tstr(RenderHtml.sectionTag - 1) + params
                params += '\n'
                params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            }
            RenderHtml.sectionTag = 2
        }
        return params
    }

    /**
     * 渲染子节点(.B)
     * @param params 
     */
    static RenderSubContent(params:string) {
        let tuple = this.starWith(params)

        if (tuple.key == HtmlConfig.TrSubContent) {
            let subcontent = params.replace(tuple.key, "").trim()
            params = tuple.html.replace("$1", subcontent)
            // if (RenderHtml.sectionTag == 3) {
            //     let pre = ""
            //     pre += HtmlConfig.HtmlSectionEnd
            //     pre += '\n'

            //     params = pre + tstr(RenderHtml.sectionTag - 1) + params
            //     params += '\n'
            //     params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            // }
            // RenderHtml.sectionTag = 3
        }
        return params
    }

    /**
     * 渲染复杂内容
     * @param params 
     */
    static RenderContent(params:string) {
        let prefix = params.trimLeft();

        if (prefix.startsWith(HtmlConfig.TrContentBegin)) {
            let begin = tstr(1) + params.replace(HtmlConfig.TrContentBegin, HtmlConfig.ContentBegin).trim();
            params = begin;
        }

        if (prefix.startsWith(HtmlConfig.TrContentEnd)) {
            let end = tstr(1)+ params.replace(HtmlConfig.TrContentEnd, HtmlConfig.ContentEnd).trim();
            params = end;
        }
        return params
    }

    /**
     * 特殊内容字符处理
     * @param params 
     */
    static RenderCharacter(params:string) {

        return params
    }

    /**
     * 渲染字体设置
     * @param params 源内容
     * @param fs 源控制符
     * @param fts 控制符起始
     * @param fte 控制符结束
     * @returns 
     */
    static RenderFont(params:string, fs:string, fts:string, fte:string) {
        let re = RegExp(fs.replace("\\","\\\\")+"(?:([^\\\\fR]*)\\\\fR)")
        let ft = re.exec(params)
        if (ft instanceof Array) {
            let src = ft[0].toLocaleString()
            return params.replace(src,src.replace(fs,fts).replace("\\fR",fte).replace("\\fe",fte))
        }
        return params
    }

    /**
     * 
     * @param params 
     */
    static RenderCode(params:string) {
        // []
    }

    /**
     * 渲染所有基本部分
     * @param params 
     */
    static RenderLine(params:string) {
        let tag = RenderHtml.sectionTag
        
        params = this.RenderFont(params, ManConfig.FontBold, HtmlConfig.FontBold, HtmlConfig.FontBoldEnd)
        params = this.RenderFont(params, ManConfig.FontItalic, HtmlConfig.FontItalic, HtmlConfig.FontItalicEnd)
        params = this.RenderFont(params, ManConfig.FontRoman, HtmlConfig.FontRoman, HtmlConfig.FontEnd)
        
        if (params !== undefined) {
            params = this.RenderComment(params)
            params = this.RenderTheHeader(params)
            params = this.RenderSubHeader(params)
            params = this.RenderSubSection(params)
            params = this.RenderSubContent(params)
            params = this.RenderContent(params)
        }
        
        /**
         * <section>
         *     <section>
         *     <h3>ASDSD</h3>
         *         <section>
         *         </section>
         *     </section>
         * </section>
         */
        
        if (RenderHtml.sectionTag > tag) {
            if (tag < RenderHtml.sectionTag - 1) {
                let pre = ""
                while (tag < RenderHtml.sectionTag) {
                    pre += tstr(tag) + HtmlConfig.HtmlSectionBegin + '\n'
                    tag += 1
                }
                params = pre + tstr(tag-1) + params
                params += '\n'
                params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            } else {
                params = tstr(tag) + params
                params += '\n'
                params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            }
        } else if (RenderHtml.sectionTag < tag) {
            // params =  tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionEnd + '\n' + tstr(RenderHtml.sectionTag-1) + params + '\n' + tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
            let pre = "<br/>"
            while (tag >= RenderHtml.sectionTag) {
                pre +=  tstr(tag) + HtmlConfig.HtmlSectionEnd
                pre += '\n'
                tag -= 1
            }
            params = pre + params
            params += '\n' 
            params += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionBegin
        } else {
            params = tstr(RenderHtml.sectionTag) + params
        }
        return params
     }

    static Render(temp:string) {

        RenderHtml.sectionTag = 0;
        let content = ""

        let codeblock = false;

        temp.split("\n").forEach(line => {
            if (this.starWith(line).key == HtmlConfig.TrHtmlCodeBegin) {
                codeblock = true;
                content += this.starWith(line).html + "\n"
                return
            }

            if (this.starWith(line).key == HtmlConfig.TrHtmlCodeEnd) {
                codeblock = false;
                content += this.starWith(line).html + "\n"
                return
            }

            if (codeblock) {
                content += line + "\n"
                return
            }

            let t = this.RenderLine(line)
            if (RegExp("^[ ]*$").test(t)) {
                t = '<br/><br/>'
            }
            content += t + "\n"
        });

        while (RenderHtml.sectionTag >= 0) {
            content += tstr(RenderHtml.sectionTag) + HtmlConfig.HtmlSectionEnd
            content += '\n'
            RenderHtml.sectionTag -= 1
        }

        return content
    }
}


// Page-Tr ---> Unix ManPage
class PageFormerMan {

    static generateSpace(rsi: number) {
        let spaces = ""
        for (let index = 0; index < rsi; index++) {
            spaces += " "
        }
        return spaces
    }
    
    static formatMan(temp: string) {
        let temps = temp.split("\n")
        temp = ""
        let codeblock = false
        let left_code_space = 255;
        temps.forEach(element => {
            if (RenderHtml.starWith(element).key == HtmlConfig.TrHtmlCodeBegin) {
                let rs = element.split(RegExp("^[ ]*"))[1]
                left_code_space = element.indexOf(rs);
                codeblock = true
                temp += element + "\n"
                return
            }
            if (RenderHtml.starWith(element).key == HtmlConfig.TrHtmlCodeEnd) {
                codeblock = false
                temp += element + "\n"
                return
            }
            // 代码块预览缩进调整
            if (codeblock){
                if (element.split(RegExp("^[ ]*")).length > 1){
                    let rs = element.split(RegExp("^[ ]*"))[1]
                    let rsi = element.indexOf(rs);
                    if (rsi >= left_code_space) {
                        element = PageFormerMan.generateSpace(rsi - left_code_space) + element.trimLeft()
                    }
                }
                
                temp += element + "\n"

                return
            }
            let src = element.trimLeft()

            src = format(src, ManConfig.TrData, GetDate())
            src = format(src, ManConfig.TrComment, ManConfig.Comment)
            src = format(src, ManConfig.TrTitle, ManConfig.Title)
            src = format(src, ManConfig.TrSubTitle, ManConfig.SubTitle)
            src = format(src, ManConfig.TrSubSection, ManConfig.SubSection)
            src = format(src, ManConfig.TrSubContent, ManConfig.SubContent)
            src = format(src, ManConfig.TrContentBegin, ManConfig.ContentBegin)
            src = format(src, ManConfig.TrContentEnd, ManConfig.ContentEnd)
            src = format(src, ManConfig.TrFontBold, ManConfig.FontBold)
            src = format(src, ManConfig.TrFontItalic, ManConfig.FontItalic)
            src = format(src, ManConfig.TrFontRoman, ManConfig.FontRoman)
            src = format(src, ManConfig.TrFontEnd, ManConfig.FontEnd)

            temp += src + "\n"
        });
        return temp
    }

    static getMan(temp:string) {
        temp = format(format(temp, HtmlConfig.TrHtmlCodeBegin, ""), HtmlConfig.TrHtmlCodeEnd, "")
        return `<HTML><BODY><PRE>${temp}</PRE></BODY></HTML>`
    }

}

// Page-Tr ---> Mozillia Web Html
class PageFormerHtml {

    static formatHtml(temp:string) {
        return RenderHtml.Render(temp)
    }

    static getHtml(temp:string) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <section>
                ${temp}
            </section>
            <style>
                p:first-of-type{
                    margin-bottom: 15px;
                    text-align: center;
                }
                p:first-of-type span:first-child {
                    float: left;
                }
                p:first-of-type span:last-child  {
                    float: right;
                }
            </style>
        </body>
        </html>
        `
    }
}
  
export class PageTransformer {
    static PageForUnixMan(content:string) {
        return PageFormerMan.getMan(escapeString(PageFormerMan.formatMan(content)))    
    }

    static PageTempUnixMan(content:string) {
        return PageFormerMan.formatMan(content)
    }

    static PageForWebHtml(content:string) {
        return PageFormerHtml.getHtml(
            PageFormerHtml.formatHtml(PageFormerMan.formatMan(unescapePageTrString(escapeString(escapePageTrString(content).split("\\").join("")))))
        )
    }

    static PageTempHtml(content:string) {
        return PageFormerHtml.formatHtml(PageFormerMan.formatMan(unescapePageTrString(escapeString(escapePageTrString(content).split("\\").join(""))))).split("\\\\").join("\\")
    }
}
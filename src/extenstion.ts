import * as vscode from 'vscode'
import {isPageTrFile, PageTrManTask} from './pagetr'

const PreviewTypeMan = "PreviewTypeMan"
const PreviewTypeHtml = "PreviewTypeHtml"

class PageTrPreviewView {

    public static currentPreviewType: string = PreviewTypeMan
    public static currentView: PageTrPreviewView | undefined;
    public static currentViewstatus: vscode.Disposable | undefined

    private readonly _uri: vscode.Uri
    private readonly _panel: vscode.WebviewPanel;
    private readonly _webview: vscode.Webview

    public static ChangeView(uri?: vscode.Uri) {
        PageTrPreviewView.currentPreviewType = 
            PageTrPreviewView.currentPreviewType == PreviewTypeMan?PreviewTypeHtml:PreviewTypeMan;
        PageTrPreviewView.currentView?._update();
        PageTrPreviewView.currentView?._showStatus(true);
    }

    public static OpenPreview(uri?: vscode.Uri) {
        let resource = uri;
        if (!(resource instanceof vscode.Uri)) {
            if (vscode.window.activeTextEditor) {
                if (vscode.window.activeTextEditor.document.languageId !== 'page-tr') {
                    vscode.window.showInformationMessage("This Editor is not a Page-tr Editor!!")
                    return;
                }
                resource = vscode.window.activeTextEditor.document.uri;
            } else {
                vscode.window.showInformationMessage("Not Found Page-tr Editor!!")
                return;
            }
        }

        // 接受vscode激活指令，如已存在该View，将直接显示
        if (PageTrPreviewView.currentView) {
            vscode.window.showInformationMessage("Page-Tr Preview window is actived.")
            PageTrPreviewView.currentView._panel.reveal();
            return;
        }

        PageTrPreviewView.currentPreviewType = PreviewTypeMan
        PageTrPreviewView.currentView =  new PageTrPreviewView(resource)
    }
    
    constructor(uri: vscode.Uri) {
        const panel = vscode.window.createWebviewPanel(
            'page-tr',
            'PageTr Preview',
            {
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: false
            },
            {},
        )
        this._uri = uri
        this._panel = panel;
        this._webview = this._panel.webview
        this._update()
        this._showStatus()

        // vscode 编辑器 page-tr 内容变更时
        vscode.workspace.onDidChangeTextDocument(event => {
            if (isPageTrFile(event.document)){
                this._update(event.document.uri)
            }
        })

        // 接受vscode变更选中编辑器时
        vscode.window.onDidChangeActiveTextEditor(editor=>{
            if (editor!! && isPageTrFile(editor.document)) {
                this._update(editor.document.uri)
            }
        })
        
        // 接受vscode销毁指令动作
        this._panel.onDidDispose(()=>{
            vscode.window.showInformationMessage("Page-Tr Preview window is closed.")
            PageTrPreviewView.currentView = undefined
            this._panel.dispose();
            PageTrPreviewView.currentViewstatus?.dispose()
        }, null)
    }

    private _showStatus(chage:boolean = false) {
        if (chage) {
            PageTrPreviewView.currentViewstatus?.dispose()
        }
        PageTrPreviewView.currentViewstatus = vscode.window.setStatusBarMessage('预览模式('+ (PageTrPreviewView.currentPreviewType == PreviewTypeMan?"Unix Man":"Html")+")")
    }

    private _update(uri?:vscode.Uri) {
        if (PageTrPreviewView.currentPreviewType == PreviewTypeMan) {
            // vscode.window.showInformationMessage("渲染..")
            vscode.workspace.openTextDocument(uri?uri:this._uri).then(document => {
                this._webview.html = PageTrManTask.getMan(document.getText())
            })
        } else {
            vscode.workspace.openTextDocument(uri?uri:this._uri).then(document => {
                this._webview.html = PageTrManTask.getHtml(document.getText());
            })
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('page-tr.sidePreview', PageTrPreviewView.OpenPreview))
    context.subscriptions.push(vscode.commands.registerCommand('page-tr.switch', PageTrPreviewView.ChangeView))
}

export function deactivated(){ }
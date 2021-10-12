"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const service_1 = require("./service");
const path = require("path");
let cursorArr = ['0'];
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('fish.read', () => {
        // 创建并显示新的webview
        const panel = vscode.window.createWebviewPanel('read', // 只供内部使用，这个webview的标识
        'index.ts', // 给用户显示的面板标题
        vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
        { enableScripts: true,
            retainContextWhenHidden: true,
        } // Webview选项。我们稍后会用上
        );
        panel.iconPath = vscode.Uri.file(path.resolve(context.extensionPath, "./icon/icon.png"));
        panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
        }), undefined, context.subscriptions);
        panel.webview.html = `
          <!DOCTYPE html>
							<html lang="en">
							<head>
								<meta charset="UTF-8">
								<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
								<meta content="portrait" name="x5-orientation">
								<meta content="true" name="x5-fullscreen">
								<meta content="portrait" name="screen-orientation">
								<meta content="yes" name="full-screen">
								<meta content="webkit" name="renderer">
								<meta content="IE=Edge" http-equiv="X-UA-Compatible">
								<style>
								html,body,iframe{
									width:100%;
									height:100%;
									border:0;
									overflow: hidden;
								}
								</style>
							</head>
							<body>
								<iframe src="https://weread.qq.com/"/>
							</body>
							</html>`;
    }));
    context.subscriptions.push(vscode.commands.registerCommand('fish.juejin', () => {
        // 创建并显示新的webview
        const panelTest = vscode.window.createWebviewPanel('juejin', // 只供内部使用，这个webview的标识
        'index.ts', // 给用户显示的面板标题
        vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
        { enableScripts: true,
            retainContextWhenHidden: true,
        } // Webview选项。我们稍后会用上
        );
        panelTest.iconPath = vscode.Uri.file(path.resolve(context.extensionPath, "./icon/icon.png"));
        panelTest.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            if (message.text) {
                vscode.window.showWarningMessage(message.text);
                return;
            }
            let res = {};
            if (message.refresh) {
                cursorArr = ['0'];
            }
            ;
            switch (message.type) {
                case 'comment':
                    yield service_1.postComment(message.id, panelTest.webview, message.cursor);
                    break;
                case 'next':
                    res = yield service_1.postMain(cursorArr[message.page], panelTest.webview, message.category);
                    cursorArr.push(res.cursor);
                    break;
                case 'pre':
                    res = yield service_1.postMain(cursorArr[message.page], panelTest.webview, message.category);
                    cursorArr.pop();
                    break;
            }
        }), undefined, context.subscriptions);
        panelTest.webview.html = `
          <!DOCTYPE html>
							<html lang="en">
							<head>
							<meta charset="UTF-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<title>掘金-沸点</title>
								<style>
								html,body{
									border:0;
									overflow: auto;
									position: relative;
									height:100%;
								}
								.category{
									display:flex;
									align-items:center;
									position:fixed;
									padding:20px;
									top:0;
									left:0;
									background: var(--vscode-editor-background);
                                    width: 100%;
									justify-content: space-around;
								}
								.cateItem{
								  cursor:pointer;
								}
								.active {
									color:#007fff;
								}
								.pageAction,.pageComment {
                                  cursor:pointer;
								  margin-left:10px;
								  margin-top:10px;
								  color:#1d7dfa;
								}
								.userContent {
									display: flex;
									margin-bottom:10px
								}
								.userImg {
									width: 60px;
									height: 60px;
									border-radius:50%
								}
								.commentImg {
									width: 40px;
									height: 40px;
									border-radius:50%
								}
								.loadingImg {
									position: absolute;
									width:50%;
									height:50%;
									top:25%;
									left:25%;
								}
								.comment {
									display: flex;
									align-items: center;
									cursor:pointer;
									padding:10px;
								}
								.openComment {
									display:block;
								}
								.closeComment {
									display: none;
								}								
								</style>
							</head>
							<body>
							<div id="category"></div>
							<div id="list" style="margin-top:58px"></div>
							
						
							<script>
							const loadingImg="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimglf4.nosdn.127.net%2Fimg%2FTlZUM042dE1hMk1Lc0hxanFoY3JEeU9teVlkeDMyZkY4MEpEaks3S2ZuRUJCTVd0QWNUTzh3PT0.gif%3FimageView&refer=http%3A%2F%2Fimglf4.nosdn.127.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631266185&t=dcd476cf2a861da58cfd98ba19655719"
							let pageNum = 0;
							let vscode = acquireVsCodeApi();
                            let curCategory = 'recommend';
							let list = document.getElementById("list");
							let category = document.getElementById("category");
							category.innerHTML = \`<div class="category">
							<span class="cateItem" id="cateItem1" onclick="changeCategory('recommend','cateItem1')">推荐</span>
							<span class="cateItem" id="cateItem2" onclick="changeCategory('hot','cateItem2')">热门</span>
							<span class="cateItem" id="cateItem3" onclick="changeCategory('6824710203301167112','cateItem3')">上班摸鱼</span>
							<span class="cateItem" id="cateItem4" onclick="changeCategory('6824710203112423437','cateItem4')">树洞一下</span>
							<span class="cateItem" id="cateItem5" onclick="changeCategory('6819970850532360206','cateItem5')">内推招聘</span>
							<span class="cateItem" id="cateItem6" onclick="changeCategory('6824710202562969614','cateItem6')">今天学到了</span>
							<span class="cateItem" id="cateItem7" onclick="changeCategory('6824710202487472141','cateItem7')">一图胜千言</span>
							<span class="cateItem" id="cateItem8" onclick="changeCategory('6824710202378436621','cateItem8')">每日算法题</span>
							<span class="cateItem" id="cateItem9" onclick="changeCategory('6824710202000932877','cateItem9')">开发工具推荐</span>
						  </div>\`
						  changeCategory('recommend','cateItem1');
							init({type:'next', page: 0,category:curCategory})

							function init(val) {
								list.innerHTML = \`<img class="loadingImg" src=\${loadingImg} alt="loading"/>\`
								vscode.postMessage(val)
							}
							function formatSeconds(value) { 
								 var theTime = parseInt(value);
								 var theTime1 = 0;// 分 
								 var theTime2 = 0;// 小时 
								 var theTime3 = 0;// 天
								 if(theTime > 60) { 
								  theTime1 = parseInt(theTime/60); 
								  theTime = parseInt(theTime%60); 
								  if(theTime1 > 60) { 
								   theTime2 = parseInt(theTime1/60); 
								   theTime1 = parseInt(theTime1%60); 
								   if(theTime2 > 24){
								    //大于24小时
								    theTime3 = parseInt(theTime2/24);
								    theTime2 = parseInt(theTime2%24);
								   }
								  } 
								 } 
								 var result = '';
								 if(theTime3 > 0) { 
									result = parseInt(theTime3)+"天前"; 
							     }
								 if(theTime2 > 0&&!theTime3) { 
									result = parseInt(theTime2)+"小时前"; 
								 } 
								 if(theTime1 > 0&&!theTime3&&!theTime2) { 
								  result = parseInt(theTime1)+"分钟前"; 
								 } 								
  							      return result; 
								}
							function prePage() {
								if (pageNum===0) {
									vscode.postMessage({text:'已经是第一页了哦~'});
									return;
								}
								list.innerHTML = \`<img class="loadingImg" src=\${loadingImg} alt="loading"//>\`
								vscode.postMessage({type:'pre', page: --pageNum,category:curCategory});
							}
							function nextPage() {
								list.innerHTML = \`<img class="loadingImg" src=\${loadingImg} alt="loading"//>\`
								vscode.postMessage({type:'next', page: ++pageNum,category:curCategory });
							}
							// 放大缩小图片
							function imageZoomInAndOut() {
							  document.querySelectorAll(".picture").forEach((pictureEl) => {
								function zoomIn() {
								  pictureEl.style["width"] = "500px";
								  pictureEl.style["cursor"] = "zoom-out";
								  pictureEl.onclick = zoomOut;
								}
								function zoomOut() {
								  pictureEl.style["width"] = "200px";
								  pictureEl.style["cursor"] = "zoom-in";
								  pictureEl.onclick = zoomIn;
								}
								pictureEl.style.cursor = "zoom-in";
								pictureEl.style["width"] = "200px";
								pictureEl.onclick = zoomIn;
							  });
							}
						    function changeCategory(val,e) {
								document.querySelectorAll(".active").forEach((el)=>{
									el.className = "caseItem";
									el.style['cursor']='pointer';
								})
								let caseItem = document.getElementById(e);
								caseItem.style['cursor']='pointer';
								caseItem.className = "active";
								curCategory = val;
								pageNum = 0;
								init({type:'next', page: 0 ,category:val,refresh:'refresh'});
								
							}
							
							window.addEventListener("message", (event) => {
							 
							  const message = event.data;
							  if (message.type==='comment') {
							    let item = document.getElementById(message.id);
								item.scrollTop = 0;

								let itemStr = ''
                                message.data.forEach((el)=>{
									const {comment_info,user_info,reply_infos} = el;
									const imgSrc = user_info.avatar_large.slice(0,-5) + 'png'
									const newTime = (new Date().getTime() - comment_info.ctime * 1000)/1000;
									let replyStr = '';
									reply_infos.forEach((i)=>{
										const { reply_info,reply_user,user_info:replyUser } = i;
									const replySrc = replyUser.avatar_large.slice(0,-5) + 'png'

									  const replyTime = (new Date().getTime() - reply_info.ctime * 1000)/1000;
										replyStr += \` <div style="display: flex;margin-bottom:10px;margin-left:50px;">
										<img  src= \${replySrc} class="commentImg" />
										<div style="margin-left:10px;">
										  <div style="color:cornflowerblue">
										   \${replyUser.user_name} \${i.is_author&&'(作者)'} 
										   \${reply_user.user_name && \`<span style="color:#fff">回复</span> \${reply_user.user_name}\`} | <span style="color:#8a9aa9;">\${formatSeconds(replyTime)}</span>
										  </div>
										  <div style="padding:8px 0">\${i.reply_info.reply_content}</div>
										</div>
										</div>\`
									  
									})
									itemStr += \`<div style="display: flex;margin-bottom:10px">
									  <img  src= \${imgSrc} class="commentImg" />
									  <div style="margin-left:10px;">
									    <div style="color:cornflowerblue">\${user_info.user_name} | <span style="color:#8a9aa9;">\${user_info.job_title}</span> | <span style="color:#8a9aa9;">\${formatSeconds(newTime)}</span></div>
									    <div style="padding:8px 0">\${comment_info.comment_content}</div>
									  </div>
									  </div>
									 \${replyStr}
									  \`
								})
								if (message.count>20){
									itemStr += \`<span count=\${message.count} cursor=\${message.preCursor-20} itemId=\${message.id} class="pageComment">上一页</span>
									<span count=\${message.count} class="pageComment" cursor=\${message.cursor} itemId=\${message.id}>下一页</span>\`
								   
								}
								item.innerHTML = itemStr;
								document.querySelectorAll(".pageComment").forEach((el)=>{
									function nextCommentPage(value) {
										const cursor = value.target.attributes.cursor.value
										const count = value.target.attributes.count.value;
										if (count==cursor) {
											vscode.postMessage({
												text:'最后一页了哦～'
											});
											return;
										}
										if (cursor<0) {
											vscode.postMessage({
												text:'已经是第一页了哦～'
											});
											return;
										}
										vscode.postMessage({
											type:'comment', 
											id:value.target.attributes.itemId.value,
											cursor
										});
									}
								  el.onclick = nextCommentPage
								})
							  } 
							 if (message.type==='recommend') {
								// 回到顶部
								document.body.scrollTop = document.documentElement.scrollTop = 0;
								let listStr = ''
								message.data.forEach((item) => {
								  const { author_user_info: user, msg_Info: info,topic} = item;
								  const newTime = (new Date().getTime() - info.mtime * 1000)/1000;
								  listStr += \`
								  <div style="display: flex;margin-bottom:10px">
													   <img src=\${user.avatar_large} class="userImg"/>
													   <div style="margin-left:10px;flex:1">
														   <div style="font-size: 1.25rem;font-weight: 600;color: lightseagreen;">\${user.user_name}</div>
														   <div style="color:#8a9aa9;margin-top:5px;">\${user.job_title||user.company} . \${formatSeconds(newTime)}</div>
														   <div style="padding:10px 0">\${info.content}</div>
														   <div>\${(info.pic_list || []).map((el) => \`<img class="picture" margin-left:10px" src=\${el} />\`).join('')}</div>
														   <div style="color:#1d7dfa">#\${topic.title}#</div>
														   <div>
															  <div class="comment" msgid=\${info.msg_id}>
																  <img msgid=\${info.msg_id} src="https://gw.alicdn.com/imgextra/i2/O1CN01MYEzhX1bEomtApbo2_!!6000000003434-2-tps-16-16.png"/>
																  <span msgid=\${info.msg_id} style="margin-left:10px">\${info.comment_count}</span>
															  </div>
														   </div>
														   <div id=\${info.msg_id}></div>
													   </div>
												   </div>\`;
								
								});		  
							
								list.innerHTML = listStr + \`<div style="margin-bottom:24px;">
								<span class="pageAction" onclick="prePage()">上一页</span>
								<span class="pageAction"  onclick="nextPage()">下一页</span>
							</div>\`;
							  imageZoomInAndOut()
							  document.querySelectorAll(".comment").forEach((el)=>{
								function openComment(value) {
								    let comment = document.getElementById(value.target.attributes.msgid.value);
									comment.style["display"] = "block";
									comment.style["max-height"] = "600px";
									comment.style["overflow"] = "auto";
								    el.onclick = closeComment;
									vscode.postMessage({type:'comment', id: value.target.attributes.msgid.value});
								}
								function closeComment(value) {
								   let comment = document.getElementById(value.target.attributes.msgid.value);
									comment.style["display"] = "none";
								    el.onclick = openComment;
								}
								el.onclick = openComment;
							})

							 }
							});
						  </script>
							</body>
							</html>`;
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function data(arg0, data, arg2) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=extension.js.map
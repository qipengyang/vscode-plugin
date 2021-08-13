import * as vscode from 'vscode';
import * as axios from "axios";
import { postMain,postComment } from './service';
import * as path from "path";

const cursorArr:any[] = ['0'];
export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(
		vscode.commands.registerCommand('fish.start', () => {
		  // 创建并显示新的webview
		  const panel = vscode.window.createWebviewPanel(
			'fishtext', // 只供内部使用，这个webview的标识
			'index.ts', // 给用户显示的面板标题
			vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
			{ enableScripts: true,
		      retainContextWhenHidden: true,
			} // Webview选项。我们稍后会用上
		  );
		  panel.iconPath = vscode.Uri.file(
			path.resolve(context.extensionPath, "./icon/icon.png")
		  );
		panel.webview.onDidReceiveMessage(
			async (message) => {
			},
			undefined,
			context.subscriptions
		  );
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
								<iframe src="https://juejin.cn/pins/recommended"/>
							</body>
							</html>`;
		})
	  );
	  context.subscriptions.push(
		vscode.commands.registerCommand('fish.test', () => {
		  // 创建并显示新的webview
		  const panelTest = vscode.window.createWebviewPanel(
			'fishtest', // 只供内部使用，这个webview的标识
			'index.ts', // 给用户显示的面板标题
			vscode.ViewColumn.One, // 给新的webview面板一个编辑器视图
			{ enableScripts: true,
		      retainContextWhenHidden: true,
			} // Webview选项。我们稍后会用上
		  );
		  panelTest.iconPath = vscode.Uri.file(
			path.resolve(context.extensionPath, "./icon/icon.png")
		  );
		panelTest.webview.onDidReceiveMessage(
			async (message) => {
             if (message.text) {
				vscode.window.showWarningMessage(message.text);
				return;
			 }
        let res:any={};
		if (message.type==='comment') {
		const result = await postComment(message.id,panelTest.webview);
		} else {
		 res =	await postMain(cursorArr[message.page],panelTest.webview);

		}
		if (message.type==='next') {
		cursorArr.push(res.cursor);
		} 
		if (message.type==='pre') {
			cursorArr.pop();
	    } 
			},
			undefined,
			context.subscriptions
		  );
		  panelTest.webview.html = `
          <!DOCTYPE html>
							<html lang="en">
							<head>
							<meta charset="UTF-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<title>掘金-沸点</title>
								<style>
								html,body{
									width:100%;
									height:100%;
									border:0;
									overflow: auto;
									position: relative;
								}
								.pageAction {
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
									justify-content: center;
									width:33%;
									cursor:pointer;
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
							<div id="list"></div>
							
						
							<script>
							const loadingImg="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimglf4.nosdn.127.net%2Fimg%2FTlZUM042dE1hMk1Lc0hxanFoY3JEeU9teVlkeDMyZkY4MEpEaks3S2ZuRUJCTVd0QWNUTzh3PT0.gif%3FimageView&refer=http%3A%2F%2Fimglf4.nosdn.127.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631266185&t=dcd476cf2a861da58cfd98ba19655719"
							let pageNum = 0;
							let vscode = acquireVsCodeApi();
							console.log('init---------')
							let list = document.getElementById("list");
							init()

							function init() {
								list.innerHTML = \`<img class="loadingImg" src=\${loadingImg} alt="loading"/>\`
								vscode.postMessage({type:'next', page: 0 })
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
								vscode.postMessage({type:'pre', page: --pageNum});
							}
							function nextPage() {
								list.innerHTML = \`<img class="loadingImg" src=\${loadingImg} alt="loading"//>\`
								vscode.postMessage({type:'next', page: ++pageNum });
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
						
							window.addEventListener("message", (event) => {
							 
							  const message = event.data;
							  if (message.type==='comment') {
							    let item = document.getElementById(message.id);
								console.log(String(message.id),'item',message.id)
								let itemStr = ''
                                message.data.forEach((el)=>{
									const {comment_info} = el;
									itemStr += \`<div>
									  <img class="userImg"/>
									  <div></div>
									  </div>\`
								})
								item.innerHTML = itemStr;
							  } 
							 if (message.type==='recommend') {
								// 回到顶部
								document.body.scrollTop = document.documentElement.scrollTop = 0;
								let listStr = ''
								message.data.forEach((item) => {
								  const { author_user_info: user, msg_Info: info,topic} = item;
								  const newTime = (new Date().getTime() - info.mtime * 1000)/1000;
								  listStr += \`<div style="display: flex;margin-bottom:10px">
													   <img src=\${user.avatar_large} class="userImg"/>
													   <div style="margin-left:10px;">
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
									comment.style["height"] = "600px";
									console.log('id---------',value.target.attributes.msgid.value)
								    el.onclick = closeComment;
									vscode.postMessage({type:'comment', id: value.target.attributes.msgid.value});
								}
								function closeComment(value) {
								   let comment = document.getElementById(value.target.attributes.msgid.value);
									comment.style["height"] = "0px";
									comment.style["display"] = "none";
									console.log('id---------',value.target.attributes.msgid.value)
								    el.onclick = openComment;
								}
								el.onclick = openComment;
							})

							 }
							});
						  </script>
							</body>
							</html>`;
		})
	  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
function data(arg0: string, data: any, arg2: {}) {
	throw new Error('Function not implemented.');
}




  import { Webview } from "vscode";
import  axios from "axios";

  export async function postMain(page:string,
    webview: Webview
  ) {
    const res = await axios({
        url:'https://api.juejin.cn/recommend_api/v1/short_msg/recommend',
        method:'POST',
        headers:{contentType: JSON},
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data:{"id_type":4,"sort_type":300,"cursor":page,"limit":20}
    });
    let resultData = { type:'recommend',data:  res.data.data};
    // TODO: 如果传递 webview.postMessage 会报错
    webview.postMessage(resultData);
    return res.data;
  }
  export async function postComment(id:string,
    webview: Webview
  ) {
    const res = await axios({
        url:'https://api.juejin.cn/interact_api/v1/comment/list',
        method:'POST',
        headers:{contentType: JSON},
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data:{"item_id":"6995349940926939172","item_type":4,"cursor":"0","limit":20,"client_type":2608}
    });
    let resultData = { type:'comment',data:  res.data.data,id};
    webview.postMessage(resultData);
    return res.data;
  }
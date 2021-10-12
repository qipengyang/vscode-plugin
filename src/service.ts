

  import { Webview } from "vscode";
import  axios from "axios";

  export async function postMain(page:string,
    webview: Webview,category: string = 'recommend'
  ) {
    const params:any ={};
    switch (category) {
      case 'recommend':
        params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/recommend';
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params.data = {"id_type":4,"sort_type":300,"cursor":page,"limit":20};
        break;
      case 'hot':
        params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/hot';
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params.data = {"id_type":4,"sort_type":200,"cursor":page,"limit":20};
        break;
      default:
        params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/topic';
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params.data = {"id_type":4,"sort_type":200,"cursor":page,"limit":20,topic_id:category};
        break;
    }
    const res = await axios({
       ...params,
        method:'POST',
        headers:{contentType: JSON},
    });
    let resultData = { type:'recommend',data:  res.data.data};
    webview.postMessage(resultData);
    return res.data;
  }
  export async function postComment(id:string,
    webview: Webview,cursor:string = '0'
  ) {
    const res = await axios({
        url:'https://api.juejin.cn/interact_api/v1/comment/list',
        method:'POST',
        headers:{contentType: JSON},
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data:{"item_id":String(id),"item_type":4,"cursor":String(cursor),"limit":20,"client_type":2608,sort:0}
    });
    
    let resultData = { type:'comment',data: res.data.data,id,count:res.data.count,cursor:res.data.cursor,preCursor:cursor};
    webview.postMessage(resultData);
    return res.data;
  }
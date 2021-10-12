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
exports.postComment = exports.postMain = void 0;
const axios_1 = require("axios");
function postMain(page, webview, category = 'recommend') {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {};
        switch (category) {
            case 'recommend':
                params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/recommend';
                // eslint-disable-next-line @typescript-eslint/naming-convention
                params.data = { "id_type": 4, "sort_type": 300, "cursor": page, "limit": 20 };
                break;
            case 'hot':
                params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/hot';
                // eslint-disable-next-line @typescript-eslint/naming-convention
                params.data = { "id_type": 4, "sort_type": 200, "cursor": page, "limit": 20 };
                break;
            default:
                params.url = 'https://api.juejin.cn/recommend_api/v1/short_msg/topic';
                // eslint-disable-next-line @typescript-eslint/naming-convention
                params.data = { "id_type": 4, "sort_type": 200, "cursor": page, "limit": 20, topic_id: category };
                break;
        }
        const res = yield axios_1.default(Object.assign(Object.assign({}, params), { method: 'POST', headers: { contentType: JSON } }));
        let resultData = { type: 'recommend', data: res.data.data };
        webview.postMessage(resultData);
        return res.data;
    });
}
exports.postMain = postMain;
function postComment(id, webview, cursor = '0') {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default({
            url: 'https://api.juejin.cn/interact_api/v1/comment/list',
            method: 'POST',
            headers: { contentType: JSON },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            data: { "item_id": String(id), "item_type": 4, "cursor": String(cursor), "limit": 20, "client_type": 2608, sort: 0 }
        });
        let resultData = { type: 'comment', data: res.data.data, id, count: res.data.count, cursor: res.data.cursor, preCursor: cursor };
        webview.postMessage(resultData);
        return res.data;
    });
}
exports.postComment = postComment;
//# sourceMappingURL=service.js.map
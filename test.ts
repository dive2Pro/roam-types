// 导入类型定义以启用全局类型
import './index';
import type { QueryResult, PullResult } from './roam-alpha-api';


// RoamAlphaAPI 挂载在 window 上，可以直接使用
const api = window.roamAlphaAPI;

// 使用 data API 进行查询
// QueryResult 是元组数组，每个元组对应 :find 子句中的变量
const results: QueryResult = api.data.q(
    '[:find ?uid ?string :where [?b :block/uid ?uid] [?b :block/string ?string]]'
);
// results 类型: [["uid1", "string1"], ["uid2", "string2"], ...]
console.log('Query results:', results);

// 使用 data API 进行 pull
// PullResult 是包含请求属性的对象
const block: PullResult = api.data.pull('[*]', [':block/uid', 'abc123']);
// block 类型: BlockAttributes，包含所有块属性如 :block/uid, :block/string 等
console.log('Block:', block);

// Pull 嵌套结构示例
const blockWithChildren: PullResult = api.data.pull(
    '[:block/string {:block/children ...}]',
    [':block/uid', 'abc123']
);
// 返回包含 :block/string 和嵌套的 :block/children 数组的对象
console.log('Block with children:', blockWithChildren);


// 使用 async API (推荐用于新扩展)
api.data.async.q('[:find ?uid :where [?b :block/uid ?uid]]')
    .then(asyncResults => console.log('Async results:', asyncResults[0]));

// 使用 UI API
const focusedBlock = api.ui.getFocusedBlock();
console.log('Focused block:', focusedBlock);
// 使用 util API
const uid = api.util.generateUID();
console.log('Generated UID:', uid);

// 使用 platform API
if (api.platform.isDesktop) {
    console.log('Running on desktop');
}

// 使用 graph API
console.log('Graph name:', api.graph.name);
console.log('Graph type:', api.graph.type);
console.log('Is encrypted:', api.graph.isEncrypted);

// 使用 user API
const userUid = api.user.uid();
console.log('User UID:', userUid);
console.log('Is admin:', api.user.isAdmin());

window.roamAlphaAPI.data.q('[:find ?uid :where [?b :block/uid ?uid]]');

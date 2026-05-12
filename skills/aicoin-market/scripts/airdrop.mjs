#!/usr/bin/env node
// AiCoin Airdrop (OpenData) CLI
import { apiGet, cli } from '../lib/aicoin-api.mjs';

cli({
  // 综合查询：同时查 airdrop(交易所空投) + drop_radar(链上早期项目)，一次调用返回全部数据
  all: async ({ page_size, status, keyword, lan } = {}) => {
    const ps = page_size || '20';
    const [airdrop, radar] = await Promise.all([
      apiGet('/api/upgrade/v2/content/airdrop/list', { source: 'all', page_size: ps, ...(lan ? { lan } : {}) }).catch(e => ({ error: e.message, list: [] })),
      apiGet('/api/upgrade/v2/content/drop-radar/list', { page_size: ps, ...(status ? { status } : {}), ...(keyword ? { keyword } : {}), ...(lan ? { lan } : {}) }).catch(e => ({ error: e.message, list: [] })),
    ]);
    return {
      交易所空投: { count: airdrop.data?.count || 0, list: airdrop.data?.list || [] },
      链上早期项目: { count: radar.data?.count || 0, list: radar.data?.list || [] },
    };
  },
  list: ({ source, status, page, page_size, exchange, activity_type, lan } = {}) => {
    const p = {};
    if (source) p.source = source;
    if (status) p.status = status;
    if (page) p.page = page;
    if (page_size) p.page_size = page_size;
    if (exchange) p.exchange = exchange;
    if (activity_type) p.activity_type = activity_type;
    if (lan) p.lan = lan;
    return apiGet('/api/upgrade/v2/content/airdrop/list', p);
  },
  detail: async ({ type, token, lan } = {}) => {
    if (!type || !token) {
      return {
        success: false,
        errorCode: 400,
        error: 'airdrop detail 必填 type + token (从 list 返回项里拿)',
      };
    }
    const p = { type, token };
    if (lan) p.lan = lan;
    try {
      return await apiGet('/api/upgrade/v2/content/airdrop/detail', p);
    } catch (e) {
      // 实测: 三种 type+token 组合 (xlaunch+airdropId / launchpad+BTC / airdrop+BTC) 都返 500
      // "Failed to get airdrop detail"。给 agent 明确提示这是上游故障,别让用户改参数。
      if (/^API 5\d\d/.test(e.message)) {
        return {
          success: false,
          errorCode: 500,
          error: e.message,
          实测结论: 'airdrop detail 当前后端不稳: 多种参数组合实测都返 500。请告知用户"该详情接口暂时不可用,可改用 list/banner/calendar 看简要信息,或联系 AiCoin 客服 (service@aicoin.com) 报修"。',
        };
      }
      throw e;
    }
  },
  banner: ({ limit, lan } = {}) => {
    const p = {};
    if (limit) p.limit = limit;
    if (lan) p.lan = lan;
    return apiGet('/api/upgrade/v2/content/airdrop/banner', p);
  },
  exchanges: ({ lan } = {}) => {
    const p = {};
    if (lan) p.lan = lan;
    return apiGet('/api/upgrade/v2/content/airdrop/exchanges', p);
  },
  calendar: ({ year, month, lan } = {}) => {
    // 实测: year+month 必填,不传上游 400。默认填当前月,免去 agent 算月份。
    const now = new Date();
    const y = year || String(now.getFullYear());
    const m = month || String(now.getMonth() + 1);
    const p = { year: y, month: m };
    if (lan) p.lan = lan;
    return apiGet('/api/upgrade/v2/content/airdrop/calendar', p);
  },
});

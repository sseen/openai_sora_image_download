// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @description  try to take over the world!
// @author       You
// @match        https://sora.com/library
// @require      http://tampermonkey.net/tampermonkey.min.js  // 确保 Tampermonkey 支持
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    console.log('FindAndDownloadOpenAIAssets_NoRepeat script has started');

    let foundUrls = [];
    // 用一个全局变量缓存已经下载过的文件名（避免重复下载）
    // 注意：它的值会在脚本初始化时从 GM_getValue 获取
    let downloadedSet = new Set();

    // --- 脚本初始化：从存储中加载已下载文件名 ---
    (async function initDownloadedSet() {
        // 这里第二个参数是默认值，若存储里没有就返回空数组
        const downloadedList = await GM_getValue('downloadedFiles', []);
        downloadedSet = new Set(downloadedList);
        console.log('已从存储加载已下载文件名，共', downloadedSet.size, '个');
    })();

    window.addEventListener('load', function() {
        // 1) 创建固定容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '20px';
        container.style.bottom = '20px';
        container.style.zIndex = '9999999';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '8px';
        document.body.appendChild(container);

        // 2) 定义通用样式
        const style = document.createElement('style');
        style.textContent = `
            .download-openai-btn {
                padding: 10px 16px;
                font-size: 14px;
                cursor: pointer;
                background-color: #6200ee;
                color: #ffffff;
                border: none;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                transition: background-color 0.3s ease;
            }
            .download-openai-btn:hover {
                background-color: #4b00b5; 
            }
            .download-openai-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        // 3) “查找资源”按钮
        const findBtn = document.createElement('button');
        findBtn.innerText = '查找 OpenAI 图片/视频';
        findBtn.classList.add('download-openai-btn');

        // 4) “下载全部”按钮（初始禁用）
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '下载全部';
        downloadBtn.classList.add('download-openai-btn');
        downloadBtn.disabled = true;

        // 5) 点击“查找资源”：扫描页面元素，提取 URL
        findBtn.addEventListener('click', function() {
            const selector = 'img[src^="https://videos.openai.com/vg-assets/assets"], video[src^="https://videos.openai.com/vg-assets/assets"]';
            const elements = document.querySelectorAll(selector);

            foundUrls = Array.from(elements).map(el => el.src);
            console.log('找到的资源数量：', foundUrls.length, 'URL 列表：', foundUrls);

            findBtn.innerText = `找到 ${foundUrls.length} 个资源`;
            downloadBtn.disabled = (foundUrls.length === 0);
        });

        // 6) 点击“下载全部”：对每个文件检查是否下载过，没下载过才调用 GM_download
        downloadBtn.addEventListener('click', async function() {
            console.log('开始下载', foundUrls.length, '个文件');
            
            for (let i = 0; i < foundUrls.length; i++) {
                const url = foundUrls[i];
                let filename = url.split('?')[0].split('/').pop();
                if (!filename) {
                    filename = 'openai_asset_' + i + '.webp';
                }

                // 如果 downloadedSet 里已经有这个文件名，就跳过
                if (downloadedSet.has(filename)) {
                    console.log('跳过已下载文件：', filename);
                    continue;
                }

                // 否则执行下载
                console.log('正在下载：', filename);
                GM_download(url, filename);

                // 下载后将此文件名添加到 Set，并保存到存储
                downloadedSet.add(filename);
                await GM_setValue('downloadedFiles', Array.from(downloadedSet));
            }
        });

        // 7) 将按钮放入容器
        container.appendChild(findBtn);
        container.appendChild(downloadBtn);
    });
})();
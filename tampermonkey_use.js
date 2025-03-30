(function() {
    'use strict';

    console.log('FindAndDownloadOpenAIAssets script has started');

    let foundUrls = [];

    window.addEventListener('load', function() {
        // 1) 创建一个固定定位的容器，用于放两个按钮
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '20px';
        container.style.bottom = '20px';
        container.style.zIndex = '9999999';
        container.style.display = 'flex';         // 使用弹性布局
        container.style.flexDirection = 'row';    // 横向排列
        container.style.gap = '8px';             // 按钮间距 8px
        document.body.appendChild(container);

        // 2) 定义通用的按钮样式（不再使用绝对定位）
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

        // 3) 创建“查找资源”按钮
        const findBtn = document.createElement('button');
        findBtn.innerText = '查找 OpenAI 图片/视频';
        findBtn.classList.add('download-openai-btn');

        // 4) 创建“下载全部”按钮（初始禁用）
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '下载全部';
        downloadBtn.classList.add('download-openai-btn');
        downloadBtn.disabled = true;

        // 5) “查找资源”按钮点击逻辑
        findBtn.addEventListener('click', function() {
            const selector = 'img[src^="https://videos.openai.com/vg-assets/assets"], video[src^="https://videos.openai.com/vg-assets/assets"]';
            const elements = document.querySelectorAll(selector);

            // 存储所有匹配到的链接
            foundUrls = Array.from(elements).map(el => el.src);

            console.log('找到的资源数量：', foundUrls.length, 'URL 列表：', foundUrls);

            // 更新按钮文本，如“找到 5 个资源”
            findBtn.innerText = `找到 ${foundUrls.length} 个资源`;
            
            // 如果有资源，启用“下载全部”按钮；否则禁用
            if (foundUrls.length > 0) {
                downloadBtn.disabled = false;
            } else {
                downloadBtn.disabled = true;
            }
        });

        // 6) “下载全部”按钮点击逻辑
        downloadBtn.addEventListener('click', function() {
            console.log('开始下载', foundUrls.length, '个文件');
            foundUrls.forEach((url, index) => {
                let filename = url.split('?')[0].split('/').pop();
                if (!filename) {
                    filename = 'openai_asset_' + index + '.webp';
                }
                GM_download(url, filename);
            });
        });

        // 7) 将两个按钮放入固定容器
        container.appendChild(findBtn);
        container.appendChild(downloadBtn);
    });
})();
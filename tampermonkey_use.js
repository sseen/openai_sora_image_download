(function() {
    'use strict';

    console.log('FindAndDownloadOpenAIAssets script has started');

    // 我们把找到的资源链接存储在这里，以便后面“下载全部”使用
    let foundUrls = [];

    window.addEventListener('load', function() {
        // 1) 定义一些公共样式，用于2个按钮
        const style = document.createElement('style');
        style.textContent = `
            .download-openai-btn {
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 9999999;
                padding: 10px 16px;
                font-size: 14px;
                cursor: pointer;
                background-color: #6200ee;
                color: #ffffff;
                border: none;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                transition: background-color 0.3s ease;
                margin-right: 8px; /* 让两个按钮并排时稍微留点间距 */
            }
            .download-openai-btn:hover {
                background-color: #4b00b5; 
            }
        `;
        document.head.appendChild(style);

        // 2) “查找资源”按钮
        const findBtn = document.createElement('button');
        findBtn.innerText = '查找OpenAI图片/视频';
        findBtn.classList.add('download-openai-btn');

        // 3) “下载全部”按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '下载全部';
        downloadBtn.classList.add('download-openai-btn');
        // 默认先禁用（灰掉），只有找到资源后再启用
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.5';

        // 4) 点击“查找资源”时的逻辑
        findBtn.addEventListener('click', function() {
            // 查找以 https://videos.openai.com/vg-assets/assets 开头的 <img> 和 <video>
            const selector = 'img[src^="https://videos.openai.com/vg-assets/assets"], video[src^="https://videos.openai.com/vg-assets/assets"]';
            const elements = document.querySelectorAll(selector);

            // 存储资源链接
            foundUrls = Array.from(elements).map(el => el.src);

            // 在控制台打印一下，方便查看
            console.log('找到的资源数量:', foundUrls.length, 'URL列表:', foundUrls);

            // 更新按钮文字，显示找到的数量
            findBtn.innerText = `找到 ${foundUrls.length} 个资源`;

            // 如果找到了，则启用“下载全部”按钮
            if (foundUrls.length > 0) {
                downloadBtn.disabled = false;
                downloadBtn.style.opacity = '1';
            } else {
                downloadBtn.disabled = true;
                downloadBtn.style.opacity = '0.5';
            }
        });

        // 5) 点击“下载全部”时的逻辑
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

        // 6) 插入这两个按钮到页面（并排显示）
        document.body.appendChild(findBtn);
        document.body.appendChild(downloadBtn);
    });
})();

window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});;(() => {
    'use strict';

    console.log('[PJ] 中国医科大学评教自动打分脚本已注入（PakePlus版）');

    /** 自动识别分值 */
    function detectMaxScore(container) {
        if (!container) return 15;
        const text = container.innerText || '';
        return text.includes('20分') ? 20 : 15;
    }

    /** 设置分值并触发 Vue 响应 */
    function setScore(input, score) {
        if (!input) return;

        input.value = score;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /** 自动提交 */
    function trySubmit() {
        const btn =
            document.querySelector('button.submitbtn.weui-btn_primary') ||
            Array.from(document.querySelectorAll('button'))
                .find(b => b.innerText.includes('提交'));

        if (btn) {
            console.log('[PJ] 已找到提交按钮，自动提交');
            btn.click();
            return true;
        }
        return false;
    }

    /** 主逻辑 */
    function processAll() {
        const inputs = Array.from(
            document.querySelectorAll(
                'input.rater_input, input[placeholder*="输入"]'
            )
        );

        if (!inputs.length) return;

        let changed = false;

        inputs.forEach(input => {
            if (!input.value || input.value === '0') {
                const container = input.closest('#demo, .servery, div');
                const score = detectMaxScore(container);
                setScore(input, score);
                changed = true;
            }
        });

        if (changed) {
            console.log(`[PJ] 已完成 ${inputs.length} 项评分`);
            setTimeout(() => {
                trySubmit();
            }, 1000);
        }
    }

    /** Vue / SPA 监听（核心） */
    const observer = new MutationObserver(() => {
        processAll();
    });

    /** 等 body 出现再挂 observer（WebView 必须） */
    const waitBody = setInterval(() => {
        if (document.body) {
            clearInterval(waitBody);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('[PJ] MutationObserver 已启动');
            processAll();
        }
    }, 300);

})();

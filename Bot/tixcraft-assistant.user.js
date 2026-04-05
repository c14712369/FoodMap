// ==UserScript==
// @name         拓元售票 (tixCraft) 搶票輔助小幫手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  協助自動點擊進入購票、選擇場次、選擇票價與區域、選擇張數、勾選同意條款，並自動聚焦驗證碼，由使用者手動輸入。
// @author       Gemini CLI
// @match        https://tixcraft.com/activity/detail/*
// @match        https://tixcraft.com/activity/game/*
// @match        https://tixcraft.com/ticket/area/*
// @match        https://tixcraft.com/ticket/ticket/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 使用者設定區 (Configuration)
    // 請根據要搶的演唱會修改以下設定
    // ==========================================
    const CONFIG = {
        // 目標日期或場次關鍵字 (例如: "2024/12/31" 或 "19:30")
        targetDateKeyword: "2024/12/31",

        // 目標區域或票價關鍵字 (例如: "$3800" 或 "特A區")
        targetAreaKeyword: "3800",

        // 購買張數
        ticketCount: 2,

        // 開賣前自動重整的間隔 (毫秒)，設為 0 表示不自動重整
        autoRefreshInterval: 500
    };

    // ==========================================
    // 工具函數 (Utility Functions)
    // ==========================================

    /**
     * 等待元素出現 (MutationObserver)
     * @param {string} selector CSS 選擇器
     * @param {number} timeout 超時時間 (毫秒)
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) {
                return resolve(el);
            }

            const observer = new MutationObserver(mutations => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            if (timeout > 0) {
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`等待元素超時: ${selector}`));
                }, timeout);
            }
        });
    }

    /**
     * 隨機延遲，模擬人類操作
     * @param {number} min 最小延遲 (毫秒)
     * @param {number} max 最大延遲 (毫秒)
     */
    function delay(min = 50, max = 150) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // ==========================================
    // 核心邏輯 (Core Logic)
    // ==========================================

    const currentUrl = window.location.href;

    async function runScript() {
        console.log("[TixCraft Bot] 腳本啟動，當前網址:", currentUrl);

        try {
            // 1. 活動首頁 (`/activity/detail/`)
            if (currentUrl.includes('/activity/detail/')) {
                console.log("[TixCraft Bot] 進入活動首頁，準備點擊立即購票...");
                // 拓元的首頁通常會有一個 tab-tickets 的分頁或直接有按鈕
                // 實際情況下，可能需要先點擊 "立即購票" 的 Tab
                const buyTicketTab = document.querySelector('a[href="#game-info"]');
                if (buyTicketTab) {
                    buyTicketTab.click();
                    await delay(100, 300);
                }

                // 檢查是否有 "立即購票" 的按鈕 (class name 會變，通常是 btn-primary)
                // 若尚未開賣，按鈕可能被 disabled 或是顯示 "即將開賣"
                const buyButtons = Array.from(document.querySelectorAll('a, button')).filter(el => el.textContent.includes('立即購票'));
                
                if (buyButtons.length > 0) {
                    const btn = buyButtons[0];
                    if (!btn.disabled && !btn.classList.contains('disabled')) {
                        console.log("[TixCraft Bot] 找到購票按鈕，點擊!");
                        await delay(50, 150);
                        btn.click();
                    } else if (CONFIG.autoRefreshInterval > 0) {
                        console.log("[TixCraft Bot] 尚未開賣，等待重整...");
                        setTimeout(() => location.reload(), CONFIG.autoRefreshInterval);
                    }
                } else if (CONFIG.autoRefreshInterval > 0) {
                     console.log("[TixCraft Bot] 找不到購票按鈕，可能尚未開賣，等待重整...");
                     setTimeout(() => location.reload(), CONFIG.autoRefreshInterval);
                }
            }

            // 2. 場次選擇頁面 (`/activity/game/`)
            else if (currentUrl.includes('/activity/game/')) {
                console.log("[TixCraft Bot] 進入場次選擇頁面...");
                await waitForElement('table.table'); // 等待表格載入
                
                const rows = Array.from(document.querySelectorAll('table.table tbody tr'));
                let targetBtn = null;

                for (const row of rows) {
                    if (row.textContent.includes(CONFIG.targetDateKeyword)) {
                        // 尋找該列的 "立即購票" 或 "訂購" 按鈕
                        const btn = row.querySelector('button, a.btn');
                        if (btn && !btn.disabled && !btn.classList.contains('disabled') && btn.textContent.includes('立即購票')) {
                            targetBtn = btn;
                            break;
                        }
                    }
                }

                if (targetBtn) {
                    console.log("[TixCraft Bot] 找到目標場次按鈕，點擊!");
                    await delay(50, 150);
                    targetBtn.click();
                } else {
                    console.log("[TixCraft Bot] 未找到符合目標日期的可購票按鈕。");
                }
            }

            // 3. 區域/票價選擇頁面 (`/ticket/area/`)
            else if (currentUrl.includes('/ticket/area/')) {
                console.log("[TixCraft Bot] 進入區域選擇頁面...");
                
                // 拓元的區域選擇通常是一個包含各區域連結的列表區塊
                await waitForElement('.zone-area-list, .area-list, ul.list-group'); 
                const areaLinks = Array.from(document.querySelectorAll('a, .zone-area-list li'));

                let targetAreaLink = null;
                for (const link of areaLinks) {
                    if (link.textContent.includes(CONFIG.targetAreaKeyword)) {
                        // 確保該區域沒有售完 (通常會有 sold-out class 或文字)
                        if (!link.classList.contains('sold-out') && !link.textContent.includes('已售完')) {
                            targetAreaLink = link;
                            break;
                        }
                    }
                }

                if (targetAreaLink) {
                     console.log(`[TixCraft Bot] 找到目標區域 (${CONFIG.targetAreaKeyword})，點擊!`);
                     // 某些結構下，li 裡面包著 a，確保點擊到可點擊的元素
                     const clickable = targetAreaLink.tagName.toLowerCase() === 'a' ? targetAreaLink : targetAreaLink.querySelector('a') || targetAreaLink;
                     await delay(50, 150);
                     clickable.click();
                } else {
                    console.log("[TixCraft Bot] 未找到符合目標且有剩餘票券的區域。");
                }
            }

            // 4. 購票確認與張數選擇頁面 (`/ticket/ticket/`)
            else if (currentUrl.includes('/ticket/ticket/')) {
                console.log("[TixCraft Bot] 進入張數選擇與結帳頁面...");
                
                // 4.1 選擇張數
                try {
                    const selectEl = await waitForElement('select.mobile-select, select', 2000); // 尋找張數下拉選單
                    if (selectEl) {
                        // 找出 value 符合設定張數的 option
                        const options = Array.from(selectEl.options);
                        const targetOption = options.find(opt => opt.value == CONFIG.ticketCount);
                        
                        if (targetOption) {
                            selectEl.value = targetOption.value;
                            // 觸發 change 事件讓網頁知道我們改了數值
                            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log(`[TixCraft Bot] 已自動選擇張數: ${CONFIG.ticketCount} 張`);
                        }
                    }
                } catch (e) {
                    console.log("[TixCraft Bot] 找不到張數下拉選單，可能為單一票種或系統延遲。");
                }

                await delay(50, 100);

                // 4.2 勾選同意條款
                try {
                    const checkbox = await waitForElement('input[type="checkbox"][id*="Term"], input[type="checkbox"]', 2000);
                    if (checkbox && !checkbox.checked) {
                        checkbox.click();
                        console.log("[TixCraft Bot] 已自動勾選同意服務條款");
                    }
                } catch (e) {
                    console.log("[TixCraft Bot] 找不到同意條款核取方塊。");
                }

                await delay(50, 100);

                // 4.3 聚焦驗證碼輸入框
                try {
                    const verifyInput = await waitForElement('input[id*="verifyCode"], input[name*="verifyCode"]', 2000);
                    if (verifyInput) {
                        verifyInput.focus();
                        console.log("[TixCraft Bot] 👉 已將游標聚焦至驗證碼輸入框，請手動輸入驗證碼並送出！");
                    }
                } catch (e) {
                    console.log("[TixCraft Bot] 找不到驗證碼輸入框。");
                }
            }

        } catch (error) {
            console.error("[TixCraft Bot] 發生錯誤:", error);
        }
    }

    // 啟動腳本
    runScript();

})();
/**
 * 知识卡片统一JS功能
 * Knowledge Cards Common JavaScript
 */

/**
 * 初始化应用 - 在页面加载完成后调用
 * @param {Object} options - 配置选项
 * @param {string} options.storageKey - localStorage键名，默认 'knowledgeCardState'
 * @param {string} options.docId - 文档唯一标识，用于区分不同文档的记忆状态
 */
function initApp(options = {}) {
    const config = {
        storageKey: options.storageKey || 'knowledgeCardState',
        docId: options.docId || 'default'
    };

    // 获取DOM元素
    const searchInput = document.getElementById('searchInput');
    const navItems = document.querySelectorAll('.nav-item');
    const chapterSections = document.querySelectorAll('.chapter-section');
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    const toggleThemeBtn = document.getElementById('toggleTheme');

    // 初始化统计
    function initStats() {
        const totalCardsEl = document.getElementById('totalCards');
        if (totalCardsEl) {
            totalCardsEl.textContent = knowledgeCards.length;
        }
        updateProgress();
    }

    // 更新进度
    function updateProgress() {
        const remembered = document.querySelectorAll('.knowledge-card.remembered').length;
        const total = knowledgeCards.length;
        const percent = total > 0 ? Math.round((remembered / total) * 100) : 0;

        const rememberedEl = document.getElementById('rememberedCards');
        const percentEl = document.getElementById('progressPercent');
        const fillEl = document.getElementById('progressFill');

        if (rememberedEl) rememberedEl.textContent = remembered;
        if (percentEl) percentEl.textContent = percent + '%';
        if (fillEl) fillEl.style.width = percent + '%';
    }

    // 切换记忆状态
    function toggleRemember(checkbox) {
        const card = checkbox.closest('.knowledge-card');
        if (!card) return;

        card.classList.toggle('remembered');
        checkbox.classList.toggle('checked');

        const svg = checkbox.querySelector('svg');
        if (svg) {
            svg.style.display = checkbox.classList.contains('checked') ? 'block' : 'none';
        }

        updateProgress();
        saveState();
    }

    // 暴露toggleRemember到全局作用域
    window.toggleRemember = toggleRemember;

    // 章节导航点击事件
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;

                // 更新导航项激活状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // 显示/隐藏章节
                chapterSections.forEach(section => {
                    if (chapter === 'all') {
                        section.classList.add('active');
                    } else if (section.dataset.chapter === chapter) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            });
        });
    }

    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();

            knowledgeCards.forEach(card => {
                const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const content = card.querySelector('.card-content')?.textContent.toLowerCase() || '';
                const key = card.dataset.key?.toLowerCase() || '';

                if (title.includes(searchText) || content.includes(searchText) || key.includes(searchText)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 主题切换
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            if (html.dataset.theme === 'dark') {
                html.dataset.theme = 'light';
                toggleThemeBtn.classList.remove('active');
            } else {
                html.dataset.theme = 'dark';
                toggleThemeBtn.classList.add('active');
            }
            saveState();
        });
    }

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
        // T 键切换主题（当不在输入框中时）
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            if (toggleThemeBtn) toggleThemeBtn.click();
        }
    });

    // 保存状态到localStorage
    function saveState() {
        const state = {
            theme: document.documentElement.dataset.theme || 'light',
            remembered: []
        };

        document.querySelectorAll('.knowledge-card.remembered').forEach(card => {
            state.remembered.push(card.dataset.key);
        });

        // 使用文档ID区分不同文档的状态
        const storageKey = `${config.storageKey}_${config.docId}`;
        localStorage.setItem(storageKey, JSON.stringify(state));
    }

    // 从localStorage加载状态
    function loadState() {
        const storageKey = `${config.storageKey}_${config.docId}`;
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const state = JSON.parse(saved);

                // 恢复主题
                if (state.theme === 'dark') {
                    document.documentElement.dataset.theme = 'dark';
                    if (toggleThemeBtn) toggleThemeBtn.classList.add('active');
                }

                // 恢复记忆状态
                if (state.remembered && Array.isArray(state.remembered)) {
                    state.remembered.forEach(key => {
                        const card = document.querySelector(`.knowledge-card[data-key="${key}"]`);
                        if (card) {
                            const checkbox = card.querySelector('.remember-checkbox');
                            if (checkbox) toggleRemember(checkbox);
                        }
                    });
                }
            } catch (e) {
                console.warn('Failed to load saved state:', e);
            }
        }
    }

    // 初始化
    initStats();
    loadState();

    // 返回API供外部使用
    return {
        updateProgress,
        toggleRemember,
        saveState,
        loadState
    };
}

/**
 * 搜索功能（独立函数）
 * @param {string} searchText - 搜索文本
 */
function searchCards(searchText) {
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    const text = searchText.toLowerCase();

    knowledgeCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const content = card.querySelector('.card-content')?.textContent.toLowerCase() || '';
        const key = card.dataset.key?.toLowerCase() || '';

        if (title.includes(text) || content.includes(text) || key.includes(text)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * 切换章节显示
 * @param {string} chapter - 章节标识
 */
function showChapter(chapter) {
    const navItems = document.querySelectorAll('.nav-item');
    const chapterSections = document.querySelectorAll('.chapter-section');

    // 更新导航
    navItems.forEach(nav => {
        if (nav.dataset.chapter === chapter) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });

    // 更新章节显示
    chapterSections.forEach(section => {
        if (chapter === 'all' || section.dataset.chapter === chapter) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

/**
 * 切换主题
 * @param {string} theme - 'light' 或 'dark'
 */
function setTheme(theme) {
    const html = document.documentElement;
    const toggleThemeBtn = document.getElementById('toggleTheme');

    if (theme === 'dark') {
        html.dataset.theme = 'dark';
        if (toggleThemeBtn) toggleThemeBtn.classList.add('active');
    } else {
        html.dataset.theme = 'light';
        if (toggleThemeBtn) toggleThemeBtn.classList.remove('active');
    }

    // 保存主题设置
    const state = JSON.parse(localStorage.getItem('knowledgeCardState') || '{}');
    state.theme = theme;
    localStorage.setItem('knowledgeCardState', JSON.stringify(state));
}

/**
 * 获取当前主题
 * @returns {string} 'light' 或 'dark'
 */
function getCurrentTheme() {
    return document.documentElement.dataset.theme || 'light';
}

/**
 * 清除当前文档的记忆状态
 * @param {string} docId - 文档ID（可选，默认 'default'）
 */
function clearMemory(docId = 'default') {
    const storageKey = `knowledgeCardState_${docId}`;
    localStorage.removeItem(storageKey);

    // 重置所有卡片状态
    document.querySelectorAll('.knowledge-card.remembered').forEach(card => {
        card.classList.remove('remembered');
        const checkbox = card.querySelector('.remember-checkbox');
        if (checkbox) {
            checkbox.classList.remove('checked');
            const svg = checkbox.querySelector('svg');
            if (svg) svg.style.display = 'none';
        }
    });

    // 更新进度
    const totalCards = document.querySelectorAll('.knowledge-card').length;
    const rememberedEl = document.getElementById('rememberedCards');
    const percentEl = document.getElementById('progressPercent');
    const fillEl = document.getElementById('progressFill');

    if (rememberedEl) rememberedEl.textContent = '0';
    if (percentEl) percentEl.textContent = '0%';
    if (fillEl) fillEl.style.width = '0%';
}

// 移动端菜单切换
function initMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobileMenuToggle');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// DOM加载完成后初始化移动端菜单
document.addEventListener('DOMContentLoaded', initMobileMenu);

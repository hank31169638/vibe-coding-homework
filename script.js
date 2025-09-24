class CandyCrushGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.timeLeft = 120; // 2分鐘遊戲時間
        this.gameRunning = false;
        this.gamePaused = false;
        this.timer = null;
        
        // 8x8 遊戲網格
        this.gridSize = 8;
        this.grid = [];
        this.selectedCell = null;
        
        // 糖果類型定義 - 使用簡單但清晰的符號
        this.candyTypes = [
            { type: 'red', symbol: '🔴', color: '#ff6b6b' },
            { type: 'blue', symbol: '🔵', color: '#74b9ff' },
            { type: 'green', symbol: '🟢', color: '#55efc4' },
            { type: 'yellow', symbol: '🟡', color: '#fdcb6e' },
            { type: 'purple', symbol: '🟣', color: '#a29bfe' },
            { type: 'orange', symbol: '🟠', color: '#fd79a8' }
        ];
        
        this.initElements();
        this.bindEvents();
        this.initGrid();
    }
    
    initElements() {
        // 獲取DOM元素
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.levelElement = document.getElementById('level');
        this.gameGrid = document.getElementById('game-grid');
        
        // 按鈕元素
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        // 訊息彈窗元素
        this.gameMessage = document.getElementById('game-message');
        this.messageTitle = document.getElementById('message-title');
        this.messageText = document.getElementById('message-text');
        this.messageBtn = document.getElementById('message-btn');
    }
    
    bindEvents() {
        // 按鈕事件
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.messageBtn.addEventListener('click', () => this.hideMessage());
    }
    
    initGrid() {
        // 清空網格
        this.gameGrid.innerHTML = '';
        this.grid = [];
        
        // 創建8x8網格
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.createCandyCell(row, col);
                this.grid[row][col] = cell;
                this.gameGrid.appendChild(cell.element);
            }
        }
        
        // 移除初始匹配
        this.removeInitialMatches();
    }
    
    createCandyCell(row, col) {
        const element = document.createElement('div');
        element.className = 'candy-cell';
        
        // 避免創建初始匹配
        let candyType;
        let attempts = 0;
        do {
            candyType = this.candyTypes[Math.floor(Math.random() * this.candyTypes.length)];
            attempts++;
        } while (attempts < 10 && this.wouldCreateMatch(row, col, candyType));
        
        element.dataset.type = candyType.type;
        element.textContent = candyType.symbol;
        element.dataset.row = row;
        element.dataset.col = col;
        element.style.backgroundColor = candyType.color;
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
        
        // 綁定點擊事件
        element.addEventListener('click', () => this.handleCellClick(row, col));
        
        return {
            element: element,
            type: candyType.type,
            symbol: candyType.symbol,
            color: candyType.color,
            row: row,
            col: col
        };
    }
    
    wouldCreateMatch(row, col, candyType) {
        // 檢查水平匹配
        let horizontalCount = 1;
        // 檢查左邊
        for (let c = col - 1; c >= 0 && this.grid[row] && this.grid[row][c] && this.grid[row][c].type === candyType.type; c--) {
            horizontalCount++;
        }
        // 檢查右邊
        for (let c = col + 1; c < this.gridSize && this.grid[row] && this.grid[row][c] && this.grid[row][c].type === candyType.type; c++) {
            horizontalCount++;
        }
        
        // 檢查垂直匹配
        let verticalCount = 1;
        // 檢查上面
        for (let r = row - 1; r >= 0 && this.grid[r] && this.grid[r][col] && this.grid[r][col].type === candyType.type; r--) {
            verticalCount++;
        }
        // 檢查下面
        for (let r = row + 1; r < this.gridSize && this.grid[r] && this.grid[r][col] && this.grid[r][col].type === candyType.type; r++) {
            verticalCount++;
        }
        
        return horizontalCount >= 3 || verticalCount >= 3;
    }
    
    removeInitialMatches() {
        let hasMatches = true;
        let attempts = 0;
        while (hasMatches && attempts < 50) {
            const matches = this.findAllMatches();
            if (matches.length === 0) {
                hasMatches = false;
            } else {
                // 隨機替換匹配的糖果
                matches.forEach(match => {
                    const newType = this.candyTypes[Math.floor(Math.random() * this.candyTypes.length)];
                    const cell = this.grid[match.row][match.col];
                    cell.type = newType.type;
                    cell.symbol = newType.symbol;
                    cell.color = newType.color;
                    cell.element.dataset.type = newType.type;
                    cell.element.textContent = newType.symbol;
                    cell.element.style.backgroundColor = newType.color;
                });
            }
            attempts++;
        }
    }
    
    handleCellClick(row, col) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const clickedCell = this.grid[row][col];
        console.log('點擊糖果:', row, col, clickedCell.type);
        
        if (!this.selectedCell) {
            // 選擇第一個糖果
            this.selectedCell = clickedCell;
            clickedCell.element.classList.add('selected');
            this.highlightPossibleMoves(row, col);
            console.log('選擇了糖果:', clickedCell.type);
        } else if (this.selectedCell === clickedCell) {
            // 取消選擇
            this.clearSelection();
            console.log('取消選擇');
        } else if (this.areAdjacent(this.selectedCell, clickedCell)) {
            // 交換相鄰的糖果
            console.log('嘗試交換:', this.selectedCell.type, 'with', clickedCell.type);
            this.swapCandies(this.selectedCell, clickedCell);
        } else {
            // 選擇新的糖果
            this.clearSelection();
            this.selectedCell = clickedCell;
            clickedCell.element.classList.add('selected');
            this.highlightPossibleMoves(row, col);
            console.log('選擇新糖果:', clickedCell.type);
        }
    }
    
    areAdjacent(cell1, cell2) {
        const rowDiff = Math.abs(cell1.row - cell2.row);
        const colDiff = Math.abs(cell1.col - cell2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    highlightPossibleMoves(row, col) {
        const directions = [
            { row: -1, col: 0 }, // 上
            { row: 1, col: 0 },  // 下
            { row: 0, col: -1 }, // 左
            { row: 0, col: 1 }   // 右
        ];
        
        directions.forEach(dir => {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
            
            if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
                this.grid[newRow][newCol].element.classList.add('possible-move');
            }
        });
    }
    
    clearSelection() {
        if (this.selectedCell) {
            this.selectedCell.element.classList.remove('selected');
            this.selectedCell = null;
        }
        
        // 移除所有高亮
        document.querySelectorAll('.possible-move').forEach(cell => {
            cell.classList.remove('possible-move');
        });
    }
    
    swapCandies(cell1, cell2) {
        console.log('開始交換:', cell1.type, '和', cell2.type);
        
        // 添加交換動畫
        cell1.element.classList.add('swapping-out');
        cell2.element.classList.add('swapping-out');
        
        setTimeout(() => {
            // 交換類型和內容
            const tempType = cell1.type;
            const tempSymbol = cell1.symbol;
            const tempColor = cell1.color;
            
            cell1.type = cell2.type;
            cell1.symbol = cell2.symbol;
            cell1.color = cell2.color;
            cell1.element.dataset.type = cell2.type;
            cell1.element.textContent = cell2.symbol;
            cell1.element.style.backgroundColor = cell2.color;
            
            cell2.type = tempType;
            cell2.symbol = tempSymbol;
            cell2.color = tempColor;
            cell2.element.dataset.type = tempType;
            cell2.element.textContent = tempSymbol;
            cell2.element.style.backgroundColor = tempColor;
            
            // 移除交換動畫
            cell1.element.classList.remove('swapping-out');
            cell2.element.classList.remove('swapping-out');
            cell1.element.classList.add('swapping-in');
            cell2.element.classList.add('swapping-in');
            
            setTimeout(() => {
                cell1.element.classList.remove('swapping-in');
                cell2.element.classList.remove('swapping-in');
                
                // 檢查匹配
                const matches = this.findAllMatches();
                console.log('找到匹配:', matches.length);
                
                if (matches.length > 0) {
                    this.clearSelection();
                    this.processMatches();
                } else {
                    // 沒有匹配，交換回去
                    console.log('沒有匹配，交換回去');
                    setTimeout(() => {
                        this.swapBack(cell1, cell2);
                    }, 300);
                }
            }, 300);
        }, 150);
    }
    
    swapBack(cell1, cell2) {
        // 交換回去
        const tempType = cell1.type;
        const tempSymbol = cell1.symbol;
        const tempColor = cell1.color;
        
        cell1.type = cell2.type;
        cell1.symbol = cell2.symbol;
        cell1.color = cell2.color;
        cell1.element.dataset.type = cell2.type;
        cell1.element.textContent = cell2.symbol;
        cell1.element.style.backgroundColor = cell2.color;
        
        cell2.type = tempType;
        cell2.symbol = tempSymbol;
        cell2.color = tempColor;
        cell2.element.dataset.type = tempType;
        cell2.element.textContent = tempSymbol;
        cell2.element.style.backgroundColor = tempColor;
        
        this.clearSelection();
    }
    
    findAllMatches() {
        const matches = [];
        const visited = new Set();
        
        // 檢查水平匹配
        for (let row = 0; row < this.gridSize; row++) {
            let count = 1;
            let currentType = this.grid[row][0].type;
            
            for (let col = 1; col < this.gridSize; col++) {
                if (this.grid[row][col].type === currentType) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = col - count; i < col; i++) {
                            const key = `${row}-${i}`;
                            if (!visited.has(key)) {
                                matches.push({ row, col: i });
                                visited.add(key);
                            }
                        }
                    }
                    currentType = this.grid[row][col].type;
                    count = 1;
                }
            }
            
            if (count >= 3) {
                for (let i = this.gridSize - count; i < this.gridSize; i++) {
                    const key = `${row}-${i}`;
                    if (!visited.has(key)) {
                        matches.push({ row, col: i });
                        visited.add(key);
                    }
                }
            }
        }
        
        // 檢查垂直匹配
        for (let col = 0; col < this.gridSize; col++) {
            let count = 1;
            let currentType = this.grid[0][col].type;
            
            for (let row = 1; row < this.gridSize; row++) {
                if (this.grid[row][col].type === currentType) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = row - count; i < row; i++) {
                            const key = `${i}-${col}`;
                            if (!visited.has(key)) {
                                matches.push({ row: i, col });
                                visited.add(key);
                            }
                        }
                    }
                    currentType = this.grid[row][col].type;
                    count = 1;
                }
            }
            
            if (count >= 3) {
                for (let i = this.gridSize - count; i < this.gridSize; i++) {
                    const key = `${i}-${col}`;
                    if (!visited.has(key)) {
                        matches.push({ row: i, col });
                        visited.add(key);
                    }
                }
            }
        }
        
        return matches;
    }
    
    processMatches() {
        const matches = this.findAllMatches();
        if (matches.length === 0) return;
        
        console.log('處理匹配:', matches);
        
        // 消除動畫
        matches.forEach(match => {
            const cell = this.grid[match.row][match.col];
            cell.element.classList.add('eliminating');
            this.createParticleEffect(cell.element);
        });
        
        setTimeout(() => {
            // 增加分數
            const points = matches.length * 10 * this.level;
            this.score += points;
            this.showScorePopup(points);
            
            // 移除消除的糖果並填充新的
            this.dropAndFillCandies(matches);
            
            // 檢查升級
            if (this.score >= this.level * 1000) {
                this.levelUp();
            }
            
            this.updateUI();
            
            // 檢查是否還有新的匹配
            setTimeout(() => {
                const newMatches = this.findAllMatches();
                if (newMatches.length > 0) {
                    this.processMatches();
                }
            }, 800);
        }, 500);
    }
    
    dropAndFillCandies(eliminatedMatches) {
        const eliminatedSet = new Set(eliminatedMatches.map(m => `${m.row}-${m.col}`));
        
        // 為每一列處理掉落和填充
        for (let col = 0; col < this.gridSize; col++) {
            const newColumn = [];
            
            // 收集沒有被消除的糖果（從下往上）
            for (let row = this.gridSize - 1; row >= 0; row--) {
                const key = `${row}-${col}`;
                if (!eliminatedSet.has(key)) {
                    newColumn.push(this.grid[row][col]);
                }
            }
            
            // 填充新糖果到頂部
            while (newColumn.length < this.gridSize) {
                const newType = this.candyTypes[Math.floor(Math.random() * this.candyTypes.length)];
                const fakeCell = {
                    type: newType.type,
                    symbol: newType.symbol,
                    color: newType.color
                };
                newColumn.push(fakeCell);
            }
            
            // 更新這一列的所有糖果
            for (let row = 0; row < this.gridSize; row++) {
                const cellData = newColumn[this.gridSize - 1 - row];
                const cell = this.grid[row][col];
                
                cell.type = cellData.type;
                cell.symbol = cellData.symbol;
                cell.color = cellData.color;
                cell.element.dataset.type = cellData.type;
                cell.element.textContent = cellData.symbol;
                cell.element.style.backgroundColor = cellData.color;
                cell.element.classList.remove('eliminating');
                
                // 如果是新糖果或移動的糖果，添加掉落動畫
                if (eliminatedSet.has(`${row}-${col}`) || row < eliminatedMatches.filter(m => m.col === col).length) {
                    cell.element.classList.add('falling');
                }
            }
        }
        
        // 移除掉落動畫
        setTimeout(() => {
            document.querySelectorAll('.falling').forEach(element => {
                element.classList.remove('falling');
            });
        }, 400);
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 120;
        
        // 重新初始化網格
        this.initGrid();
        
        // 更新UI
        this.updateUI();
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // 開始計時器
        this.startTimer();
        
        console.log('糖果消除遊戲開始！');
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            if (!this.gamePaused) {
                this.timeLeft--;
                this.updateUI();
                
                if (this.timeLeft <= 0) {
                    this.endGame(false);
                }
            }
        }, 1000);
    }
    
    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 創建多個粒子
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'sparkle';
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.animationDelay = (i * 0.1) + 's';
            particle.style.zIndex = '2000';
            
            document.body.appendChild(particle);
            
            // 移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    showScorePopup(points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = '+' + points;
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '30%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.fontSize = '2em';
        popup.style.fontWeight = 'bold';
        popup.style.color = '#00b894';
        popup.style.zIndex = '1500';
        popup.style.pointerEvents = 'none';
        
        document.body.appendChild(popup);
        
        // 移除彈出效果
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1500);
    }
    
    levelUp() {
        this.level++;
        this.timeLeft += 60; // 增加1分鐘時間
        
        // 添加升級效果到遊戲容器
        const gameContainer = document.querySelector('.game-container');
        gameContainer.classList.add('level-up-effect');
        
        setTimeout(() => {
            gameContainer.classList.remove('level-up-effect');
        }, 1000);
        
        // 顯示升級訊息
        this.showMessage('🎉 升級了！', `恭喜升到第 ${this.level} 關！\n獲得額外 60 秒時間！`, '繼續遊戲');
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        this.pauseBtn.textContent = this.gamePaused ? '繼續' : '暫停';
        
        if (this.gamePaused) {
            this.showMessage('⏸️ 遊戲暫停', '點擊繼續按鈕或確定繼續遊戲', '繼續');
        } else {
            this.hideMessage();
        }
    }
    
    endGame(won) {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 清除定時器
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // 重置按鈕狀態
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暫停';
        
        // 清除選擇
        this.clearSelection();
        
        // 顯示結果
        if (won) {
            this.showMessage('🏆 恭喜獲勝！', `太棒了！你獲得了 ${this.score} 分！\n達到第 ${this.level} 關！`, '再玩一次');
        } else {
            this.showMessage('😢 遊戲結束', `時間到了！\n最終分數：${this.score} 分\n最高關卡：${this.level} 關`, '再試一次');
        }
    }
    
    restartGame() {
        // 停止當前遊戲
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.hideMessage();
        
        // 重置遊戲狀態
        this.gameRunning = false;
        this.gamePaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暫停';
        
        // 清除選擇
        this.clearSelection();
        
        // 立即開始新遊戲
        setTimeout(() => this.startGame(), 100);
    }
    
    showMessage(title, text, buttonText) {
        this.messageTitle.textContent = title;
        this.messageText.textContent = text;
        this.messageBtn.textContent = buttonText;
        this.gameMessage.classList.remove('hidden');
    }
    
    hideMessage() {
        this.gameMessage.classList.add('hidden');
        if (this.gamePaused && this.gameRunning) {
            this.togglePause(); // 如果是暫停狀態，恢復遊戲
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
        this.levelElement.textContent = this.level;
        
        // 時間警告效果
        if (this.timeLeft <= 30) {
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.remove('timer-warning');
        }
    }
}

// 初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    const game = new CandyCrushGame();
    console.log('糖果消除遊戲已載入！');
});
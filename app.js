// API Keys and secrets (これは問題!)
const API_KEY = "sk-1234567890abcdef1234567890abcdef";
const SECRET_TOKEN = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh";
var DB_PASSWORD = "MyS3cr3tP@ssw0rd!";

// グローバル変数の乱用
var todos = [];
var x = 0;
var temp;
var data1, data2, data3;

// 初期化処理
function init() {
    // localStorageから読み込み
    var stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
    renderTodos();
    updateStats();
}

// Todo追加 (innerHTML使用でXSS脆弱性)
function addTodo() {
    var input = document.getElementById('todoInput');
    var text = input.value;
    
    // バリデーション不足
    if (text) {
        x++;
        var todo = {
            id: x,
            text: text,
            done: false,
            createdAt: new Date()
        };
        todos.push(todo);
        saveTodos();
        renderTodos();
        input.value = '';
        updateStats();
    }
}

// レンダリング (innerHTML使用、XSS脆弱性)
function renderTodos() {
    var list = document.getElementById('todoList');
    var html = '';
    
    // 非効率なループ
    for (var i = 0; i < todos.length; i++) {
        temp = todos[i];
        var checked = temp.done ? 'checked' : '';
        var className = temp.done ? 'done' : '';
        
        // innerHTMLで直接HTML生成 (XSS脆弱性)
        html += '<li class="' + className + '">';
        html += '<input type="checkbox" ' + checked + ' onchange="toggleTodo(' + temp.id + ')">';
        html += '<span>' + temp.text + '</span>';  // エスケープなし!
        html += '<button onclick="deleteTodo(' + temp.id + ')">Delete</button>';
        html += '</li>';
    }
    
    list.innerHTML = html;
}

// Toggle処理 (非効率)
function toggleTodo(id) {
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {  // == 使用 (型変換の問題)
            todos[i].done = !todos[i].done;
            break;
        }
    }
    saveTodos();
    renderTodos();
    updateStats();
}

// 削除処理
function deleteTodo(id) {
    // 非効率な削除方法
    var newTodos = [];
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id != id) {
            newTodos.push(todos[i]);
        }
    }
    todos = newTodos;
    saveTodos();
    renderTodos();
    updateStats();
}

// 全削除
function clearAll() {
    // 確認なしで全削除
    todos = [];
    saveTodos();
    renderTodos();
    updateStats();
}

// 統計表示
function updateStats() {
    var total = todos.length;
    var done = 0;
    
    // var使用でスコープの問題
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].done == true) {
            done++;
        }
    }
    
    var stats = document.getElementById('stats');
    stats.innerHTML = 'Total: ' + total + ' | Completed: ' + done;
}

// 保存処理
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
        // エラーハンドリング不足
        console.log(e);
    }
}

// エクスポート処理 (eval使用で危険!)
function exportData() {
    var exportObj = {
        todos: todos,
        apiKey: API_KEY,  // シークレット情報を含める (問題!)
        token: SECRET_TOKEN,
        password: DB_PASSWORD,
        timestamp: new Date()
    };
    
    // evalの危険な使用
    var code = 'console.log("Export:", exportObj);';
    eval(code);
    
    // JSONをアラート表示 (UX的にも問題)
    alert(JSON.stringify(exportObj));
}

// 未使用の関数
function unusedFunction1() {
    var a = 1;
    var b = 2;
    return a + b;
}

function unusedFunction2(param1, param2) {
    // 何もしない
}

// 初期化
window.onload = function() {
    init();
};

// 重複したイベントハンドラ
window.addEventListener('load', function() {
    console.log('App loaded with API key: ' + API_KEY);  // ログにシークレット出力
});

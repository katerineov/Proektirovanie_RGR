//инициализация данных для графа
let nodes = new vis.DataSet([
    { id: 1, label: 'Узел 1' },
    { id: 2, label: 'Узел 2' },
    { id: 3, label: 'Узел 3' },
]);

let edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
]);

//инициализация графа
let container = document.getElementById('network');
let data = {
    nodes: nodes,
    edges: edges
};
let options = {
    autoResize: true,
    nodes: {
        shape: 'dot',
        size: 10
    },
    physics: {
        enabled: true
    },
    interaction: {
        hover: true
    }
};
let network = new vis.Network(container, data, options);
console.log("Network initialized");

let selectedNodeId = null;
let isAddingEdge = false;
let edgeStartNodeId = null;

//функция для добавления узла
function addNode() {
    //получаем максимальный текущий ID
    let maxNodeId = Math.max(...nodes.get().map(node => node.id), 0);
    
    //создаем новый ID, увеличив максимальный
    let newNodeId = maxNodeId + 1;

    //добавляем новый узел с новым ID
    nodes.add({ id: newNodeId, label: `Узел ${newNodeId}` });
    console.log(`Добавлен Узел ${newNodeId}`);
}

//функция для начала добавления связи
function startAddingEdge() {
    isAddingEdge = true;
    alert('Выберите два узла для создания связи. Сначала кликните на один узел.');
}

//функция для добавления связи между двумя узлами
network.on('selectNode', function(event) {
    if (isAddingEdge) {
        if (edgeStartNodeId === null) {
            //выбираем первый узел
            edgeStartNodeId = event.nodes[0];
            nodes.update({ id: edgeStartNodeId, color: { border: 'red' } });  //подсветка выбранного узла
            console.log(`Выбран первый узел: Узел ${edgeStartNodeId}`);
        } else {
            //выбираем второй узел и добавляем связь
            let edgeEndNodeId = event.nodes[0];
            if (edgeStartNodeId !== edgeEndNodeId) {
                edges.add({ from: edgeStartNodeId, to: edgeEndNodeId });
                console.log(`Добавлена связь между Узлом ${edgeStartNodeId} и Узлом ${edgeEndNodeId}`);
            }
            //снимаем подсветку
            nodes.update({ id: edgeStartNodeId, color: { border: '#6a5acd' } });
            edgeStartNodeId = null;
            isAddingEdge = false;
        }
    }
});

//функция для удаления узла
function removeNode() {
    if (selectedNodeId === null) {
        alert('Выберите узел, который хотите удалить!');
        return;
    }

    nodes.remove({ id: selectedNodeId });
    edges.get().forEach(edge => {
        if (edge.from === selectedNodeId || edge.to === selectedNodeId) {
            edges.remove(edge);
        }
    });

    console.log(`Удален Узел ${selectedNodeId}`);
    selectedNodeId = null;  //сбрасываем выбранный узел
}

//функция для удаления связи
function removeEdge() {
    let selectedEdges = network.getSelectedEdges();
    if (selectedEdges.length === 0) {
        alert('Выберите связь для удаления!');
        return;
    }

    edges.remove({ id: selectedEdges[0] });
    console.log(`Удалена связь: ${selectedEdges[0]}`);
}

//функция для оптимизации сети
function optimizeNetwork() {
    //восстановим все узлы в исходный цвет
    nodes.forEach(node => {
        //проверяем, если узел уже красный, не меняем его
        if (node.color && node.color.background === 'red') return;
        nodes.update({ id: node.id, color: { background: '#97C2FC', border: '#2B7CE9' } });
    });

    let degrees = {};
    edges.forEach(edge => {
        degrees[edge.from] = (degrees[edge.from] || 0) + 1;
        degrees[edge.to] = (degrees[edge.to] || 0) + 1;
    });

    let centralNode = Object.keys(degrees).reduce((a, b) => degrees[a] > degrees[b] ? a : b);
    alert(`Центральный узел: Узел ${centralNode}`);

    //изменим только цвет центрального узла, оставив его подпись и не трогая связи
    nodes.update({ id: centralNode, color: { background: 'red', border: 'darkred' }, label: `Узел ${centralNode}` });

    //связи не меняем (не изменяем их цвет)
    edges.forEach(edge => {
        edges.update({ id: edge.id, color: { color: '#2B7CE9' } });  // Связи остаются с исходным цветом
    });
}


//обработчик клика по узлу для выбора
network.on('selectNode', function(event) {
    selectedNodeId = event.nodes[0];
    console.log(`Выбран Узел ${selectedNodeId}`);
});

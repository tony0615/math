window.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('canvas');
  const colorSelector = document.getElementById('color');
  const colorOptions = document.getElementById('color-options');
  const nodeTextInput = document.getElementById('node-text-input');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'brown'];

  // 创建颜色选项
  colors.forEach((color) => {
    const option = document.createElement('div');
    option.className = 'color-option';
    option.style.backgroundColor = color;
    option.dataset.color = color;

    option.addEventListener('click', () => {
      const selectedColor = option.dataset.color;
      colorSelector.value = selectedColor;

      if (selectedLine) {
        selectedLine.color = selectedColor;
        redrawCanvas();
      }
    });

    colorOptions.appendChild(option);
  });

  const context = canvas.getContext('2d');
  const nodes = [];
  const lines = [];
  let selectedNode = null;
  let selectedLine = null;
  let isDragging = false;

  const nodeRadius = 10;
  const nodeSelectedRadius = 12;
  const lineThickness = 2;
  const lineDashSegments = [5, 5];

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleTouchEnd);

  function handleMouseDown(event) {
    const coordinates = getCoordinates(event);
    const clickedNode = getNodeAt(coordinates);
    const clickedLine = getLineAt(coordinates);

    if (clickedNode) {
      selectNode(clickedNode);
      isDragging = true;
    } else if (clickedLine) {
      selectLine(clickedLine);
    } else {
      createNode(coordinates);
    }
  }

  function handleMouseMove(event) {
    if (!isDragging) return;

    const coordinates = getCoordinates(event);
    moveNode(selectedNode, coordinates);
    updateLines();
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleTouchStart(event) {
    event.preventDefault();

    const touch = event.touches[0];
    const coordinates = getCoordinates(touch);
    const clickedNode = getNodeAt(coordinates);
    const clickedLine = getLineAt(coordinates);

    if (clickedNode) {
      selectNode(clickedNode);
      isDragging = true;
    } else if (clickedLine) {
      selectLine(clickedLine);
    } else {
      createNode(coordinates);
    }
  }

  function handleTouchMove(event) {
    event.preventDefault();

    if (!isDragging) return;

    const touch = event.touches[0];
    const coordinates = getCoordinates(touch);
    moveNode(selectedNode, coordinates);
    updateLines();
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  function getCoordinates(event) {
    const rect = canvas.getBoundingClientRect();

    let x, y;

    if (event.type.startsWith('touch')) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    return { x, y };
  }

  function createNode(coordinates) {
    const node = {
      x: coordinates.x,
      y: coordinates.y,
      color: colorSelector.value,
      name: getNextNodeName(),
      id: nodes.length.toString()
    };

    nodes.push(node);
    drawNode(node);
  }

  function moveNode(node, coordinates) {
    node.x = coordinates.x;
    node.y = coordinates.y;
    redrawCanvas();
  }

  function getNodeAt(coordinates) {
    for (const node of nodes) {
      const distance = Math.sqrt(
        Math.pow(coordinates.x - node.x, 2) + Math.pow(coordinates.y - node.y, 2)
      );

      if (distance <= nodeRadius) {
        return node;
      }
    }

    return null;
  }

  function selectNode(node) {
    if (selectedNode && node.id !== selectedNode.id) {
      let hasLine = false;
      for (const line of lines) {
        if (
          (line.startNodeId === selectedNode.id && line.endNodeId === node.id) ||
          (line.startNodeId === node.id && line.endNodeId === selectedNode.id)
        ) {
          hasLine = true;
          break;
        }
      }
      if (!hasLine) {
        createLine(selectedNode, node);
      }
    }

    selectedNode = node;
  }
  function selectLine(line) {
    selectedLine = line;
    redrawCanvas();
  }
  function drawNode(node) {
    context.beginPath();
    if (selectedNode && node.id === selectedNode.id) {
      context.arc(node.x, node.y, nodeSelectedRadius, 0, 2 * Math.PI);
    } else {
      context.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
    }
    context.fillStyle = node.color;
    context.fill();
    context.closePath();

    // 绘制节点名称
    context.font = '12px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'black';
    context.fillText(node.name, node.x, node.y + nodeRadius + 14);
  }

  function getNextNodeName() {
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const lastCharCode = lastNode.name.charCodeAt(0);

      if (lastCharCode < 90) {
        return String.fromCharCode(lastCharCode + 1);
      }
    }

    return String.fromCharCode(65 + nodes.length);
  }

  function drawLine(startNode, endNode, color, isDashed) {
    context.beginPath();
    context.moveTo(startNode.x, startNode.y);
    context.lineTo(endNode.x, endNode.y);
    context.strokeStyle = color;
    context.lineWidth = lineThickness;
    if (isDashed) {
      context.setLineDash(lineDashSegments);
    } else {
      context.setLineDash([]);
    }
    context.stroke();
    context.closePath();
  }

  function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const node of nodes) {
      drawNode(node);
    }

    for (const line of lines) {
      const startNode = getNodeById(line.startNodeId);
      const endNode = getNodeById(line.endNodeId);
      drawLine(startNode, endNode, line.color, line.isDashed);
    }
  }

  function getNodeById(id) {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
    }
    return null;
  }

  function getLineAt(coordinates) {
    for (const line of lines) {
      const startNode = getNodeById(line.startNodeId);
      const endNode = getNodeById(line.endNodeId);
      const distance = pointToLineDistance(coordinates.x, coordinates.y, startNode.x, startNode.y, endNode.x, endNode.y);
      if (distance <= lineThickness) {
        return line;
      }
    }

    return null;
  }

  function createLine(startNode, endNode) {
    const line = {
      startNodeId: startNode.id,
      endNodeId: endNode.id,
      color: colorSelector.value,
      isDashed: false
    };

    lines.push(line);
    redrawCanvas();
  }

  function updateLines() {
    redrawCanvas();
  }

  function pointToLineDistance(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function toggleLineDash() {
    if (selectedLine) {
      selectedLine.isDashed = !selectedLine.isDashed;
      redrawCanvas();
    }
  }

  function resetSelection() {
    selectedNode = null;
    selectedLine = null;
    nodeTextInput.value = '';
  }

  colorSelector.addEventListener('change', () => {
    if (selectedLine) {
      selectedLine.color = colorSelector.value;
      redrawCanvas();
    }
  });

  nodeTextInput.addEventListener('input', () => {
    if (selectedNode) {
      selectedNode.name = nodeTextInput.value;
      redrawCanvas();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      resetSelection();
      redrawCanvas();
    }
    if (event.key === 'd' || event.key === 'D') {
      toggleLineDash();
    }
  });
});

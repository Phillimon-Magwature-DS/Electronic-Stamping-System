document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas
    const canvas = new fabric.Canvas('design-canvas', {
        backgroundColor: '#ffffff',
        isDrawingMode: false
    });

    let currentTool = 'pencil';
    let currentColor = '#000000';
    let brushSize = 5;
    let drawingHistory = [];
    const maxHistorySteps = 20;

    // Tool buttons functionality
    document.querySelectorAll('.tool-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.id.replace('-tool', '');
            
            // Set canvas mode based on tool
            switch(currentTool) {
                case 'pencil':
                case 'brush':
                case 'eraser':
                    canvas.isDrawingMode = true;
                    canvas.freeDrawingBrush.width = brushSize;
                    canvas.freeDrawingBrush.color = currentTool === 'eraser' ? '#ffffff' : currentColor;
                    break;
                default:
                    canvas.isDrawingMode = false;
            }
        });
    });

    // Color picker
    document.getElementById('color-picker').addEventListener('change', function() {
        currentColor = this.value;
        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush.color = currentColor;
        }
    });

    // Brush size
    document.getElementById('brush-size').addEventListener('input', function() {
        brushSize = this.value;
        document.getElementById('brush-size-value').textContent = `${brushSize}px`;
        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush.width = brushSize;
        }
    });

    // Text tool
    document.getElementById('text-tool').addEventListener('click', function() {
        const text = new fabric.IText('Double click to edit', {
            left: 100,
            top: 100,
            fontFamily: document.getElementById('font-family').value,
            fontSize: parseInt(document.getElementById('font-size').value),
            fill: currentColor
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
    });

    // Shape tools
    document.getElementById('rectangle-tool').addEventListener('click', function() {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 50,
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize
        });
        canvas.add(rect);
    });

    document.getElementById('circle-tool').addEventListener('click', function() {
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize
        });
        canvas.add(circle);
    });

    document.getElementById('line-tool').addEventListener('click', function() {
        const line = new fabric.Line([50, 50, 200, 50], {
            stroke: currentColor,
            strokeWidth: brushSize
        });
        canvas.add(line);
    });

    // Template functionality (for stamps)
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            const templateType = this.dataset.template;
            // Clear canvas first
            canvas.clear();
            
            // Add template background
            switch(templateType) {
                case 'round':
                    const circle = new fabric.Circle({
                        left: 150,
                        top: 150,
                        radius: 100,
                        fill: 'transparent',
                        stroke: '#cccccc',
                        strokeWidth: 2
                    });
                    canvas.add(circle);
                    break;
                case 'square':
                    const rect = new fabric.Rect({
                        left: 100,
                        top: 100,
                        width: 200,
                        height: 200,
                        fill: 'transparent',
                        stroke: '#cccccc',
                        strokeWidth: 2
                    });
                    canvas.add(rect);
                    break;
                case 'official':
                    // Add more complex official stamp template
                    break;
            }
        });
    });

    // Clear canvas
    document.getElementById('clear-canvas').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            canvas.clear();
            saveHistory();
        }
    });

    // Undo functionality
    document.getElementById('undo-action').addEventListener('click', function() {
        if (drawingHistory.length > 1) {
            drawingHistory.pop(); // Remove current state
            canvas.loadFromJSON(drawingHistory[drawingHistory.length - 1]);
            canvas.renderAll();
        } else {
            alert('Nothing to undo');
        }
    });

    // Save history on every change
    canvas.on('object:modified', saveHistory);
    canvas.on('object:added', saveHistory);

    function saveHistory() {
        const json = canvas.toJSON();
        drawingHistory.push(json);
        if (drawingHistory.length > maxHistorySteps) {
            drawingHistory.shift();
        }
    }

    // Save design
    document.getElementById('save-design').addEventListener('click', function() {
        const imageData = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const designType = '{{ design_type }}';
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        fetch('/api/save-design/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                type: designType,
                image_data: imageData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${designType.charAt(0).toUpperCase() + designType.slice(1)} saved successfully!`);
                window.location.href = "{% url 'management' %}";
            } else {
                alert('Error saving design: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving design');
        });
    });

    // Initialize with empty history
    saveHistory();
}); 

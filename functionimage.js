var xscale=20,ysacle=20;
function resetscalex(){
    xscale=document.getElementById("xscale").value;
}
function resetscaley(){
    yscale=document.getElementById("yscale").value;
}
document.addEventListener("DOMContentLoaded", function () {
    const functionSelect = document.getElementById("function-select");
    const parameterInputs = document.getElementById("parameter-inputs");
    const drawButton = document.getElementById("draw-button");
    const functionexpression = document.getElementById("functionexpression");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawFunction(selectedFunction, params) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const scale = canvas.width/10; // Adjust this value to scale the graph

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Set the line color and width
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        // Begin drawing the function
        ctx.beginPath();

        // Iterate over each pixel on the x-axis and calculate the corresponding y-value
        for (let x = 0; x < width; x++) {
            const xValue = (x - width / 2) / scale;
            let yValue;

            // Calculate the y-value based on the selected function
            switch (selectedFunction) {
                case "linear":
                    yValue = params.m * xValue + params.c;
                    break;
                case "proportional":
                    yValue = params.k * xValue;
                    break;
                case "inverse-proportional":
                    yValue = params.k / xValue;
                    break;
                case "quadratic":
                    yValue = params.a * xValue ** 2 + params.b * xValue + params.c;
                    break;
                case "exponential":
                    if(params.a=='e'){
                        yValue = params.k * Math.exp(xValue / 4) ;
                    }else{
                        yValue = params.k * Math.pow(params.a, xValue /4) ;
                    }
                    break;
                case "logarithmic":
                    yValue = params.a * Math.log(params.b * xValue);
                    break;
                case "power":
                    yValue = params.a * xValue ** params.n;
                    break;
                case "trigonometric":
                    yValue = params.amplitude * Math.sin(params.frequency * xValue + params.phase);
                    break;
                case "general-sine-cosine":
                    yValue = params.a * Math.sin(params.b * xValue + params.c) + params.d * Math.cos(params.b * xValue + params.c);
                    break;
                case "step":
                    yValue = Math.sign(xValue - params.step);
                    break;
                case "custom":
                    // Replace this with your custom function implementation
                    yValue = eval(params.customFunction.replace(/x/g, xValue));
                    break;
                case "piecewise":
                    // Replace this with your piecewise function implementation
                    yValue = eval(params.piecewiseFunction.replace(/x/g, xValue));
                    break;
                default:
                    yValue = 0;
            }

            // Convert the calculated y-value to pixel coordinates
            const y = height / 2 - yValue * scale;

            // Draw the line segment to the next pixel
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Finish drawing the function
        ctx.stroke();

        // Draw the x and y axes
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
    }



    function showParameterInputs() {
        const selectedFunction = functionSelect.value;
        parameterInputs.innerHTML = "";

        switch (selectedFunction) {
            case "linear":
                functionexpression.innerHTML = `
                    表达式：y = kx + b
                `;
                parameterInputs.innerHTML = `
              <label for="m-input">k:</label>
              <input type="number" id="m-input" step="any" required>
              <br>
              <label for="c-input">b:</label>
              <input type="number" id="c-input" step="any" required>
            `;
                break;
            case "proportional":
                functionexpression.innerHTML = `
                    表达式：y = kx
                `;
                parameterInputs.innerHTML = `
              <label for="k-input">k:</label>
              <input type="number" id="k-input" step="any" required>
            `;
                break;
            case "inverse-proportional":
                functionexpression.innerHTML = `
                    表达式：y =  ${fracCode('k','x')}
                `;
                parameterInputs.innerHTML = `
              <label for="k-input">k:</label>
              <input type="number" id="k-input" step="any" required>
            `;
                break;
            case "quadratic":
                functionexpression.innerHTML = `
                    表达式：y = <span>ax${supcode(2)} + bx + c</span>
                `;
                parameterInputs.innerHTML = `
              <label for="a-input">a:</label>
              <input type="number" id="a-input" step="any" value="1" required>
              <br>
              <label for="b-input">b:</label>
              <input type="number" id="b-input" step="any" required>
              <br>
              <label for="c-input">c:</label>
              <input type="number" id="c-input" step="any" required>
            `;
                break;
            case "exponential":
                functionexpression.innerHTML = `
                    表达式：y = k<span>a${supcode('x')}</span>
                `;
                parameterInputs.innerHTML = `
              <label for="a-input">k:</label>
              <input type="number" id="k-input" step="any" value="1" required>
              <br>
              <label for="b-input">a:</label>
              <input type="number" id="a-input" step="any" required>
            `;
                break;
            case "logarithmic":
                parameterInputs.innerHTML = `
              <label for="a-input">a:</label>
              <input type="number" id="a-input" step="any" required>
              <br>
              <label for="b-input">b:</label>
              <input type="number" id="b-input" step="any" required>
            `;
                break;
            case "power":
                parameterInputs.innerHTML = `
              <label for="a-input">a:</label>
              <input type="number" id="a-input" step="any" required>
              <br>
              <label for="n-input">n:</label>
              <input type="number" id="n-input" step="any" required>
            `;
                break;
            case "trigonometric":
                parameterInputs.innerHTML = `
                  <label for="amplitude-input">Amplitude:</label>
                  <input type="number" id="amplitude-input" step="any" required>
                  <br>
                  <label for="frequency-input">Frequency:</label>
                  <input type="number" id="frequency-input" step="any" required>
                  <br>
                  <label for="phase-input">Phase:</label>
                  <input type="number" id="phase-input" step="any" required>
                `;
                break;
            case "general-sine-cosine":
                parameterInputs.innerHTML = `
                  <label for="a-input">a:</label>
                  <input type="number" id="a-input" step="any" required>
                  <br>
                  <label for="b-input">b:</label>
                  <input type="number" id="b-input" step="any" required>
                  <br>
                  <label for="c-input">c:</label>
                  <input type="number" id="c-input" step="any" required>
                  <br>
                  <label for="d-input">d:</label>
                  <input type="number" id="d-input" step="any" required>
                `;
                break;
            case "step":
                parameterInputs.innerHTML = `
                  <label for="step-input">Step Value:</label>
                  <input type="number" id="step-input" step="any" required>
                `;
                break;
            case "custom":
                parameterInputs.innerHTML = `
                  <label for="custom-function-input">Custom Function:</label>
                  <input type="text" id="custom-function-input" required>
                `;
                break;
            case "piecewise":
                parameterInputs.innerHTML = `
                  <label for="piecewise-function-input">Piecewise Function:</label>
                  <input type="text" id="piecewise-function-input" required>
                `;
                break;
            default:
                parameterInputs.innerHTML = "";
        }
    }
    function fracCode(numerator,denominator){
        return '<span class="frac"><div class="frac1">' + numerator + '</div><div class="split"></div><div class="frac2">' + denominator + '</div></span>'
    }
    function supcode(n){
        return `<sup>${n}</sup>`
    }
    function getFunctionParameters(selectedFunction) {
        const params = {};

        switch (selectedFunction) {
            case "linear":
                params.m = parseFloat(document.getElementById("m-input").value);
                params.c = parseFloat(document.getElementById("c-input").value);
                break;
            case "proportional":
                params.k = parseFloat(document.getElementById("k-input").value);
                break;
            case "inverse-proportional":
                params.k = parseFloat(document.getElementById("k-input").value);
                break;
            case "quadratic":
                params.a = parseFloat(document.getElementById("a-input").value);
                params.b = parseFloat(document.getElementById("b-input").value);
                params.c = parseFloat(document.getElementById("c-input").value);
                break;
            case "exponential":
                params.k = parseFloat(document.getElementById("k-input").value);
                params.a = parseFloat(document.getElementById("a-input").value);
                break;
            case "logarithmic":
                params.a = parseFloat(document.getElementById("a-input").value);
                params.b = parseFloat(document.getElementById("b-input").value);
                break;
            case "power":
                params.a = parseFloat(document.getElementById("a-input").value);
                params.n = parseFloat(document.getElementById("n-input").value);
                break;
            case "trigonometric":
                params.amplitude = parseFloat(document.getElementById("amplitude-input").value);
                params.frequency = parseFloat(document.getElementById("frequency-input").value);
                params.phase = parseFloat(document.getElementById("phase-input").value);
                break;
            case "general-sine-cosine":
                params.a = parseFloat(document.getElementById("a-input").value);
                params.b = parseFloat(document.getElementById("b-input").value);
                params.c = parseFloat(document.getElementById("c-input").value);
                params.d = parseFloat(document.getElementById("d-input").value);
                break;
            case "step":
                params.step = parseFloat(document.getElementById("step-input").value);
                break;
            case "custom":
                params.customFunction = document.getElementById("custom-function-input").value;
                break;
            case "piecewise":
                params.piecewiseFunction = document.getElementById("piecewise-function-input").value;
                break;
        }

        return params;
    }

    functionSelect.addEventListener("change", showParameterInputs);
    drawButton.addEventListener("click", function () {
        const selectedFunction = functionSelect.value;
        const params = getFunctionParameters(selectedFunction);
        drawFunction(selectedFunction, params);
    });
});

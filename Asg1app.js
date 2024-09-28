<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebGL Color Changer</title>
    <style>
        canvas {
            display: block;
            margin: 0 auto;
            padding-top: 20px;
        }
        .controls {
            display: flex;
            justify-content: center;
            padding: 20px;
        }
        button {
            margin: 5px;
            padding: 10px;
        }
    </style>
</head>
<body>

    <canvas id="glCanvas" width="640" height="480"></canvas>

    <div class="controls">
        <button id="color1">Color 1</button>
        <button id="color2">Color 2</button>
        <button id="color3">Color 3</button>
        <button id="resetColor">Reset Color</button>
    </div>

    <script>
        // Wait for the page to load
        window.onload = function() {
            // Get canvas element
            const canvas = document.getElementById('glCanvas');
            // Init
            const gl = canvas.getContext('webgl');

            // Only continue if WebGL is available and working
            if (!gl) {
                alert('Unable to initialize WebGL. Your browser may not support it.');
                return;
            }

            // Default color to red
            let currentColor = [1.0, 0.0, 0.0, 1.0];

            // Vertex shader program
            const vsSource = `
                attribute vec4 aVertexPosition;
                void main() {
                    gl_Position = aVertexPosition;
                }
            `;

            // Fragment shader program with dynamic color
            const fsSource = `
                precision mediump float;
                uniform vec4 uColor;
                void main() {
                    gl_FragColor = uColor;
                }
            `;

            // Init shader program
            const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

            // Get attribute and uniform locations
            const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            const uColor = gl.getUniformLocation(shaderProgram, 'uColor');

            // Create a buffer for the rectangle's positions.
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Define positions for a 2D object
            const positions = [
                -0.5,  0.5,
                 0.5,  0.5,
                -0.5, -0.5,
                 0.5, -0.5,
            ];

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            // Set up drawing
            function drawScene() {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                // Use shader program
                gl.useProgram(shaderProgram);

                // Set the position attribute
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(vertexPosition);

                // Set the color uniform
                gl.uniform4fv(uColor, currentColor);

                // Draw 2D object
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            // Button event listeners to change colors
            document.getElementById('color1').addEventListener('click', function() {
                currentColor = [1.0, 0.0, 0.0, 1.0]; // Red
                drawScene();
            });

            document.getElementById('color2').addEventListener('click', function() {
                currentColor = [0.0, 1.0, 0.0, 1.0]; // Green
                drawScene();
            });

            document.getElementById('color3').addEventListener('click', function() {
                currentColor = [0.0, 0.0, 1.0, 1.0]; // Blue
                drawScene();
            });

            document.getElementById('resetColor').addEventListener('click', function() {
                currentColor = [1.0, 0.0, 0.0, 1.0]; // Reset to Red (default)
                drawScene();
            });

            // Initial drawing
            drawScene();
        }

        // Initialize a shader program for WebGL
        function initShaderProgram(gl, vsSource, fsSource) {
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            // Create the shader program
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            // If creating the shader program failed, alert
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }

            return shaderProgram;
        }

        // Creates a shader of the given type, uploads the source and compiles it.
        function loadShader(gl, type, source) {
            const shader = gl.createShader(type);

            // Send the source to the shader object
            gl.shaderSource(shader, source);

            // Compile the shader program
            gl.compileShader(shader);

            // See if it compiled successfully
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
    </script>
</body>
</html>

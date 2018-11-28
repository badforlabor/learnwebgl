
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

var vertexBuffer, indexBuffer, indices
var shaderProgram


function initBuffer() {
    // uv坐标其实是[-1, 1]，（3D世界中，不是以像素为距离单位的，而是uv，uv的范围是[-1, 1]。具体为啥，可以查查资料
    // 这里，我们居中绘制一个三角形
    let vertices = [
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ]

    vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
}
function initShader() {
    let compileShader = (src, type) => {
        let shader = gl.createShader(type)
        gl.shaderSource(shader, src)
        gl.compileShader(shader)
        return shader
    }

    var vertCode = `
attribute vec2 a_position;

uniform mat3 u_matrix;

void main() {
    // Multiply the position by the matrix.
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
            `
    var fragCode = `
precision mediump float;

uniform vec4 u_color;

void main() {
   gl_FragColor = u_color;
}
            `
    var vs = compileShader(vertCode, gl.VERTEX_SHADER)
    var fs = compileShader(fragCode, gl.FRAGMENT_SHADER)

    shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vs)
    gl.attachShader(shaderProgram, fs)
    gl.linkProgram(shaderProgram)
}

var translation = [10, 0];
var angleInRadians = 0;
var scale = [1, 1];
var color = [Math.random(), Math.random(), Math.random(), 1];

window.setInterval(() => {
    translation = [Math.floor(Math.random() * gl.canvas.width / 2), Math.floor(Math.random() * gl.canvas.height / 2)]
    color = [Math.random(), Math.random(), Math.random(), 1];
    angleInRadians = (angleInRadians + 10) % 360
    scale = [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5]
}, 1000)

function drawOne() {
    gl.useProgram(shaderProgram)
    var positionLocation = gl.getAttribLocation(shaderProgram, "a_position")
    var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
    var matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionLocation)

    gl.uniform4fv(colorLocation, color);

    var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // 绘制顶点
    gl.drawArrays(gl.TRIANGLES, 0, 18)
}

function drawScene() {
    // 清除颜色，并设置基础颜色为黑色
    gl.clearColor(0, 0, 0, 1)

    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    drawOne()


    // console.log("draw every frame")
    requestAnimationFrame(drawScene)
}

initBuffer()
initShader()
drawScene()

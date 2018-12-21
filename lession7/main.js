
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

var vertexBuffer, indexBuffer, indices
var shaderProgram


function initBuffer() {
    // uv坐标其实是[-1, 1]，（3D世界中，不是以像素为距离单位的，而是uv，uv的范围是[-1, 1]。具体为啥，可以查查资料
    // 这里，我们居中绘制一个三角形
    let vertices = [
        // left column
        -0.7, -1,
        -1, 0.9,
        1, -1,

        0.2, 0.6,
        0.3, -0.3,
        0.7, 0.6
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

void main() {
    // Multiply the position by the matrix.
    gl_Position = vec4(a_position.xy, 0, 1);
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

function drawOne(color) {
    gl.useProgram(shaderProgram)
    var positionLocation = gl.getAttribLocation(shaderProgram, "a_position")
    var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionLocation)

    gl.uniform4fv(colorLocation, color);

    // 绘制顶点
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function drawScene() {
    // 清除颜色，并设置基础颜色为黑色
    gl.clearColor(0, 0, 0, 1)

    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.viewport(0, 0, canvas.width, canvas.height);
    drawOne([1, 0, 0, 1])

    // console.log("draw every frame")
    requestAnimationFrame(drawScene)
}

initBuffer()
initShader()
drawScene()

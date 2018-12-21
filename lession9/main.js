//http://twgljs.org/docs/module-twgl_m4.html

"use strict";

const v3 = twgl.v3
const m4 = twgl.m4

var eyePosition, target

var pixelRatio = window.devicePixelRatio || 1;
var scale = 1

function main(params) {
    var canvas = document.getElementById("canvas")
    var gl = canvas.getContext("webgl")
    if (!gl) {
        return
    }

    const eyeElem = document.querySelector("#eye");

    var wireCubeArrays = {
        position: [
            -1, 1, -1,
            1, 1, -1,
            1, -1, -1,
            -1, -1, -1,

            -1, 1, 1,
            1, 1, 1,
            1, -1, 1,
            -1, -1, 1,
        ],
        color: [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
        ],
        indices: [
            0, 1, 1, 2, 2, 3, 3, 0,
            4, 5, 5, 6, 6, 7, 7, 4,
            0, 4, 1, 5, 2, 6, 3, 7,
        ],
    };
    // 画线框
    var wireCubeBufferInfo = twgl.createBufferInfoFromArrays(gl, wireCubeArrays);

    var vertexColorProgramInfo = twgl.createProgramInfo(gl, [
        'vertexColorVertexShader',
        'vertexColorFragmentShader',
    ]);


    // 射线
    var cubeRaysArrays = {
        position: wireCubeArrays.position,
        color: [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
        ],
        indices: [
            0, 4, 1, 5, 2, 6, 3, 7,
        ],
    };
    var cubeRaysBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeRaysArrays);

    var colorProgramInfo = twgl.createProgramInfo(gl, [
        'baseVertexShader',
        'colorFragmentShader',
    ]);

    // 立方体
    var cubeArrays = twgl.primitives.createCubeVertices(2);
    delete cubeArrays.normal;
    delete cubeArrays.texcoord;
    var faceColors = [
        [1, 0, 0, 1,],
        [0, 1, 0, 1,],
        [1, 1, 0, 1,],
        [0, 0, 1, 1,],
        [1, 0, 1, 1,],
        [0, 1, 1, 1,],
    ];
    var colorVerts = [];
    for (var f = 0; f < 6; ++f) {
        for (var v = 0; v < 4; ++v) {
            colorVerts.push(...faceColors[f]);
        }
    }
    cubeArrays.color = colorVerts;
    var cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);

    var fBufferInfo = twgl.createBufferInfoFromArrays(gl, {
        position: [
            // left column front
            0, 0, 0,
            0, 150, 0,
            30, 0, 0,
            0, 150, 0,
            30, 150, 0,
            30, 0, 0,

            // top rung front
            30, 0, 0,
            30, 30, 0,
            100, 0, 0,
            30, 30, 0,
            100, 30, 0,
            100, 0, 0,

            // middle rung front
            30, 60, 0,
            30, 90, 0,
            67, 60, 0,
            30, 90, 0,
            67, 90, 0,
            67, 60, 0,

            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,

            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,

            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,

            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,

            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,

            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,

            // between top rung and middle
            30, 30, 0,
            30, 60, 30,
            30, 30, 30,
            30, 30, 0,
            30, 60, 0,
            30, 60, 30,

            // top of middle rung
            30, 60, 0,
            67, 60, 30,
            30, 60, 30,
            30, 60, 0,
            67, 60, 0,
            67, 60, 30,

            // right of middle rung
            67, 60, 0,
            67, 90, 30,
            67, 60, 30,
            67, 60, 0,
            67, 90, 0,
            67, 90, 30,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 150, 30,
            30, 90, 30,
            30, 90, 0,
            30, 150, 0,
            30, 150, 30,

            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,

            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0,
        ],
        color: {
            numComponents: 3,
            data: new Uint8Array([
                // left column front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // top rung front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // middle rung front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // left column back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // middle rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,

                // top rung right
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,

                // under top rung
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,

                // between top rung and middle
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,

                // top of middle rung
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,

                // right of middle rung
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,

                // bottom of middle rung.
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,

                // right of bottom
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,

                // bottom
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,

                // left side
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
            ]),
        },
    });



    var projection = new Float32Array(16);
    var exampleProjection = new Float32Array(16);
    var exampleInverseProjection = new Float32Array(16);
    var view = new Float32Array(16);
    var world = new Float32Array(16);
    var viewProjection = new Float32Array(16);
    eyePosition = new Float32Array([31, 17, 15]);
    var worldViewProjection = new Float32Array(16);
    var exampleWorldViewProjection = new Float32Array(16);
    target = new Float32Array([23, 16, 0]);
    var up = new Float32Array([0, 1, 0]);
    var v3t0 = new Float32Array(3);
    var zeroMat = new Float32Array(16);

    var targetToEye = new Float32Array(3);
    v3.subtract(eyePosition, target, targetToEye)

    var sharedUniforms = {
    };

    var sceneCubeUniforms = {
        u_color: [1, 1, 1, 1],
        u_worldViewProjection: worldViewProjection,
        u_exampleWorldViewProjection: exampleWorldViewProjection,
    };

    var frustumCubeUniforms = {
        u_color: [1, 1, 1, 0.4],
        u_worldViewProjection: worldViewProjection,
        u_exampleWorldViewProjection: zeroMat,
    };

    var cubeRaysUniforms = {
        u_color: [1, 1, 1, 1],
        u_worldViewProjection: worldViewProjection,
    };

    var wireFrustumUniforms = {
        u_color: [1, 0, 0, 1],
        u_worldViewProjection: worldViewProjection,
    };


    var zNear = 10;
    var zFar = 50;
    var fieldOfView = 30;
    var zPosition = -25;

    // Setup a ui.
    function updateFieldOfView(event, ui) {
        fieldOfView = ui.value;
    }

    function updateZNear(event, ui) {
        zNear = ui.value;
    }

    function updateZFar(event, ui) {
        zFar = ui.value;
    }

    function updateZPosition(event, ui) {
        zPosition = ui.value;
    }

    webglLessonsUI.setupSlider("#fieldOfView", { value: fieldOfView, slide: updateFieldOfView, max: 179 });
    webglLessonsUI.setupSlider("#zNear", { value: zNear, slide: updateZNear, min: 1, max: 50 });
    webglLessonsUI.setupSlider("#zFar", { value: zFar, slide: updateZFar, min: 1, max: 50 });
    webglLessonsUI.setupSlider("#zPosition", { value: zPosition, slide: updateZPosition, min: -60, max: 0 });

    // 渲染
    function render(time) {
        time = time * 0.001

        twgl.resizeCanvasToDisplaySize(canvas, pixelRatio);

        const halfHeight = gl.canvas.height / 2;
        const width = gl.canvas.width;

        gl.disable(gl.SCISSOR_TEST);
        gl.colorMask(true, true, true, true);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 下半屏
        gl.viewport(0, halfHeight, width, halfHeight);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        var aspect = gl.canvas.clientWidth / (gl.canvas.clientHeight / 2);
        m4.perspective(
            degToRad(60),
            aspect,
            1,
            5000,
            projection);

        var f = Math.max(30, fieldOfView) - 30
        f = f / (179 - 30)
        f = f * f * f * f
        f = lerp(1, 179 * 0.9, f)
        f = 1
        v3.mulScalar(targetToEye, f, v3t0)
        v3.add(v3t0, target, v3t0)
        m4.lookAt(v3t0, target, up, view);
        m4.inverse(view, view);
        m4.multiply(projection, view, viewProjection)

        // 画三个立方体+视锥体
        function drawScene(viewProjection, exampleProjection) {
            //return
            gl.useProgram(colorProgramInfo.program)
            twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo)

            // 三个立方体
            var cubeScale = scale * 3
            for (var ii = -1; ii <= 1; ii++) {
                m4.translation([ii * 10, 0, zPosition], world)
                m4.rotateY(world, time + ii * Math.PI / 6, world)
                m4.rotateX(world, Math.PI / 4, world)
                m4.rotateZ(world, Math.PI / 4, world)
                m4.scale(world, [cubeScale, cubeScale, cubeScale], world)
                m4.multiply(viewProjection, world, worldViewProjection)
                m4.multiply(exampleProjection, world, exampleWorldViewProjection)

                twgl.setUniforms(colorProgramInfo, sceneCubeUniforms)
                twgl.drawBufferInfo(gl, cubeBufferInfo)
            }

            // 一个视锥体
            var rotation = [degToRad(40), degToRad(25), degToRad(325)]
            m4.translation([45, 150, 0], world)
            m4.rotateX(world, rotation[0], world)
            m4.rotateY(world, rotation[1], world)
            m4.rotateZ(world, rotation[2], world)
            m4.multiply(viewProjection, world, worldViewProjection)
            m4.multiply(exampleProjection, world, exampleWorldViewProjection)
            twgl.setBuffersAndAttributes(gl, colorProgramInfo, fBufferInfo)
            twgl.setUniforms(colorProgramInfo, sceneCubeUniforms)
            twgl.drawBufferInfo(gl, fBufferInfo)
        }
        drawScene(viewProjection, exampleProjection)

        // 绘制视锥体的6个面
        function drawFrustumCube() {
            gl.useProgram(colorProgramInfo.program)
            twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeBufferInfo)

            m4.perspective(degToRad(fieldOfView),
                aspect, zNear, zFar * scale, exampleProjection)
            m4.inverse(exampleProjection, exampleInverseProjection)

            m4.translation([0, 0, 0], world)
            m4.multiply(exampleInverseProjection, world, world)
            m4.scale(world, [scale, scale, scale], world)
            m4.multiply(viewProjection, world, worldViewProjection)

            twgl.setUniforms(colorProgramInfo, sharedUniforms)
            twgl.setUniforms(colorProgramInfo, frustumCubeUniforms)
            twgl.drawBufferInfo(gl, cubeBufferInfo)
        }

        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        drawFrustumCube()
        gl.disable(gl.CULL_FACE)

        // 画眼睛+黑色射线
        {
            m4.perspective(degToRad(fieldOfView), aspect, 1, 5000, exampleProjection)
            m4.inverse(exampleProjection, exampleInverseProjection)

            m4.translation([0, 0, 0], world)
            m4.multiply(world, exampleInverseProjection, world)
            m4.scale(world, [scale, scale, scale], world)
            m4.multiply(viewProjection, world, worldViewProjection)

            gl.useProgram(vertexColorProgramInfo.program)
            twgl.setBuffersAndAttributes(gl, vertexColorProgramInfo, cubeRaysBufferInfo)
            twgl.setUniforms(vertexColorProgramInfo, sharedUniforms)
            twgl.setUniforms(vertexColorProgramInfo, cubeRaysUniforms)
            twgl.drawBufferInfo(gl, cubeRaysBufferInfo, gl.LINES);

            {
                const eyePosition = m4.transformPoint(worldViewProjection, [0, 0, 0]);
                const ex = (eyePosition[0] * 0.5 + 0.5) * width / pixelRatio
                const ey = (eyePosition[1] * -0.5 + 0.5) * halfHeight / pixelRatio
                eyeElem.style.left = px(ex - eyeElem.width / 2)
                eyeElem.style.top = px(ey - eyeElem.height / 2)
            }
        }

        // 画红色视锥体线框
        {
            m4.perspective(degToRad(fieldOfView), aspect, zNear, zFar * scale, exampleProjection)
            m4.inverse(exampleProjection, exampleInverseProjection)

            m4.translation([0, 0, 0], world)
            m4.multiply(world, exampleInverseProjection, world)
            m4.scale(world, [scale, scale, scale], world)
            m4.multiply(viewProjection, world, worldViewProjection)

            twgl.setBuffersAndAttributes(gl, vertexColorProgramInfo, wireCubeBufferInfo)
            twgl.setUniforms(vertexColorProgramInfo, sharedUniforms)
            twgl.setUniforms(vertexColorProgramInfo, wireFrustumUniforms)
            twgl.drawBufferInfo(gl, wireCubeBufferInfo, gl.LINES)
        }

        gl.enable(gl.SCISSOR_TEST)
        gl.viewport(0, 0, width, halfHeight)
        gl.scissor(0, 0, width, halfHeight)
        gl.clearColor(0.5, 0.5, 0.5, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        m4.perspective(degToRad(fieldOfView), aspect, zNear, zFar * scale, projection)
        drawScene(exampleProjection, zeroMat)

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

function px(v) {
    return `${v | 0}px`;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function lerp(a, b, l) {
    return a + (b - a) * l;
}


main()


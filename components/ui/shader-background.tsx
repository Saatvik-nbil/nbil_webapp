"use client";

import { useEffect, useRef } from "react";

/**
 * Animated WebGL plasma-grid background.
 *
 * Scoped to its parent, not the viewport: the canvas is absolutely positioned
 * and sizes itself from its own box, so it only ever paints inside whichever
 * `relative` element renders it. Give that parent `overflow-hidden`.
 *
 * The render loop is paused while the canvas is off-screen and replaced by a
 * single static frame under `prefers-reduced-motion`.
 */

const VERTEX_SRC = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const FRAGMENT_SRC = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform vec2 iResolution;
  uniform float iTime;

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float axisWidth = 0.05;
  const float majorLineWidth = 0.025;
  const float minorLineWidth = 0.0125;
  const float majorLineFrequency = 5.0;
  const float minorLineFrequency = 1.0;
  const vec4 gridColor = vec4(0.5);
  const float scale = 5.0;
  // --color-brand #2d81e4
  const vec4 lineColor = vec4(0.176, 0.506, 0.894, 1.0);
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
  #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

  float drawGridLines(float axis) {
    return drawCrispLine(0.0, axisWidth, axis)
          + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
          + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
  }

  float drawGrid(vec2 space) {
    return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
  }

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
    float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec4 lines = vec4(0.0);
    // --color-dark-bg #0a1422 graded into a brand-tinted deep blue.
    vec4 bgColor1 = vec4(0.039, 0.078, 0.133, 1.0);
    vec4 bgColor2 = vec4(0.071, 0.180, 0.333, 1.0);

    for(int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

      line = line + circle;
      lines += line * lineColor * rand;
    }

    fragColor = mix(bgColor1, bgColor2, uv.x);
    fragColor *= verticalFade;
    fragColor.a = 1.0;
    fragColor += lines;

    gl_FragColor = fragColor;
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  // The shaders are linked into the program; the objects themselves are no
  // longer needed and would otherwise leak.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Shader program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function ShaderBackground({
  className = "absolute inset-0 h-full w-full",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // This is a per-pixel shader with 16 iterations, so cap the pixel ratio —
    // a full 3x retina buffer costs ~9x the fragments for no visible gain.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const started = performance.now();

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let aVertexPosition = -1;
    let uResolution: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let frame = 0;
    let visible = false;
    let disposed = false;

    // Registered before the context is acquired so a loss can never slip
    // through unhandled. Without preventDefault the browser will not offer the
    // context back, and the section stays blank until a reload.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      program = null;
      buffer = null;
    };
    const onContextRestored = () => {
      if (disposed || !build()) return;
      gl?.viewport(0, 0, canvas.width, canvas.height);
      if (reduced) draw(0);
      else if (visible) start();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      console.warn("WebGL not supported; shader background skipped.");
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      return;
    }

    // A canvas hands back the same context object every time, lost or not, so
    // a context killed by a previous mount arrives here already dead and every
    // call against it silently no-ops. Ask for it back and let the restored
    // handler do the building.
    if (gl.isContextLost()) {
      gl.getExtension("WEBGL_lose_context")?.restoreContext();
    }

    function build() {
      if (!gl || gl.isContextLost()) return false;

      program = createProgram(gl);
      if (!program) return false;

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
      uResolution = gl.getUniformLocation(program, "iResolution");
      uTime = gl.getUniformLocation(program, "iTime");
      return true;
    }

    // Size from the canvas's own box, NOT the viewport, so the effect stays
    // inside whatever section renders it.
    function resize() {
      if (!gl) return false;
      const width = Math.max(1, Math.round(canvas!.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas!.clientHeight * dpr));
      if (canvas!.width === width && canvas!.height === height) return false;
      canvas!.width = width;
      canvas!.height = height;
      gl.viewport(0, 0, width, height);
      return true;
    }

    function draw(seconds: number) {
      if (!gl || !program) return;
      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl.uniform1f(uTime, seconds);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function loop() {
      resize();
      draw((performance.now() - started) / 1000);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (frame || reduced || disposed || !program) return;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    const ready = build();
    resize();

    const resizeObserver = new ResizeObserver(() => {
      if (!reduced) return; // the loop already resizes every frame
      if (resize()) draw(0);
    });
    resizeObserver.observe(canvas);

    let intersectionObserver: IntersectionObserver | undefined;

    if (reduced) {
      // Motion is off: paint one static frame and never start the loop.
      if (ready) draw(0);
    } else {
      // Don't burn GPU on a section nobody is looking at.
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { rootMargin: "120px" },
      );
      intersectionObserver.observe(canvas);
    }

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (!gl.isContextLost()) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
      // Deliberately NOT calling WEBGL_lose_context.loseContext() here. Strict
      // Mode mounts, tears down, then mounts again against the same canvas —
      // and a context killed on the way out comes back lost, so the shader
      // never compiles on the second pass. The context dies with the canvas.
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

const shader = 'textChild'

BABYLON.Effect.ShadersStore[shader + 'VertexShader'] = `
    attribute vec3 position;
    attribute vec2 uv;
    attribute float aOpacity;

    uniform mat4 worldViewProjection;

    varying vec2 vUv;
    varying float vOpacity;

    void main(){
        gl_Position = worldViewProjection * vec4(position, 1.0);

        vUv = uv;
        vOpacity = aOpacity;
    }
`
BABYLON.Effect.ShadersStore[shader + 'FragmentShader'] = `
    varying vec2 vUv;
    varying float vOpacity;

    uniform vec3 uColor;
    
    void main(){
        vec4 color = vec4(uColor, vOpacity);

        gl_FragColor = color;
    }
`

export default shader
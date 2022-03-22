export default {
    vertex: `
        attribute float aOpacity;
        attribute float aPointSize;
        
        varying float vOpacity;

        uniform float uPointSize;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aPointSize;
            vOpacity = aOpacity;
        }
    `,
    fragment: `
        varying float vOpacity;

        uniform vec3 uColor;
        // uniform sampler2D uTexture;
        uniform float uOpacity;

        void main(){
            // vec4 tex = texture(uTexture, gl_PointCoord);
            // vec4 color = tex * vec4(uColor, vOpacity * uOpacity);
            vec4 color = vec4(uColor, vOpacity * uOpacity);
            
            gl_FragColor = color;
        }
    `
}
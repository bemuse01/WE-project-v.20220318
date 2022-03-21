export default {
    vertex: `
        attribute float aOpacity;

        varying float vOpacity;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vOpacity = aOpacity;
        }
    `,
    fragment: `
        varying float vOpacity;

        uniform vec3 uColor;

        void main(){
            vec4 color = vec4(uColor, vOpacity);

            gl_FragColor = color;
        }
    `
}
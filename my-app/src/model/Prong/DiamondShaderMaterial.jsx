import { ShaderMaterial, Color } from 'three';

export const DiamondShaderMaterial = new ShaderMaterial({
  uniforms: {
    uColor: { value: new Color(1.0, 1.0, 1.0) },
    uBrightness: { value: 2.0 },
    uFresnelPower: { value: 6.0 },
    uIOR: { value: 2.417 },
  },

  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-modelViewPosition.xyz);
      vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform float uBrightness;
    uniform float uFresnelPower;

    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewDir);

      float fresnel = pow(1.0 - dot(viewDir, normal), uFresnelPower);
      fresnel = clamp(fresnel, 0.0, 1.0);

      vec3 sparkle = vec3(1.0) * fresnel * uBrightness;
      vec3 finalColor = uColor + sparkle;

      // Gamma correction
      finalColor = pow(finalColor, vec3(1.0 / 2.2));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,

  transparent: false,
});

import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Points } from 'three/src/objects/Points.js';
import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { Color } from 'three/src/math/Color.js';
import { vertex, fragment } from './shaders.js';
import { DEFAULT_POINT_RADIUS, getColor, getRadius } from './renderer-utils.js';

class PointRenderer {
    constructor(containerNode, width, height, canvas) {
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.pointData = [];
        this.containerNode = containerNode;
        this.width = width;
        this.height = height;
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(this.devicePixelRatio);
        this.renderer.setClearColor(0x00000000, 0);
        this.renderer.clear();
        if (!canvas) {
            this.rendererCanvasElement = this.renderer.domElement;
            this.rendererCanvasElement.style.position = 'absolute';
            this.rendererCanvasElement.style.top = '0';
            this.containerNode.appendChild(this.rendererCanvasElement);
        }
        // Set up camera
        this.camera = new OrthographicCamera(-0, this.width, -0, this.height, 0);
        // Set up scene
        this.scene = new Scene();
        // Initialize geometry of points
        this.initGeometry();
    }
    initGeometry() {
        const pointsMaterial = new ShaderMaterial({
            uniforms: {
                color: { value: new Color(0xffffff) },
                size: { value: DEFAULT_POINT_RADIUS },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
        });
        this.pointsGeometry = new BufferGeometry();
        this.pointsBuffer = new Points(this.pointsGeometry, pointsMaterial);
        this.pointsBuffer.frustumCulled = false;
        this.scene.add(this.pointsBuffer);
        this.camera.lookAt(this.scene.position);
    }
    initPointsAttributes() {
        var _a, _b, _c, _d, _e, _f;
        const numPoints = this.pointData.length;
        const pointsPositions = new Float32Array(numPoints * 3);
        const pointsColors = new Float32Array(numPoints * 4);
        const pointsSizes = new Float32Array(numPoints);
        (_a = this.pointsGeometry) === null || _a === void 0 ? void 0 : _a.setAttribute('position', new BufferAttribute(pointsPositions, 3));
        (_b = this.pointsGeometry) === null || _b === void 0 ? void 0 : _b.setAttribute('customColor', new BufferAttribute(pointsColors, 4));
        (_c = this.pointsGeometry) === null || _c === void 0 ? void 0 : _c.setAttribute('size', new BufferAttribute(pointsSizes, 1));
        this.pointsPositions = (_d = this.pointsBuffer) === null || _d === void 0 ? void 0 : _d.geometry.attributes.position;
        this.pointsColors = (_e = this.pointsBuffer) === null || _e === void 0 ? void 0 : _e.geometry.attributes.customColor;
        this.pointsSizes = (_f = this.pointsBuffer) === null || _f === void 0 ? void 0 : _f.geometry.attributes.size;
    }
    draw() {
        this.renderer.render(this.scene, this.camera);
    }
    update(points) {
        this.pointData = points;
        this.initPointsAttributes();
        this.pointData.forEach((p, i) => {
            var _a, _b;
            const color = getColor(p.color);
            const opacity = 1;
            const radius = getRadius(p.r, this.devicePixelRatio);
            (_a = this.pointsColors) === null || _a === void 0 ? void 0 : _a.setXYZW(i, color.r, color.g, color.b, opacity);
            (_b = this.pointsSizes) === null || _b === void 0 ? void 0 : _b.setX(i, radius);
        });
        const pointsColors = this.pointsColors;
        const pointsSizes = this.pointsSizes;
        pointsColors.needsUpdate = true;
        pointsSizes.needsUpdate = true;
        this.updatePointsPosition(points);
    }
    updatePointsPosition(points) {
        points.forEach((p, i) => {
            var _a;
            (_a = this.pointsPositions) === null || _a === void 0 ? void 0 : _a.setXYZ(i, p.x, p.y, 0);
        });
        const pointsPosition = this.pointsPositions;
        pointsPosition.needsUpdate = true;
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.renderer.setSize(this.width, this.height);
        this.camera.right = this.width;
        this.camera.bottom = this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }
    getCanvasElement() {
        return this.rendererCanvasElement;
    }
    destroy() {
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}

export { PointRenderer };
//# sourceMappingURL=renderer.js.map

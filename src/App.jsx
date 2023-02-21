import maplibreGl from 'maplibre-gl';
import { createRef, useEffect, useState } from 'react';
import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { IfcContainer } from './components/IfcContainer';

export default function App() {
  const [viewer, setViewer] = useState();
  const ifcContainer = createRef();
  useEffect(() => {
    const map = new maplibreGl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2.0283, 48.9244],
      zoom: 9,
    });

    const modelOrigin = [13.4453, 52.491];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0.72, 0];

    const modelAsMercatorCoordinate = maplibreGl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const scene = new Scene();
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      antialias: true,
    });
    renderer.autoClear = false;

    const customLayer = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',

      onAdd: function () {
        const ifcOnLoad = async (event) => {
          const file =
            event &&
            event.target &&
            event.target.files &&
            event.target.files[0];
          if (file && viewer) {
            const model = await viewer.IFC.loadIfc(file, true, (err) => err);
            await viewer.shadowDropper.renderShadow(model.modelID);
          }
        };

        const directionalLight = new DirectionalLight(0x404040);
        const directionalLight2 = new DirectionalLight(0x404040);
        const ambientLight = new AmbientLight(0x404040, 3);

        directionalLight.position.set(0, -70, 100).normalize();
        directionalLight2.position.set(0, 70, 100).normalize();

        scene.add(directionalLight, directionalLight2, ambientLight);
      },

      render: function (gl, matrix) {
        const rotationX = new Matrix4().makeRotationAxis(
          new Vector3(1, 0, 0),
          modelTransform.rotateX
        );
        const rotationY = new Matrix4().makeRotationAxis(
          new Vector3(0, 1, 0),
          modelTransform.rotateY
        );
        const rotationZ = new Matrix4().makeRotationAxis(
          new Vector3(0, 0, 1),
          modelTransform.rotateZ
        );

        const m = new Matrix4().fromArray(matrix);
        const l = new Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        camera.projectionMatrix = m.multiply(l);
        renderer.resetState();
        renderer.render(scene, camera);
        map.triggerRepaint();
      },
    };

    map.on('style.load', () => {
      map.addLayer(customLayer, 'waterway-label');
    });

    // if (ifcContainer.current) {
    //   const container = ifcContainer.current;
    //   const ifcViewer = new IfcViewerAPI({
    //     container,
    //     backgroundColor: new Color(0xffffff),
    //   });
    //   ifcViewer.IFC.loader.ifcManager.applyWebIfcConfig({
    //     COORDINATE_TO_ORIGIN: true,
    //     USE_FAST_BOOLS: false,
    //   });
    //   setViewer(ifcViewer);
    // }
  }, []);

  // const ifcOnLoad = async (event) => {
  //   const file =
  //     event && event.target && event.target.files && event.target.files[0];
  //   if (file && viewer) {
  //     const model = await viewer.IFC.loadIfc(file, true, (err) => err);
  //     await viewer.shadowDropper.renderShadow(model.modelID);
  //   }
  // };

  return (
    <div id='map' className='h-screen'>
      <div>
        <input type='file' id='file' accept='.ifc' onChange={ifcOnLoad} />
      </div>
      {/* <IfcContainer ref={ifcContainer} viewer={viewer} /> */}
    </div>
  );
}

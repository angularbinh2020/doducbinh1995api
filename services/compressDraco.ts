import assert from "assert";
import draco3d from "draco3d";
import JSZip from "jszip";

import {
  Vector2,
  Raycaster,
  PerspectiveCamera,
  Intersection,
  Mesh,
  Line,
  Vector3,
  Clock,
  WebGLRenderer,
  Scene,
  MeshStandardMaterial,
  Line3,
  Box3,
  Matrix4,
  BoxGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  LineSegments,
  LineBasicMaterial,
  LoadingManager,
  Group,
  AmbientLight,
  PointsMaterial,
  Color,
  Points,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { MeshBVH } from "three-mesh-bvh";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

let encoderModule!: draco3d.EncoderModule;

draco3d.createEncoderModule({}).then(function (module) {
  // This is reached when everything is ready, and you can call methods on
  // Module.
  encoderModule = module;
  console.log("Encoder Module Initialized!");
});

export async function CompressDraco() {
  const encoder = new encoderModule.Encoder();
  const meshBuilder = new encoderModule.MeshBuilder();
  const response: any = await fetch(
    "https://apiclient.wallmarttech.com:6006/files/221222-225101_OBJ-ba16.zip",
    {
      method: "GET",
    }
  );

  const isLoadSuccess = response.status === 200 || response.status === 0;
  if (isLoadSuccess) {
    const zip = await JSZip.loadAsync(response.blob());
    let mtlFilePath = "";
    let objFile!: JSZip.JSZipObject;
    let mtlFile!: JSZip.JSZipObject;
    let textureFile!: JSZip.JSZipObject;
    let plyFile!: JSZip.JSZipObject;
    zip.forEach(function (relativePath, file) {
      if (relativePath.endsWith(".obj")) objFile = file;
      if (relativePath.endsWith(".mtl")) {
        mtlFilePath = relativePath;
        mtlFile = file;
      }
      if (relativePath.endsWith(".jpg")) textureFile = file;
      if (relativePath.endsWith(".ply")) plyFile = file;
    });
    let mesh: Points | Group | null = null;
    if (plyFile) {
      const loader = new PLYLoader();
      const blob = await plyFile.async("blob");
      const geometry = await loader.loadAsync(URL.createObjectURL(blob));
      geometry.computeVertexNormals();
      geometry.center();
      const material = new PointsMaterial({
        size: 0.03,
        vertexColors: true,
      });
      mesh = new Points(geometry, material);
      if (geometry.boundingBox) {
        const { max, min } = geometry.boundingBox;
        mesh.position.set(
          (min.x + max.x) / 2,
          (max.y + min.y) / 2,
          (min.z + max.z) / 2
        );
      }
    } else {
      const blob = await textureFile.async("blob");
      const manager = new LoadingManager();
      manager.addHandler(/\.dds$/i, new DDSLoader());
      manager.setURLModifier((url) => {
        //@ts-ignore
        const newUrl = URL.createObjectURL(blob);
        return newUrl;
      });
      const mtlLoader = new MTLLoader(manager);
      const mtlContent = await mtlFile.async("string");
      const materials = mtlLoader.parse(mtlContent, mtlFilePath);
      const objContent = await objFile.async("blob");
      mesh = await new OBJLoader().loadAsync(URL.createObjectURL(objContent));
      mesh.
      encoder.EncodeMeshToDracoBuffer(mesh)
    }
    if (mesh) {
      if (!fileMap.current.has(fileUrl))
        fileMap.current.set(fileUrl, mesh.clone());
      //@ts-ignore
      if (isShow) loadColliderEnvironment(mesh);
    }
  } else {
    console.log("response status: " + response.statusText);
  }
}

import draco3d from "draco3d";
import JSZip from "jszip";
import fs from "fs";
import axios from "axios";
import { Mesh } from "three";
import { OBJLoader } from "./OBJLoader";
import logger from "./logger";

let encoderModule!: draco3d.EncoderModule;

draco3d.createEncoderModule({}).then(function (module) {
  // This is reached when everything is ready, and you can call methods on
  // Module.
  encoderModule = module;
  console.log("Encoder Module Initialized!");
});

export async function CompressDraco() {
  logger.info("start compress");
  const encoder = new encoderModule.Encoder();
  const meshBuilder = new encoderModule.MeshBuilder();
  const response = await axios(
    "https://apiclient.wallmarttech.com:6006/files/221222-225101_OBJ-ba16.zip",
    {
      method: "GET",
      responseType: "blob",
    }
  );

  //   const response = await fetch(
  //     "https://apiclient.wallmarttech.com:6006/files/221222-225101_OBJ-ba16.zip",
  //     {
  //       method: "GET",
  //     }
  //   );
  const fileZip = fs.readFileSync(
    __dirname + "/221222-225101_OBJ-ba16 (1).zip"
  );
  const zip = await JSZip.loadAsync(fileZip);
  const isLoadSuccess = response.status === 200 || response.status === 0;
  if (isLoadSuccess) {
    const zip = await JSZip.loadAsync(fileZip);
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
    if (plyFile) {
    } else {
      const objContent = await objFile.async("blob");
      //@ts-ignore
      const group = await new OBJLoader().loadAsync(
        URL.createObjectURL(objContent)
      );
      let indices: any[] = [];
      let vertices: any = [];
      let normals: any = [];
      group.traverse((object: any) => {
        if (object instanceof Mesh && object.geometry) {
          const attributes = object.geometry.attributes;
          attributes.normal.array.forEach(function (n: any) {
            normals.push(n);
          });
          attributes.uv.array.forEach(function (u: any) {
            indices.push(u);
          });
          attributes.position.array.forEach(function (p: any) {
            vertices.push(p);
          });
        }
      });
      const mesh: any = {
        indices: new Uint32Array(indices),
        vertices: new Float32Array(vertices),
        normals: new Float32Array(normals),
      };
      const dracoMesh = new encoderModule.Mesh();

      const numFaces = mesh.indices.length / 3;
      const numPoints = mesh.vertices.length;
      meshBuilder.AddFacesToMesh(dracoMesh, numFaces, mesh.indices);

      meshBuilder.AddFloatAttribute(
        dracoMesh,
        encoderModule.POSITION,
        numPoints,
        3,
        mesh.vertices
      );
      if (mesh.hasOwnProperty("normals")) {
        meshBuilder.AddFloatAttribute(
          dracoMesh,
          encoderModule.NORMAL,
          numPoints,
          3,
          mesh.normals
        );
      }
      if (mesh.hasOwnProperty("colors")) {
        meshBuilder.AddFloatAttribute(
          dracoMesh,
          encoderModule.COLOR,
          numPoints,
          3,
          mesh.colors
        );
      }
      if (mesh.hasOwnProperty("texcoords")) {
        meshBuilder.AddFloatAttribute(
          dracoMesh,
          encoderModule.TEX_COORD,
          numPoints,
          3,
          mesh.texcoords
        );
      }

      //   if (method === "edgebreaker") {
      //     encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
      //   } else if (method === "sequential") {
      //     encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
      //   }

      const encodedData = new encoderModule.DracoInt8Array();
      // Use default encoding setting.
      const encodedLen = encoder.EncodeMeshToDracoBuffer(
        dracoMesh,
        encodedData
      );
      const outputBuffer = new ArrayBuffer(encodedLen);
      const outputData = new Int8Array(outputBuffer);
      for (let i = 0; i < encodedLen; ++i) {
        outputData[i] = encodedData.GetValue(i);
      }
      fs.writeFile(
        "bunny_10.drc",
        Buffer.from(outputBuffer),
        "binary",
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        }
      );
      encoderModule.destroy(encodedData);
      encoderModule.destroy(dracoMesh);
      encoderModule.destroy(encoder);
      encoderModule.destroy(meshBuilder);
      logger.info("Compress success");
    }
  } else {
    console.log("response status: " + response.statusText);
  }
}

import draco3d from "draco3d";
import JSZip from "jszip";
import { OBJLoader } from "./OBJLoader";
import logger from "./logger";
import { DRACOExporter } from "./DracoEncoder";
import fs from "fs";

let encoderModule!: draco3d.EncoderModule;

draco3d.createEncoderModule({}).then(function (module) {
  // This is reached when everything is ready, and you can call methods on
  // Module.
  encoderModule = module;
  console.log("Encoder Module Initialized!");
});

export async function CompressDraco() {
  logger.info("start compress");
  const response = await fetch(
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
    if (plyFile) {
    } else {
      const dracoEncoder = new DRACOExporter(encoderModule);
      const objContent = await objFile.async("blob");
      //@ts-ignore
      const group = await new OBJLoader().loadAsync(
        URL.createObjectURL(objContent)
      );

      group.traverse((object: any) => {
        if (object.isMesh && object.geometry) {
          const result = dracoEncoder.parse(object);
          fs.appendFile("test.drc", Buffer.from(result), function (error) {
            if (error) {
              logger.error(error);
              return;
            }
            logger.info("Compress success");
          });
        }
      });
    }
  } else {
    console.log("response status: " + response.statusText);
  }
}

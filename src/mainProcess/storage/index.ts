// import path from 'path';
import fs from 'fs';
import { writeFileRecursive } from '../tools/index';

// const jsonFilePath = path.resolve(__dirname, './storage.json');
const jsonFilePath = './staticRun/storage.json';

export default {
  setValue: (name: string, value: any) => {
    let fileBuffer;

    if (fs.existsSync(jsonFilePath)) {
      fileBuffer = fs.readFileSync(jsonFilePath, {
        encoding: 'utf-8'
      });
    }

    const data = fileBuffer ? JSON.parse(fileBuffer) : {};
    
    const newStorage = {
      ...data,
      [name]: value
    }
    
    writeFileRecursive(jsonFilePath, JSON.stringify(newStorage));
  },
  getValue: (name: string) => {
    let fileBuffer;
    
    if (fs.existsSync(jsonFilePath)) {
      fileBuffer = fs.readFileSync(jsonFilePath, {
        encoding: 'utf-8'
      });
    }

    const data = fileBuffer ? JSON.parse(fileBuffer) : {};

    return data[name];
  }
  
}
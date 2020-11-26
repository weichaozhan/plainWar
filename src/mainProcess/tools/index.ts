import fs from 'fs';

export const writeFileRecursive = function(path: string, content: string){
  const lastPath = path.substring(0, path.lastIndexOf('/'));
  
  if (fs.existsSync(path)) {
    fs.writeFileSync(path, content);
  } else {
    fs.mkdir(lastPath, {recursive: true}, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      fs.writeFileSync(path, content);
    });
  }
};
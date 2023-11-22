import fs from 'node:fs/promises';

export const checkFile = async (path, createIfMissing = false) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (error) {
      console.log('error: ', error);
      await fs.writeFile(path, JSON.stringify([]));
      console.error(`Файл ${path} был создан`);
      return true;
    }
  }

  try {
    await fs.access(path);
  } catch (error) {
    console.log('error: ', error);
    console.error(`File ${path} not fond`);
    return false;
  }

  return true;
};
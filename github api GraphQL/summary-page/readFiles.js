
export function readFile(file) {
    return fetch(file).then(r => r.json());
}

/**
 * 
 * @param {it will take a file path and name read the document and will name the document by the file name} filesPath 
 */
export async function readAllFiles(files) {
    const data = await Promise.all(files.map(readFile));
    return files.reduce((acc, filesPath, index) => {
        const name = filesPath.split('/').slice(-1)[0].split('.')[0];
        acc[name] = data[index];
        return acc;
    }, {});
}

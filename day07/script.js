var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString().trimEnd();

let cwd = [];
let fileSystem = {
  name: "/",
  isDir: true,
  children: {},
  size: -1,
};

function changeDirectory(arg) {
  if (arg === "/") cwd = ["/"]
  if (arg === "..") cwd.pop()
  else cwd.push(arg) 
}

function addChild(name, isDir, size) {
  let final_dir = cwd.reduce(({children}, path_part) => (path_part==="/") ? fileSystem : children[path_part]);
  final_dir.children[name] = {
    name,
    isDir,
    children: {},
    size,
  };
}

// Read command log to build folder structure
data.split('\n')
  .map(l => l.trim().split(' '))
  .forEach(parts => {
    if (parts[0] === "$") {
      if (parts[1] === "cd") changeDirectory(parts[2]);
    } else {
      if (parts[0] === "dir") addChild(parts[1], true, -1);
      else addChild(parts[1], false, parseInt(parts[0]))
    }
  });

function computeStats(node) {
  if (!node.isDir) return;

  Object.values(node.children).forEach(child => computeStats(child));
  node.size = Object.values(node.children).reduce((sum, {size}) => sum + size, 0);
}
computeStats(fileSystem);

// Part 1
function sumSizesRecursive(node, total, limit) {
  if (!node.isDir) return total;
  let ownSize = (node.size < limit) ? node.size : 0 
  let childSize = Object.values(node.children).reduce(
    (prevTotal, child) => sumSizesRecursive(child, prevTotal, limit), 
    total
  );
  
  return ownSize + childSize 
}

console.log(`Total size of folders size < 100000: ${sumSizesRecursive(fileSystem, 0, 1e5)}`)


// Part 2
function findSmallestFolderToDelete(node, smallestDirSize, limit) {
  if (!node.isDir) return smallestDirSize;
  if (node.size > limit  && node.size < smallestDirSize) smallestDirSize = node.size;
 
  return Object.values(node.children).reduce(
    (prevSize, child) => findSmallestFolderToDelete(child, prevSize, limit),
    smallestDirSize
  );
}

const totalSpace = 7e7;
const spaceRequired = 3e7;
const spaceToFree = Math.max(spaceRequired - (totalSpace - fileSystem.size), 0)
const deletedFolderSize = findSmallestFolderToDelete(fileSystem, totalSpace, spaceToFree);
console.log(`Smallest folder size to provide enough space: ${deletedFolderSize}`);

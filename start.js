// start.js
import readline from "readline";
import { exec } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Entrez l'IP (ex: 0.0.0.0) : ", (ip) => {
  rl.question("Entrez le port (ex: 5173) : ", (port) => {
    console.log(`Lancement du projet sur http://${ip}:${port} ...`);
    
    // Lance vite dev avec l'IP et le port
    const cmd = `vite dev --host ${ip} --port ${port}`;
    
    const child = exec(cmd);

    child.stdout.on("data", (data) => console.log(data));
    child.stderr.on("data", (data) => console.error(data));
    
    rl.close();
  });
});

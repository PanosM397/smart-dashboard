import { move } from 'fs-extra';
move('dist/browser', 'dist', (err) => { if(err) { return console.error(err); } });

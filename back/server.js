import express from 'express';
import dotenv from 'dotenv';
import {exec} from 'child_process';
import open from 'open';
import expressLayouts from 'express-ejs-layouts';

import detectRoutes from './routes/detectRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
//Front

app.set('views', path.join(__dirname, '../front/views'));

//configurar ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);


const PORT = process.env.PORT || 4000;
app.use(express.json());



app.use(express.static(path.join(__dirname, '../front/public')));

/////
app.get('/', (req, res) => {
    res.render('pages/home', { layout: 'layout', title: 'Inicio' });
});

app.get('/about', (req, res) => {
    res.render('pages/about', { layout: 'layout', title: 'Acerca de' });
});

app.get('/abc', (req, res) => {
    res.render('pages/abc', { layout: 'layout', title: 'Abecedario' });
});

app.get('/escuela', (req,res) =>  {
    res.render('pages/escuela', {layout: 'layout', title: 'Escuela'});
});

app.get('/casa', (req,res) =>  {
    res.render('pages/casa', {layout: 'layout', title: 'Casa'});
});

app.get('/cuerpo', (req,res) => {
    res.render('pages/cuerpo', {layout: 'layout', title: 'Cuerpo Humano'});
});

app.get('/frutas', (req,res) =>  {
    res.render('pages/frutas', {layout: 'layout', title: 'Frutas'});
});

app.get('/utilesEscolares', (req,res) =>  {
    res.render('pages/utilesEscolares', {layout: 'layout', title: 'Utiles'});
});

app.use('/api', detectRoutes);
//console.log(path.join(__dirname, '../Front/index.html'));


/*app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
})*/


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


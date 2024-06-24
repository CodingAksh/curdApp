require('dotenv').config();
const express = require('express')
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))

const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'infos.json');

const readFile = () => {
    if (!fs.existsSync(dataFile)) {
        return [];
    }
    const rawData = fs.readFileSync(dataFile);
    return JSON.parse(rawData);

};

const writeFile = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};


app.get('/', (req, res) => {
    const items = readFile()
    res.render('index', { items })
});

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const { title, desc } = req.body

    const items = readFile()
    const newItem = {
        id: Date.now().toString(),
        title,
        desc
    }
    items.push(newItem)
    writeFile(items);
    res.redirect('/')
})

app.get('/edit/:id', (req, res) => {
    const items = readFile();
    const item = items.find(i => i.id === req.params.id);
    // console.log(item.desc);

    res.render('edit', { item });
})

app.post('/edit/:id', (req, res) => {
    const { id } = req.params
    const { title, desc } = req.body
    const items = readFile()

    const itemIndex = items.findIndex(i => i.id === id)
    items[itemIndex] = { ...items[itemIndex], title, desc }

    writeFile(items)
    res.redirect('/')
})

app.post('/delete/:id', (req, res) => {
    const { id } = req.params

    const  items = readFile()

    const filterDeleteItem = items.filter(i => i.id !== id)
    writeFile(filterDeleteItem)
    res.redirect('/')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


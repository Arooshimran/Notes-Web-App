const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({ extended: true }));

let notes = [];
app.get('/', (req, res) => {
  res.render('main', { notes });
});
app.get('/note/view/:id', (req, res) => {
  const noteId = req.params.id;
  const note = notes.find(n => n.id === noteId);
  if (note) {
    res.render('viewNote', { note });
  } else {
    res.status(404).send('Note not found');
  }
});

app.get('/note/:id?', (req, res) => {
  const noteId = req.params.id;
  const note = notes.find(n => n.id === noteId) || { id: '', title: '', content: '' };
  res.render('editNotes', { note });
});

app.post('/save-note', (req, res) => {
  const { id, title, content } = req.body;

  if (id) {
    const existingNote = notes.find(n => n.id === id);
    existingNote.title = title;
    existingNote.content = content;
  } else {
    const newNote = { id: Date.now().toString(), title, content };
    notes.push(newNote);
  }

  res.redirect('/');
});

app.post('/delete-note', (req, res) => {
  const { id } = req.body;
  notes = notes.filter(n => n.id !== id);
  res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

// --------PORT--------

const PORT = process.env.PORT || 8080

// --------VARIABLES TO MAKE CODE MORE CONDENSE--------

const dbDIR = (__dirname, "db");
const notesData = fs.readFileSync(path.resolve(dbDIR, "db.json"));
const noteJSON = JSON.parse(notesData);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// --------HTML ROUTES--------

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// --------API ROUTES--------

app.get("/api/notes", function(req, res) {
    noteId();
    res.json(noteJSON);
    console.log("Getting notes!");
});

app.post("/api/notes", function(req, res) {
    const note = req.body;
    noteJSON.push(note);
    noteId();
    fs.writeFileSync(path.resolve(dbDIR, "db.json"), JSON.stringify(noteJSON), "utf8");
    res.json(noteJSON);
    console.log("Note Created!");
});

app.delete("/api/notes/:id", function(req, res) {
    const noteID = req.params.id;
    noteId();
    noteJSON.splice(noteID, 1);
    fs.writeFileSync(path.resolve(dbDIR, "db.json"), JSON.stringify(noteJSON), "utf8");
    res.json(noteJSON);
    console.log("Note Deleted!");
});

// --------FUNCTION TO MAKE UNIQUE ID--------

const noteId = () => {
    for (let i = 0; i < noteJSON.length; i++) {
        noteJSON[i].id = i;
    }
};

// --------EXPRESS SERVER LISTENING--------

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.static('upload'));
app.use(express.json());

let photos = []; // Simulating a database with an array

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        if (file && file.originalname) {
            const extension = file.originalname.split('.').pop();
            cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
        } else {
            cb(new Error("File is missing or has no original name."));
        }
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('photo'), (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded.");
        const filename = req.file?.path.split('/').pop();
        if (!filename) throw new Error("Filename could not be determined.");
        const description = req.body.description || 'No description'; 
        const newPhoto = { filename, description };
        photos.push(newPhoto);
        res.status(201).send(newPhoto);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


app.get('/photos', (req, res) => {
    res.status(200).send(photos);
});

app.delete('/delete/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename) throw new Error("Filename is required.");

        photos = photos.filter(photo => photo.filename !== filename);
        res.status(200).send({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.put('/update/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const { description } = req.body;
        if (!description) throw new Error("Description is required for update.");
        let found = false;
        photos = photos.map(photo => {
            if (photo.filename === filename) {
                found = true;
                return { ...photo, description };
            }
            return photo;
        });
        if (!found) throw new Error("Photo not found.");
        res.status(200).send({ message: 'Updated successfully' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

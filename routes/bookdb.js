const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    const { search } = req.query;
  console.log(
    `Menerima permintaan GET untuk todos. Kriteria pencarian: '${search} || "Tidak ada"}'`
  );

  let query = "SELECT * FROM book";
  const params = [];

  if (search) {
    query += " WHERE judul LIKE ?";
    params.push(`%${search}%`);
  }

  db.query(query, params, (err, book) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Berhasil mengirim buku:", book.length, "item.");
    res.json({ book: book });
  });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Judul tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { judul } = req.body;
    console.log("Menerima permintaan POST untuk menambah judul:", judul);

    if (!judul) {
        console.error("judul tidak ditemukan di body permintaan.");
        return res.status(400).json({ error: 'Judul is required' });
    }
    const query = 'INSERT INTO book (judul) VALUES (?)';
    db.query(query, [judul], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("judul berhasil ditambahkan dengan ID:", result.insertId);
        res.status(201).json({ 
            message: 'Judul added successfully', 
            id: result.insertId,
            judul, 
        });
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { judul } = req.body;

    console.log(`Menerima permintaan PUT untuk ID: ${id} dengan data:`, req.body);

    // Cek apakah ada data yang dikirim untuk diupdate
    if (judul === undefined) {
        return res.status(400).json({ error: "Tidak ada data untuk diupdate." });
    }
    
    let updateFields = [];
    let queryValues = [];

    // Jika ada 'task' di body, siapkan untuk query SQL
    if (judul !== undefined) {
        updateFields.push("judul = ?");
        queryValues.push(judul);
    }

    const query = `UPDATE book SET ${updateFields.join(', ')} WHERE id = ?`;
    queryValues.push(id);

    db.query(query, queryValues, (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Buku tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log(`Buku dengan ID ${id} berhasil diperbarui.`);
        res.json({ message: 'Buku updated successfully' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Menerima permintaan DELETE untuk ID: ${id}`);
    const query = 'DELETE FROM book WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Database delete error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
            console.error("Todo tidak ditemukan untuk ID:", id);
            return res.status(404).json({ error: 'Todo not found' });
        }
        console.log(`Buku dengan ID ${id} berhasil dihapus.`);
        res.json({ message: 'Buku deleted successfully' });
    });
});

module.exports = router;
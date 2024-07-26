const express = require('express');
const router = express.Router();
const db = require('./db');

// Helper function to check for duplicate trade name
const checkDuplicateTradeName = (trade_name, callback) => {
  const query = `SELECT id FROM trade_categories WHERE trade_name = ?`;
  
  db.query(query, [trade_name], (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results.length > 0);
  });
};

// Helper function to find parent trade
const findParentTrade = (parent_trade, callback) => {
  const query = `SELECT id FROM trade_categories WHERE trade_name = ?`;

  db.query(query, [parent_trade], (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results.length > 0 ? results[0] : null);
  });
};

router.post('/trade', (req, res) => {
  const { trade_name, parent_trade } = req.body;

  if (!trade_name) {
    return res.status(400).json({ error: 'Trade name is required' });
  }

  // Check for duplicate trade name
  checkDuplicateTradeName(trade_name, (err, isDuplicate) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (isDuplicate) {
      return res.status(400).json({ error: 'Duplicate trade name found' });
    }

    
    // START of updated section
const insertTrade = (trade_name, parent_trade, res) => {
  db.query(
    `INSERT INTO trade_categories (trade_name, parent_trade) VALUES (?, ?)`,
    [trade_name, parent_trade],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ id: result.insertId, trade_name, parent_trade });
    }
  );
};

// If parent_trade is provided, check if it exists
if (parent_trade) {
  findParentTrade(parent_trade, (err, parent) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!parent) {
      return res.status(400).json({ error: 'Parent trade not found' });
    }

    // Insert new trade with parent trade
    insertTrade(trade_name, parent_trade, res);
  });
} else {
  // Insert new trade without parent trade
  insertTrade(trade_name, null, res);
}
// END of updated section

  });
});

// New route to get subcategories by parent trade
router.get('/subcategories/:parent_trade', (req, res) => {
  const { parent_trade } = req.params;

  db.query(`SELECT trade_name FROM trade_categories WHERE parent_trade = ?`, [parent_trade], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Parent trade not found or no subcategories' });
    }

    const subcategories = results.map(result => result.trade_name);
    res.json({ parent_trade, subcategories });
  });
});

router.get('/trades', (req, res) => {
  db.query(`SELECT * FROM trade_categories`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

module.exports = router;

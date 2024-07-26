SQL Table Creation:
CREATE TABLE `trade_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trade_name` varchar(255) NOT NULL,
  `parent_trade` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


1. DB Configuration:
in the .env file, configure the DB Settings -
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
PORT=

2. Testing adding a trade:

POST
http://localhost:3000/api/trade

Body - Raw JSON,

{
  "trade_name": "Music",
  "category_name": "Modern",
  "subcategory_name": "Pop"
}

3. View Trades:

GET
http://localhost:3000/api/trades

4. View Trade Subcategory
GET
http://localhost:3000/api/subcategories/Coaching
# Promptly_TradeList-API

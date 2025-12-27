CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(255)
);

CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(255),
  product_price DECIMAL(10,2),
  product_image VARCHAR(255)
);

CREATE TABLE product_detail (
  product_detail_id SERIAL PRIMARY KEY,
  product_id INT,
  size VARCHAR(255),
  color VARCHAR(255),
  stock INT,

  FOREIGN KEY (product_id)
    REFERENCES Product(product_id)
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT,

  ship_name VARCHAR(255),
  ship_phone VARCHAR(10),
ship_address VARCHAR(255)

  order_date TIMESTAMP,
  total_amount DECIMAL(10,2),
  status VARCHAR(255),

  FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
);

CREATE TABLE order_detail (
  order_detail_id SERIAL PRIMARY KEY,
  order_id INT,
  product_detail_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),

  FOREIGN KEY (order_id)
    REFERENCES Orders(order_id),

  FOREIGN KEY (product_detail_id)
    REFERENCES Product_detail(product_detail_id)
);
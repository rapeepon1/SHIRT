import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const app = express();
const port = 3000;
const saltRounds = 10;
const SECRET_KEY = "tar_secret"; // รหัสสำหรับตรวจสอบ Token

// Middleware สำหรับตรวจสอบ Token และดึงข้อมูล User
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    req.user = decoded;
    next();
  });
};

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Shirt_store",
  password: "rootroot",
  port: 5432,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "users" LIMIT 100 ');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error1");
  }
});

// ***** register *******
app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  console.log(req.body);
  try {
    const userExists = await pool.query(
      'SELECT * FROM "users" WHERE "email" = $1',
      [email]
    );
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO "users" ("email", "password", "first_name", "last_name", "role") VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, first_name, last_name, "user"]
    );
    res.status(201).json({ success: true, message: "ลงทะเบียนสำเร็จ" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error2");
  }
});

//****** login *******
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "users" WHERE "email" = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: "ไม่พบผู้ใช้" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.user_id, role: user.role }, 
        SECRET_KEY, 
        { expiresIn: '24h' }
      );
      res.json({ success: true, token, role: user.role });
    } else {
      res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
  } catch (err) {
    res.status(500).send("Server error3");
  }
});

// ****** product ******
app.get("/product", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_image,
        COALESCE(
          json_agg(
            json_build_object(
              'product_detail_id', pd.product_detail_id,
              'size', pd.size,
              'color', pd.color,
              'stock', pd.stock
            )
          ) FILTER (WHERE pd.product_detail_id IS NOT NULL),
          '[]'
        ) AS variants
      FROM product p
      LEFT JOIN product_detail pd 
        ON p.product_id = pd.product_id
      GROUP BY p.product_id
      ORDER BY p.product_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error4" });
  }
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_image,
        COALESCE(
          json_agg(
            json_build_object(
              'product_detail_id', pd.product_detail_id,
              'size', pd.size,
              'color', pd.color,
              'stock', pd.stock
            )
          ) FILTER (WHERE pd.product_detail_id IS NOT NULL),
          '[]'
        ) AS variants
      FROM product p
      LEFT JOIN product_detail pd
        ON p.product_id = pd.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err.message);
    res.status(500).json({ message: "Server error5" });
  }
});

app.post("/product", async (req, res) => {
  const { product_name, product_price, product_image, variants } = req.body;

  try {
    await pool.query("BEGIN");

// เพ่ิม
    const productRes = await pool.query(
      `INSERT INTO product (product_name, product_price, product_image)
       VALUES ($1, $2, $3)
       RETURNING product_id`,
      [product_name, product_price, product_image]
    );

    const productId = productRes.rows[0].product_id;


    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (!v.size || !v.color) continue;

        await pool.query(
          `INSERT INTO product_detail (product_id, size, color, stock)
           VALUES ($1, $2, $3, $4)`,
          [productId, v.size, v.color, v.stock || 0]
        );
      }
    }

    await pool.query("COMMIT");

    res.status(201).json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ message: "Server error5" });
  }
});

app.put("/product/:id", async (req, res) => {
  const { id } = req.params;
  const { product_name, product_price, product_image, variants } = req.body;

  try {
    await pool.query("BEGIN");

/// แก้ไข
    await pool.query(
      `
      UPDATE product
      SET product_name = $1,
          product_price = $2,
          product_image = COALESCE($3, product_image)
      WHERE product_id = $4
      `,
      [
        product_name,
        Number(product_price),
        product_image && product_image !== "" ? product_image : null,
        Number(id),
      ]
    );

// อัพเดต ถ้ายังไม่มี เพิ่ม
    if (Array.isArray(variants)) {
      for (const v of variants) {
        console.log(v)
        console.log(v.product_detail_id)
        if (!v.size || !v.color) continue;

        if (v.product_detail_id) {
          await pool.query(
            `
    UPDATE product_detail
    SET size = $1,
        color = $2,
        stock = $3
    WHERE product_detail_id = $4
    `,
            [v.size, v.color, Number(v.stock), v.product_detail_id]
          );
        } else {
          await pool.query(
            `
    INSERT INTO product_detail (product_id, size, color, stock)
    VALUES ($1, $2, $3, $4)
    `,
            [Number(id), v.size, v.color, Number(v.stock)]
          );
        }
      }
    }

    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Server error6" });
  }
});

//**** order ****
app.get("/order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // ดึง ID จาก Token ที่ถอดรหัสแล้ว
    const role = req.user.role;

    let queryText = `
      SELECT o.*, 
      json_agg(json_build_object('name', p.product_name, 'quantity', od.quantity, 'price', od.unit_price)) 
      FILTER (WHERE p.product_name IS NOT NULL) as items
      FROM orders o
      LEFT JOIN order_detail od ON o.order_id = od.order_id
      LEFT JOIN product_detail pd ON od.product_detail_id = pd.product_detail_id
      LEFT JOIN product p ON pd.product_id = p.product_id
    `;

    // ถ้าไม่ใช่ Admin ให้เห็นเฉพาะของตัวเอง
    if (role !== 'admin') {
      queryText += ` WHERE o.user_id = $1 `;
    }
    
    queryText += ` GROUP BY o.order_id ORDER BY o.order_date DESC`;

    const result = (role !== 'admin') 
      ? await pool.query(queryText, [userId]) 
      : await pool.query(queryText);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server error7");
  }
});

app.post("/order", authenticateToken, async (req, res) => {
  const { items, total_amount, address, status } = req.body;
  const userId = req.user.id; // ดึง ID จาก Token ที่ผ่านการตรวจสอบแล้ว

  try {
    await pool.query("BEGIN");

    const orderRes = await pool.query(
      `INSERT INTO orders
       (user_id, ship_name, ship_phone, ship_address, order_date, total_amount, status)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)
       RETURNING order_id`,
      [userId, address.name, address.phone, address.detail, total_amount, status]
    );

    const orderId = orderRes.rows[0].order_id;
    for (const item of items) {
      // ตรวจ stock
      const stockRes = await pool.query(
        `SELECT stock FROM product_detail
         WHERE product_detail_id = $1 FOR UPDATE`,
        [item.product_detail_id]
      );

      if (
        stockRes.rows.length === 0 ||
        stockRes.rows[0].stock < item.quantity
      ) {
        throw new Error("สินค้าหมด");
      }

      // เพิ่ม
      await pool.query(
        `INSERT INTO order_detail
         (order_id, product_detail_id, quantity, unit_price)
         VALUES ($1,$2,$3,$4)`,
        [orderId, item.product_detail_id, item.quantity, item.price]
      );

      // ตัด stock
      await pool.query(
        `UPDATE product_detail
         SET stock = stock - $1
         WHERE product_detail_id = $2`,
        [item.quantity, item.product_detail_id]
      );
    }

    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

app.put("/order/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await pool.query("UPDATE orders SET status=$1 WHERE order_id=$2", [
    status,
    id,
  ]);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Sever running at port ${port}`);
});

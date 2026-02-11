/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products with optional filtering and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., "Feeding & Hydration")
 *       - in: query
 *         name: supplier
 *         schema:
 *           type: integer
 *         description: Filter by supplier ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name, newest]
 *         description: Sort order (price_asc, price_desc, name, newest)
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * 
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

import express from 'express';
import { Product } from '../models/product';
import { products as seedProducts } from '../seedData';

const router = express.Router();

let products: Product[] = [...seedProducts];

// Create a new product
router.post('/', (req, res) => {
  const newProduct: Product = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Get all products with optional filtering and sorting
router.get('/', (req, res) => {
  let filteredProducts = [...products];

  // Filter by category
  if (req.query.category) {
    const category = req.query.category as string;
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Filter by supplier
  if (req.query.supplier) {
    const supplierId = parseInt(req.query.supplier as string);
    filteredProducts = filteredProducts.filter(p => p.supplierId === supplierId);
  }

  // Filter by price range
  if (req.query.minPrice) {
    const minPrice = parseFloat(req.query.minPrice as string);
    filteredProducts = filteredProducts.filter(p => {
      const effectivePrice = p.discount ? p.price * (1 - p.discount) : p.price;
      return effectivePrice >= minPrice;
    });
  }

  if (req.query.maxPrice) {
    const maxPrice = parseFloat(req.query.maxPrice as string);
    filteredProducts = filteredProducts.filter(p => {
      const effectivePrice = p.discount ? p.price * (1 - p.discount) : p.price;
      return effectivePrice <= maxPrice;
    });
  }

  // Sort products
  if (req.query.sort) {
    const sort = req.query.sort as string;
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount) : b.price;
          return priceB - priceA;
        });
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // Sort by productId descending (assuming higher IDs are newer)
        filteredProducts.sort((a, b) => b.productId - a.productId);
        break;
    }
  }

  res.json(filteredProducts);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.productId === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// Update a product by ID
router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = req.body;
    res.json(products[index]);
  } else {
    res.status(404).send('Product not found');
  }
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;

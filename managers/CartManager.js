const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.nextId = 0;
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
      }
    } catch (error) {
      this.carts = [];
    }
  }

  async createCart() {
    const newCart = {
      id: this.nextId,
      products: []
    };
    this.carts.push(newCart);
    this.nextId++;
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    return this.carts.find(c => c.id === parseInt(id));
  }

  async addProductToCart(cartId, productId) {
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex !== -1) {
      const productIndex = this.carts[cartIndex].products.findIndex(p => p.product === parseInt(productId));
      if (productIndex !== -1) {
        this.carts[cartIndex].products[productIndex].quantity++;
      } else {
        this.carts[cartIndex].products.push({ product: parseInt(productId), quantity: 1 });
      }
      await this.saveCarts();
      return this.carts[cartIndex];
    }
    throw new Error('Cart not found');
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }
}

module.exports = CartManager;
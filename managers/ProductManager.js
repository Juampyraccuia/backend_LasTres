const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 0;
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
      }
    } catch (error) {
      console.log("Initializing with empty products array");
      this.products = [];
    }
  }

  async addProduct(productData) {
    const newProduct = {
      id: this.nextId,
      ...productData
    };
    this.products.push(newProduct);
    this.nextId++;
    await this.saveProducts();
    return newProduct;
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    return this.products.find(p => p.id === parseInt(id));
  }

  async updateProduct(id, updateData) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updateData, id: parseInt(id) };
      await this.saveProducts();
      return this.products[index];
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== parseInt(id));
    if (this.products.length < initialLength) {
      await this.saveProducts();
    } else {
      throw new Error('Product not found');
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }
}

module.exports = ProductManager;
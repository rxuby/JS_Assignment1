const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let shoppingCart = [];

function main() {
    promptUser();
}

function promptUser() {
    rl.question('กรุณาพิมพ์คำสั่ง(ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า, exit):  ', (user_input) => {
        const [command, product_id] = user_input.split(' '); 
        
        if (command === "ดูรายการสินค้า") {
            product_list(promptUser);
        } else if (command === "ดูประเภทสินค้า") {
            product_type(promptUser);
        } else if (command === "เพิ่มสินค้าในตะกร้า") {
            add_product(product_id, promptUser);
        } else if (command === "ลบสินค้าในตะกร้า") {
            delete_product(product_id, promptUser);
        } else if (command === "แสดงสินค้าในตะกร้า") {
            cart_view(promptUser);
        } else if (command === "exit") {
            rl.close(); 
        } else {
            console.log("คำสั่งไม่ถูกต้อง");
            promptUser();
        }
    });
}

function product_list(callback) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const jsonData = JSON.parse(data);
        const productsWithBalance = jsonData.map(product => {
            return { ...product, balance: product.quantity }; 
        });

        console.table(productsWithBalance, ["name", "price", "category", "quantity", "product_id", "balance"]);
        callback();
    });
}


function product_type(callback) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback();
            return;
        }

        const jsonData = JSON.parse(data);
        const categoryCounts = {};

        jsonData.forEach((item) => {
            const category = item.category;
            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        const tableData = Object.entries(categoryCounts).map(([category, amount]) => ({ category, amount }));
        console.table(tableData, ["category", "amount"]);
        callback();
    });
}

function add_product(product_id, callback) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback();
            return;
        }

        const jsonData = JSON.parse(data);
        const product = jsonData.find(item => item.product_id === product_id);

        if (product && product.quantity > 0) {
            product.quantity--; 
            shoppingCart.push(product); 
            console.log(`เพิ่มสินค้า ${product.name} ในตะกร้าสำเร็จ`);
        } else {
            console.log("ไม่พบสินค้าหรือสินค้าหมด");
        }
        callback();
    });
}

function delete_product(product_id, callback) {
    const productIndex = shoppingCart.findIndex(item => item.product_id === product_id);

    if (productIndex !== -1) {
        const product = shoppingCart[productIndex];
        shoppingCart.splice(productIndex, 1); 
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                callback();
                return;
            }
            const jsonData = JSON.parse(data);
            const originalProduct = jsonData.find(item => item.product_id === product_id);
            if (originalProduct) {
                originalProduct.quantity++; 
                fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), err => {
                    if (err) {
                        console.error(err);
                        callback();
                        return;
                    }
                    console.log(`ลบสินค้า ${product.name} ออกจากตะกร้าสำเร็จ`);
                    callback();
                });
            } else {
                console.log("ไม่พบสินค้าในตะกร้า");
                callback();
            }
        });
    } else {
        console.log("ไม่พบสินค้าในตะกร้า");
        callback();
    }
}

function cart_view(callback) {
    if (shoppingCart.length > 0) {
        console.log("สินค้าที่มีในตะกร้า:");
        const formattedData = shoppingCart.map(item => ({
            name: item.name,
            price: item.price,
            amount: 1, 
            all_price: item.price * 1 
        }));
        console.table(formattedData, ["name", "price", "amount", "all_price"]);
    } else {
        console.log("ไม่มีสินค้าในตะกร้า");
    }
    callback();
}

main();

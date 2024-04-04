const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let shoppingCart = [];

let data = fs.readFileSync('./data.json');
let products = JSON.parse(data).map(product => {
    return { ...product, balance: product.quantity };
});


function main() {
    promptUser();
}

function promptUser() {
    rl.question('กรุณาพิมพ์คำสั่ง(ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า): ', (userInput) => {
        const [command, product_id] = userInput.split(' ');

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
    console.table(products);
    callback();
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

    const product = products.find(item => item.product_id === product_id);

    if (product && product.balance > 0) {
        product.balance--;

        shoppingCart.push(product);
        console.log(`เพิ่มสินค้า ${product.name} ในตะกร้าสำเร็จ`);
    } else {
        console.log("ไม่พบสินค้า");
    }
    callback();
}

function delete_product(product_id, callback) {
    const productCartIndex = shoppingCart.findIndex(item => item.product_id === product_id);

    if (productCartIndex !== -1) {
        shoppingCart.splice(productCartIndex, 1);

        const productIndex = products.findIndex((item) => item.product_id === product_id)
        if (productIndex !== -1) {
            products[productIndex].balance++

            console.log(`ลบสินค้า ${products[productIndex].name} ออกจากตะกร้าสำเร็จ`);
        } else {
            console.log("ไม่พบสินค้า");
        }

    } else {
        console.log("ไม่พบสินค้าในตะกร้า");
    }
    callback();
}

function cart_view(callback) {
    if (shoppingCart.length > 0) {
        const cartItems = {};
        shoppingCart.forEach(item => {
            if (!cartItems[item.product_id]) {
                cartItems[item.product_id] = { ...item, amount: 1, all_price: item.price };
            } else {
                cartItems[item.product_id].amount++;
                cartItems[item.product_id].all_price += item.price;
            }
        });

        let totalPrice = 0;
        Object.values(cartItems).forEach(item => {
            totalPrice += item.all_price;
        });
        cartItems['รวม'] = { name: 'รวม', price: '', amount: '', all_price: totalPrice };

        const formattedData = Object.values(cartItems);
        console.table(formattedData, ["name", "price", "amount", "all_price"]);
    } else {
        console.log("ไม่มีสินค้าในตะกร้า");
    }
    callback();
}

main();

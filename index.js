const { rejects } = require('node:assert');
const readline = require('node:readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {

    try {
        let value = new Promise((resolve, reject) => {
            rl.question('กรุณาพิมพ์ค่าคำสั่ง(ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า):  ', (user_input) => {
                if (user_input === "ดูรายการสินค้า") {
                    resolve(product_list());
                } else if (user_input === "ดูประเภทสินค้า") {
                    resolve(product_type());
                } else if (user_input === "เพิ่มสินค้าในตะกร้า") {
                    resolve(add_product());
                } else if (user_input === "ลบสินค้าในตะกร้า") {
                    resolve(delete_product());
                } else if (user_input === "แสดงสินค้าในตะกร้า") {
                    resolve(cart_view())
                } else {
                    reject("คำสั่งไม่ถูกต้อง")
                }
                rl.close();
            }); 
        });
    } catch (e) {
        console.log(e);

    }

}

function product_list() {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const jsonData = JSON.parse(data);
        console.table(jsonData, ["name", "price", "category", "quantity", "product_id", "balance"]);
    });
}

// function product_list() {
//     fs.readFile('data.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }

//         const jsonData = JSON.parse(data);
//         console.table(jsonData);
//     });
// }

function product_type() {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
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

        // Prepare data for console.table
        const tableData = Object.entries(categoryCounts).map(([category, amount]) => ({ category, amount }));

        // Display category counts using console.table
        console.table(tableData, ["category", "amount"]);
    });
}



function add_product() {

}

function delete_product() {

}

function cart_view() {

}

main()
// product_list()
// product_type()
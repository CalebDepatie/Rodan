
async function newOnePayment(cat: number, com: number, name: string, price: number, date: Date) {

};

async function newRecurPayment(cat: number, com: number, name: string, price: number, start_date: Date, end_date: Date) {

};


export {newOnePayment, newRecurPayment}; 

/* from when i tried to rig sql connections through react
export {sql};

const db = createConnectionPool('postgres://howling:wolf@localhost:50000/finance');
export default db;

const {categories, companies, reccurring, once} = tables<DatabaseSchema>({
  serializeValue,
});
export {categories, companies, reccurring, once};

async function newOnePayment(cat: number, com: number, name: string, price: number, date: Date) {
	await once(db).insert({category_id: cat, company_id: com, name, price, date});
	await db.dispose();
};

async function newRecurPayment(cat: number, com: number, name: string, price: number, start_date: Date, end_date: Date) {
	await reccurring(db).insert({category_id: cat, company_id: com, name, price, start_time: start_date, end_time: end_date});
	await db.dispose();
};

export {newOnePayment, newRecurPayment}; */
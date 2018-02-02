```js

const data = [];

let i = 0;
while (i < 10) {
    data.push({
        id: i,
        name: `First name for ${i}`,
        address: `Address for ${i}`
    });
    i++;
}

<Table data={data}>
    <TableColumn text="Id" propertyKey={'id'} />
    <TableColumn text="Name" propertyKey={'name'} />
    <TableColumn text="Address" propertyKey={'address'} />
</Table>

```